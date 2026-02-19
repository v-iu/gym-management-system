<?php
class Staff {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    // Get all staff
    public function getAll(){
        $this->db->query("SELECT u.id, u.first_name, u.last_name, u.email, u.phone, s.date_of_birth, s.role, u.created_at 
                          FROM staff s 
                          JOIN user u ON s.id = u.id 
                          ORDER BY u.id DESC");
        return $this->db->resultSet();
    }

    // Get single staff by ID
    public function getById($id){
        $this->db->query("SELECT u.id, u.first_name, u.last_name, u.email, u.phone, s.date_of_birth, s.role, u.created_at 
                          FROM staff s 
                          JOIN user u ON s.id = u.id 
                          WHERE s.id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    // Register staff
    public function register($data){
        // 1. Insert into user
        $this->db->query("INSERT INTO user (first_name, last_name, email, phone, type) 
                          VALUES (:first_name, :last_name, :email, :phone, 'staff')");
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        
        if(!$this->db->execute()){
            return false;
        }

        $id = $this->db->lastInsertId();

        // 2. Insert into staff
        $this->db->query("INSERT INTO staff (id, date_of_birth, role, password) 
                          VALUES (:id, :date_of_birth, :role, :password)");
        $this->db->bind(':id', $id);
        $this->db->bind(':date_of_birth', $data['date_of_birth']);
        $this->db->bind(':role', $data['role'] ?? 'trainer');
        $this->db->bind(':password', $data['password']);
        
        return $this->db->execute();
    }

    // Update staff
    public function update($id, $data){
        // Update user table
        $this->db->query("UPDATE user SET first_name = :first_name, last_name = :last_name, email = :email, phone = :phone WHERE id = :id");
        $this->db->bind(':id', $id);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        if(!$this->db->execute()) return false;

        // Update staff table
        $this->db->query("UPDATE staff SET date_of_birth = :date_of_birth, role = :role WHERE id = :id");
        $this->db->bind(':id', $id);
        $this->db->bind(':date_of_birth', $data['date_of_birth']);
        $this->db->bind(':role', $data['role'] ?? 'trainer');
        return $this->db->execute();
    }

    // Delete staff
    public function delete($id){
        // Deleting from user cascades to staff
        $this->db->query("DELETE FROM user WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    // Find by email
    public function findEmail($email){
        $this->db->query("SELECT * FROM user WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        return $row ?: false;
    }

    // Find by phone
    public function findPhone($phone){
        $this->db->query("SELECT * FROM user WHERE phone = :phone");
        $this->db->bind(':phone', $phone);
        $row = $this->db->single();
        return $row ?: false;
    }

    // Login staff
    public function login($email, $password){
        $this->db->query("SELECT u.id, u.email, u.first_name, u.last_name, s.password, s.role 
                          FROM user u 
                          JOIN staff s ON u.id = s.id 
                          WHERE u.email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        if ($row && password_verify($password, $row->password)) {
            return $row;
        }
        return false;
    }

    // Count total staff
    public function count(){
        $this->db->query("SELECT COUNT(*) AS total FROM user WHERE type = 'staff'");
        return $this->db->single()->total;
    }

    // Get trainers only (for dropdowns)
    public function getTrainers(){
        $this->db->query("SELECT u.id, u.first_name, u.last_name FROM staff s JOIN user u ON s.id = u.id WHERE s.role = 'trainer' ORDER BY u.first_name");
        return $this->db->resultSet();
    }
}
