<?php
class Equipment {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    // Get all equipment
    public function getAll(){
        $this->db->query("SELECT e.*, s.first_name AS staff_first_name, s.last_name AS staff_last_name 
                          FROM equipment e 
                          LEFT JOIN staff s ON e.staff_id = s.id 
                          ORDER BY e.id DESC");
        return $this->db->resultSet();
    }

    // Get single equipment by ID
    public function getById($id){
        $this->db->query("SELECT e.*, s.first_name AS staff_first_name, s.last_name AS staff_last_name 
                          FROM equipment e 
                          LEFT JOIN staff s ON e.staff_id = s.id 
                          WHERE e.id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    // Create equipment
    public function create($data){
        $this->db->query("INSERT INTO equipment (staff_id, name, type, amount, brand, serial_num, warranty_expiry, purchased_on, purchase_cost) 
                          VALUES (:staff_id, :name, :type, :amount, :brand, :serial_num, :warranty_expiry, :purchased_on, :purchase_cost)");
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':type', $data['type']);
        $this->db->bind(':amount', $data['amount']);
        $this->db->bind(':brand', $data['brand']);
        $this->db->bind(':serial_num', $data['serial_num']);
        $this->db->bind(':warranty_expiry', $data['warranty_expiry']);
        $this->db->bind(':purchased_on', $data['purchased_on']);
        $this->db->bind(':purchase_cost', $data['purchase_cost']);
        return $this->db->execute();
    }

    // Update equipment
    public function update($id, $data){
        $this->db->query("UPDATE equipment SET staff_id = :staff_id, name = :name, type = :type, amount = :amount, 
                          brand = :brand, serial_num = :serial_num, warranty_expiry = :warranty_expiry, 
                          purchased_on = :purchased_on, purchase_cost = :purchase_cost WHERE id = :id");
        $this->db->bind(':id', $id);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':type', $data['type']);
        $this->db->bind(':amount', $data['amount']);
        $this->db->bind(':brand', $data['brand']);
        $this->db->bind(':serial_num', $data['serial_num']);
        $this->db->bind(':warranty_expiry', $data['warranty_expiry']);
        $this->db->bind(':purchased_on', $data['purchased_on']);
        $this->db->bind(':purchase_cost', $data['purchase_cost']);
        return $this->db->execute();
    }

    // Delete equipment
    public function delete($id){
        $this->db->query("DELETE FROM equipment WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    // Get maintenance records for equipment
    public function getRecords($equipmentId){
        $this->db->query("SELECT er.*, s.first_name AS staff_first_name, s.last_name AS staff_last_name 
                          FROM equipment_records er 
                          LEFT JOIN staff s ON er.staff_id = s.id 
                          WHERE er.equipment_id = :equipment_id 
                          ORDER BY er.checked_at DESC");
        $this->db->bind(':equipment_id', $equipmentId);
        return $this->db->resultSet();
    }

    // Add maintenance record
    public function addRecord($data){
        $this->db->query("INSERT INTO equipment_records (equipment_id, staff_id, status) VALUES (:equipment_id, :staff_id, :status)");
        $this->db->bind(':equipment_id', $data['equipment_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':status', $data['status']);
        return $this->db->execute();
    }
}
