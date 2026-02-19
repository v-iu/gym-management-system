<?php
class Attendance {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//checkIn - insert attendance record with check-in time
    public function checkIn($data){
        date_default_timezone_set('Asia/Manila');
        $now = date('Y-m-d H:i:s');

        $this->db->query("INSERT INTO attendance (user_id, staff_id, check_in_time) 
                          VALUES (:user_id, :staff_id, :check_in_time)");
        $this->db->bind(':user_id', $data['user_id']);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':check_in_time', $now);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//checkOut - set check-out time on an existing attendance record by its ID
    public function checkOut($attendanceId){
        date_default_timezone_set('Asia/Manila');
        $now = date('Y-m-d H:i:s');

        $this->db->query("UPDATE attendance SET check_out_time = :checkout 
                          WHERE id = :id AND check_out_time IS NULL");
        $this->db->bind(':checkout', $now);
        $this->db->bind(':id', $attendanceId);
        $this->db->execute();

        return $this->db->rowCount() > 0;
    }

//isCheckedIn - check if a person is already checked in today (no checkout yet)
    public function isCheckedIn($personId){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');

        $this->db->query("SELECT id FROM attendance 
                          WHERE user_id = :person_id 
                          AND DATE(check_in_time) = :today 
                          AND check_out_time IS NULL 
                          LIMIT 1");
        $this->db->bind(':person_id', $personId);
        $this->db->bind(':today', $today);
        $row = $this->db->single();

        return $row ? true : false;
    }

//getAttendance - all attendance logs with joined names
    public function getAttendance(){
        $this->db->query("SELECT a.id, a.user_id, a.staff_id, a.check_in_time, a.check_out_time,
                          u.first_name AS user_first_name, u.last_name AS user_last_name, u.type AS user_type,
                          s_user.first_name AS staff_first_name, s_user.last_name AS staff_last_name
                          FROM attendance a 
                          JOIN user u ON a.user_id = u.id 
                          JOIN staff s ON a.staff_id = s.id 
                          JOIN user s_user ON s.id = s_user.id
                          ORDER BY a.check_in_time DESC");
        return $this->db->resultSet();
    }

//getToday - today's attendance only
    public function getToday(){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');

        $this->db->query("SELECT a.id, a.user_id, a.staff_id, a.check_in_time, a.check_out_time,
                          u.first_name AS user_first_name, u.last_name AS user_last_name, u.type AS user_type,
                          s_user.first_name AS staff_first_name, s_user.last_name AS staff_last_name
                          FROM attendance a 
                          JOIN user u ON a.user_id = u.id 
                          JOIN staff s ON a.staff_id = s.id 
                          JOIN user s_user ON s.id = s_user.id
                          WHERE DATE(a.check_in_time) = :today
                          ORDER BY a.check_in_time DESC");
        $this->db->bind(':today', $today);
        return $this->db->resultSet();
    }

//todayCount - count of check-ins today (for dashboard)
    public function todayCount(){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');
        $this->db->query("SELECT COUNT(*) AS total FROM attendance WHERE DATE(check_in_time) = :today");
        $this->db->bind(':today', $today);
        return $this->db->single()->total;
    }
}
