<?php
class User{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//Get all users
    public function getusers(){
        $this->db->query("SELECT * FROM user ORDER BY created_at DESC");
        return $this->db->resultSet();
    }

//Get single user by ID
    public function getById($id){
        $this->db->query("SELECT * FROM user WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

//Filter user by role (staff, member, guest)
    public function getByRole($role){
        $this->db->query("SELECT * FROM user WHERE role = :role ORDER BY created_at DESC");
        $this->db->bind(':role', $role);
        return $this->db->resultSet();
    }

//register - add a user to database
    public function register($data){
        // ensure a sensible default when no role is supplied
        $role = !empty($data['role']) ? $data['role'] : 'guest';

        $sql = ("INSERT INTO user (first_name, last_name, email, phone, role, date_of_birth, emergency_contact, password, staff_role) VALUES (:first_name, :last_name, :email, :phone, :role, :date_of_birth, :emergency_contact, :password, :staff_role)");
        $this->db->query($sql);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        $this->db->bind(':role', $role);
        $this->db->bind(':date_of_birth', $data['date_of_birth'] ?? null);
        $this->db->bind(':emergency_contact', $data['emergency_contact'] ?? null);
        $this->db->bind(':password', $data['password'] ?? null);
        $this->db->bind(':staff_role', $data['staff_role'] ?? null);

        if($this->db->execute()){
            return $this->db->lastInsertId();
        } else {
            return false;
        }
    }

    public function login($email, $password){
        $this->db->query("SELECT * FROM user WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();

        if($row){
            $hashed_password = $row->password;
            if(password_verify($password, $hashed_password)){
                return $row;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Update user
    public function update($id, $data){
        $sql = "UPDATE user SET first_name = :first_name, last_name = :last_name, email = :email, phone = :phone, role = :role, date_of_birth = :date_of_birth, emergency_contact = :emergency_contact, membership_id = :membership_id, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        $this->db->bind(':role', $data['role']);
        $this->db->bind(':date_of_birth', $data['date_of_birth'] ?? null);
        $this->db->bind(':emergency_contact', $data['emergency_contact'] ?? null);
        $this->db->bind(':membership_id', $data['membership_id'] ?? null);
        $this->db->bind(':id', $id);

        if ($this->db->execute()) {
            return $this->db->rowCount() > 0;
        }
        return false;
    }

    // Delete user
    public function delete($id){
        try {
            $this->db->query("DELETE FROM user WHERE id = :id");
            $this->db->bind(':id', $id);
            $this->db->execute();
            return $this->db->rowCount() > 0;
        } catch (PDOException $e) {
            // likely foreign key constraint or similar
            return false;
        }
    }

    // Check email uniqueness (optionally exclude an id)
    public function isEmailTaken($email, $excludeId = null){
        $sql = "SELECT id FROM user WHERE email = :email";
        if ($excludeId) $sql .= " AND id != :id";
        $this->db->query($sql);
        $this->db->bind(':email', $email);
        if ($excludeId) $this->db->bind(':id', $excludeId);
        $row = $this->db->single();
        return $row ? true : false;
    }

    // Check phone uniqueness (optionally exclude an id)
    public function isPhoneTaken($phone, $excludeId = null){
        $sql = "SELECT id FROM user WHERE phone = :phone";
        if ($excludeId) $sql .= " AND id != :id";
        $this->db->query($sql);
        $this->db->bind(':phone', $phone);
        if ($excludeId) $this->db->bind(':id', $excludeId);
        $row = $this->db->single();
        return $row ? true : false;
    }

    // Find user by name
    public function findName($name){
        $this->db->query("SELECT * FROM user WHERE first_name = :name OR last_name = :name");
        $this->db->bind(':name', $name);
        $row = $this->db->single();
        if($row){
            return $row;
        } else {
            return false;
        }
    }

    // Find user by email
    public function findEmail($email){
        $this->db->query("SELECT id FROM user WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        return $row ? true : false;
    }

    // Find user by phone
    public function findPhone($phone){
        $this->db->query("SELECT id FROM user WHERE phone = :phone");
        $this->db->bind(':phone', $phone);
        $row = $this->db->single();
        return $row ? true : false;
    }
}