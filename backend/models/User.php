/*-- 1. USER (Central Identity Table)
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    type ENUM('staff', 'member', 'guest') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);*/

<?php
class User{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//Get all users
    public function getusers(){
        $this->db->query("SELECT id, first_name, last_name, email, phone, created_at FROM user WHERE type = 'member'");
        return $this->db->resultSet();
    }

//Get single user by ID
    public function getById($id){
        $this->db->query("SELECT id, first_name, last_name, email, phone, created_at FROM user WHERE id = :id AND type = 'member'");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

//Filter user by type (staff, member, guest)
    public function getByType($type){
        $this->db->query("SELECT id, first_name, last_name, email, phone, created_at FROM user WHERE type = :type");
        $this->db->bind(':type', $type);
        return $this->db->resultSet();
    }

//register - add a user to database
    public function register($data){
        $sql = ("INSERT INTO user (first_name, last_name, email, phone, type) VALUES (:first_name, :last_name, :email, :phone, 'member')");
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
}