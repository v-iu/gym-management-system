<?php
class Members{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//show all registered members
    public function getMembers(){
        $this->db->query("SELECT first_name, last_name, email, phone, date_of_birthcreated_at FROM guest");
        return $this->db->resultSet();
    }
//register - add a member to database
    public function register($data){
        $sql = ("INSERT INTO member (first_name, membership_id, last_name, email, phone, date_of_birth, emergency_contact, member_status) VALUES (:first_name, :membership_id, :last_name, :email, :phone, :date_of_birth, :emergency_contact, 'active')");
        $this->db->query($sql);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':membership_id', $data['membership_id']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        $this->db->bind(':date_of_birth', $data['date_of_birth']);
        $this->db->bind(':emergency_contact', $data['emergency_contact']);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }
    public function findEmail($email){
        $this->db->query("SELECT * FROM member WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        if($row){
            return $row;
        } else {
            return false;
        }
    }
}