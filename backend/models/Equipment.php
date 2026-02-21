<?php
class Equipement{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add an equipment
    public function addEquipment($data){
        $sql = ("INSERT INTO equipment (staff_id, name, type, amount, brand, serial_num, warranty_expiry, purchased_on, purchase_cost) VALUES (:staff_id, :name, :type, :amount, :brand, :serial_num, :warranty_expiry, :purchased_on, :purchase_cost)");
        $this->db->query($sql);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':type', $data['type']);
        $this->db->bind(':amount', $data['amount'] ?? 1);
        $this->db->bind(':brand', $data['brand'] ?? '');
        $this->db->bind(':serial_num', $data['serial_num']);
        $this->db->bind(':warranty_expiry', $data['warranty_expiry'] ?? '');
        $this->db->bind(':purchased_on', $data['purchased_on']);
        $this->db->bind(':purchase_cost', $data['purchase_cost']);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update an equipment
    public function updateEquipment($data){
        $sql = ("UPDATE equipment SET staff_id = :staff_id, name = :name, type = :type, amount = :amount, brand = :brand, serial_num = :serial_num, warranty_expiry = :warranty_expiry, purchased_on = :purchased_on, purchase_cost = :purchase_cost WHERE id = :id");
        $this->db->query($sql);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':type', $data['type']);
        $this->db->bind(':amount', $data['amount'] ?? 1);
        $this->db->bind(':brand', $data['brand'] ?? '');
        $this->db->bind(':serial_num', $data['serial_num']);
        $this->db->bind(':warranty_expiry', $data['warranty_expiry'] ?? '');
        $this->db->bind(':purchased_on', $data['purchased_on']);
        $this->db->bind(':purchase_cost', $data['purchase_cost']);
        $this->db->bind(':id', $data['id']);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//get all equipment logs
    public function getEquipments(){
        $this->db->query("SELECT e.*, s.first_name AS staff_fname, s.last_name AS staff_lname FROM equipment e 
        LEFT JOIN staff s ON e.staff_id = s.id 
        ORDER BY e.name DESC");
        return $this->db->resultSet();
    }
}