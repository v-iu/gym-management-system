<?php
class Staff{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//register - add a staff member to database
    public function register($data){
        $sql = ("INSERT INTO staff (first_name, last_name, email, phone, date_of_birth, role, password) VALUES (:first_name, :last_name, :email, :phone, :date_of_birth, :role, :password)");
        $this->db->query($sql);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        $this->db->bind(':date_of_birth', $data['date_of_birth']);
        $this->db->bind(':role', $data['role'] ?? 'trainer');
        $this->db->bind(':password', $data['password']);
        
        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//login staff
    public function login($email, $password){
        $this->db->query("SELECT * FROM staff WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        $hash_pass = $row->password;
        if(password_verify($password, $hash_pass)){
            return $row;
        } else {
            return false;
        }
    }
//find existing staff with email
    public function findEmail($email){
        $this->db->query("SELECT * FROM staff WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }
//find existing staff with phone
    public function findPhone($phone){
        $this->db->query("SELECT * FROM staff WHERE phone = :phone");
        $this->db->bind(':phone', $phone);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }
}