
<?php
class TrainerService{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//adds a service
    public function addService($data){
        $sql = ("INSERT INTO trainer_service (service_name, price, duration_minutes) VALUES (:service_name, :price, :duration_minutes)");
        $this->db->query($sql);
        $this->db->bind(':service_name', $data['service_name']);
        $this->db->bind(':price', $data['price']);
        $this->db->bind(':duration_minutes', $data['duration_minutes']);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//updates existing service
    public function updateService($data) {
        $sql = "UPDATE trainer_service SET service_name = :service_name, price = :price, duration_minutes = :duration_minutes WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':service_name', $data['service_name']);
        $this->db->bind(':price', $data['price']);
        $this->db->bind(':duration_minutess', $data['duration_minutes']);
        $this->db->bind(':id', $data['id']);
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }


//get all trainer service records
    public function getTrainerService(){
        $this->db->query("SELECT * FROM trainer_service ORDER BY service_name DESC");
        return $this->db->resultSet();
    }
}