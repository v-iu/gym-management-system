<?php
class EquipmentRecord{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add record status for an equipment
    public function addRecord($data){
        $sql = ("INSERT INTO equipment_records (equipment_id, staff_id, status) VALUES (:equipment_id, :staff_id, :status)");
        $this->db->query($sql);
        $this->db->bind(':equipment_id', $data['equipment_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':status', $data['status'] ?? 'Good');

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update existing record of an equipment
    public function updateRecord($data) {
        $sql = "UPDATE equipment_records SET equipment_id = :equipment_id, staff_id = :staff_id, status = :status WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':equipment_id', $data['equipment_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':status', $data['status'] ?? 'Good');
        $this->db->bind(':id', $data['id']);
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }


//get all equipment records
    public function getRecords(){
        $this->db->query("SELECT r.*, e.name AS name, s.first_name AS staff_fname, s.last_name AS staff_lname FROM equipment_records r
        LEFT JOIN equipment e ON r.equipment_id = e.id
        LEFT JOIN staff s ON r.staff_id = s.id
        ORDER BY e.name DESC");
        return $this->db->resultSet();
    }
}