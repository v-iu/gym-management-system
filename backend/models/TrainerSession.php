<?php
class TrainerSession{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//add a trainer session
    public function createSession($data){
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
    public function updateSession($data) {
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


//get all logs of trainer sessions
    public function getTrainerSessions(){
        $this->db->query("SELECT t.*, m.first_name AS member_fname, m.last_name AS member_lname, s.first_name AS staff_fname, s.last_name AS staff_lname, ts.service_name AS service_name FROM trainer_session t 
        LEFT JOIN member m ON t.member_id = m.id
        LEFT JOIN staff s ON t.staff_id = s.id
        LEFT JOIN trainer_service ts ON t.service_id = ts.id
        ORDER BY t.service_name DESC");
        return $this->db->resultSet();
    }
}