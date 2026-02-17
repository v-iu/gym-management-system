<?php
class Guest{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//register - add a guest to database
    public function register($data){
        $sql = ("INSERT INTO guest (first_name, last_name, email, phone) VALUES (:first_name, :last_name, :email, :phone)");
        $this->db->query($sql);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//verify guest existance by email
    public function findEmail($email){
        $this->db->query("SELECT * FROM guest WHERE email = :email");
        $this->db->bind(':email', $email);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }
//verify guest existance by phone
    public function findPhone($phone){
        $this->db->query("SELECT * FROM guest WHERE phone = :phone");
        $this->db->bind(':phone', $phone);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }
//getGuestId - get guest id for foreign keys
    public function getGuestId(){}
}