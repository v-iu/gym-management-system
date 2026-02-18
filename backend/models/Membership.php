<?php
class Membership{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add membership for a member
    public function addMembership($data){
        $sql = ("INSERT INTO membership (membership_type, start_date, total_days, is_paused, membership_status) VALUES (:membership_type, :start_date, :total_days, :is_paused, :membership_status)");
        $this->db->query($sql);
        $this->db->bind(':membership_type', $data['membership_type']);
        $this->db->bind(':start_date', $data['start_date']);
        $this->db->bind(':total_days', $data['total_days']);
        $this->db->bind(':is_paused', $data['is_paused'] ?? false);
        $this->db->bind(':membership_status', $data['membership_status'] ?? 'active');

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update existing membership of a member
    public function updateMembership($data){
        $sql = "UPDATE membership SET membership_type = :membership_type, start_date = :start_date, total_days = :total_days, is_paused = :is_paused, membership_status = :membership_status  WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':membership_type', $data['membership_type']);
        $this->db->bind(':start_date', $data['start_date']);
        $this->db->bind(':total_days', $data['total_days']);
        $this->db->bind(':is_paused', $data['is_paused'] ?? false);
        $this->db->bind(':membership_status', $data['membership_status'] ?? 'active');
        $this->db->bind(':id', $data['id']);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

//look for specific membership of a member
    public function findMembership($id){
        $this->db->query("SELECT * FROM membership WHERE id = :id");
        $this->db->bind(':id', $id);
        $row = $this->db->single();
        if($row){
            return $row;
        } else {
            return false;
        }
    }

//get all membership logs
    public function getMembership(){
        $this->db->query("SELECT * FROM membership ORDER BY start_date DESC");
        return $this->db->resultSet();
    }
}