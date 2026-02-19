<?php
class Members{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//show all registered members
    public function getMembers(){
        $this->db->query("SELECT u.id, u.first_name, u.last_name, u.email, u.phone, m.date_of_birth, u.created_at, m.member_status 
                          FROM member m
                          JOIN user u ON m.id = u.id");
        return $this->db->resultSet();
    }
//register - add a member to database
    public function register($data){
        // 1. Insert into user table
        $this->db->query("INSERT INTO user (first_name, last_name, email, phone, type) VALUES (:first_name, :last_name, :email, :phone, 'member')");
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        
        if(!$this->db->execute()){
            return false;
        }

        $userId = $this->db->lastInsertId();

        // 2. Insert into member table
        $this->db->query("INSERT INTO member (id, membership_id, date_of_birth, emergency_contact, member_status) VALUES (:id, :membership_id, :date_of_birth, :emergency_contact, :member_status)");
        $this->db->bind(':id', $userId);
        $this->db->bind(':membership_id', $data['membership_id']);
        $this->db->bind(':date_of_birth', $data['date_of_birth']);
        $this->db->bind(':emergency_contact', $data['emergency_contact']);
        $this->db->bind(':member_status', $data['member_status'] ?? 'active');

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }
    public function findEmail($email){
        $this->db->query("SELECT * FROM user WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        return $row ?: false;
    }

    public function findPhone($phone){
        $this->db->query("SELECT * FROM user WHERE phone = :phone");
        $this->db->bind(':phone', $phone);
        $row = $this->db->single();
        return $row ?: false;
    }
}