<?php
class TrainerSession{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add a trainer session
    public function create($data){
        $sql = ("INSERT INTO trainer_session (member_id, staff_id, service_id, session_date, status) VALUES (:member_id, :staff_id, :duration_minutes)");
        $this->db->query($sql);
        $this->db->bind(':member_id', $data['member_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':service_id', $data['service_id']);
        $this->db->bind(':session_date', $data['session_date']);
        $this->db->bind(':status', $data['status'] ?? 'scheduled');

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update existing trainer session
    public function update($data) {
        $sql = "UPDATE trainer_session SET member_id = :member_id, staff_id = :staff_id, service_id = :service_id, session_date = :session_date, status = :status WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':member_id', $data['member_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':service_id', $data['service_id']);
        $this->db->bind(':session_date', $data['session_date']);
        $this->db->bind(':status', $data['status'] ?? 'scheduled');
        $this->db->bind(':id', $data['id']);
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }
//delete trainer session
    public function delete($id){
        try {
            $this->db->query("DELETE FROM trainer_session WHERE id = :id");
            $this->db->bind(':id', $id);
            $this->db->execute();
            return $this->db->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
//get all logs of trainer sessions
    public function getAll(){
        $this->db->query("SELECT t.*, m.first_name AS member_first_name, m.last_name AS member_last_name, s.first_name AS staff_first_name, s.last_name AS staff_last_name, ts.service_name AS service_name FROM trainer_session t 
        LEFT JOIN user m ON t.member_id = m.id
        LEFT JOIN user s ON t.staff_id = s.id
        LEFT JOIN trainer_service ts ON t.service_id = ts.id
        ORDER BY t.session_date DESC");
        return $this->db->resultSet();
    }
//get session by id
    public function getByID($id){
        $this->db->query("SELECT * from trainer_session WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }
}