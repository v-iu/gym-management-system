<?php
class Equipment{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add an equipment
    public function create($data){
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
    public function update($id, $data){
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
        $this->db->bind(':id', $id);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//delete equipment by given id
    public function delete($id){
        try {
            $this->db->query("DELETE FROM equipment WHERE id = :id");
            $this->db->bind(':id', $id);
            $this->db->execute();
            return $this->db->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
//get all equipment logs
    public function getAll(){
        $this->db->query("SELECT e.*, s.first_name AS staff_fname, s.last_name AS staff_lname FROM equipment e 
        LEFT JOIN user s ON e.staff_id = s.id 
        ORDER BY e.name DESC");
        return $this->db->resultSet();
    }

//get specific equipment
    public function getByID($id){
        $this->db->query("SELECT * from equipment WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

//get specific equipment maintenance records
    public function getRecords($id){
        $this->db->query("SELECT * FROM equipment_records WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

//add a maintenance record
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
}