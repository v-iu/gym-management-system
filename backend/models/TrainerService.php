<?php
class TrainerService{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    // Adds a service
    public function addService($data){
        $sql = "INSERT INTO trainer_service (service_name, price, duration_minutes) VALUES (:service_name, :price, :duration_minutes)";
        $this->db->query($sql);
        $this->db->bind(':service_name', $data['service_name']);
        $this->db->bind(':price', $data['price']);
        $this->db->bind(':duration_minutes', $data['duration_minutes']);

        return $this->db->execute();
    }

    // Updates existing service
    public function updateService($data) {
        $sql = "UPDATE trainer_service SET service_name = :service_name, price = :price, duration_minutes = :duration_minutes WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':service_name', $data['service_name']);
        $this->db->bind(':price', $data['price']);
        $this->db->bind(':duration_minutes', $data['duration_minutes']); // ✅ fixed typo
        $this->db->bind(':id', $data['id']);
        return $this->db->execute();
    }

    // Get all trainer service records
    public function getTrainerService(){
        $this->db->query("SELECT * FROM trainer_service ORDER BY service_name DESC");
        return $this->db->resultSet();
    }

    // Optional: Get single service by ID
    public function getById($id){
        $this->db->query("SELECT * FROM trainer_service WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    // Optional: Delete service
    public function delete($id){
        $this->db->query("DELETE FROM trainer_service WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }
}
