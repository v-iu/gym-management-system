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

        $this->db->query("INSERT INTO attendance (member_id, guest_id, staff_id, check_in_time) 
                          VALUES (:member_id, :guest_id, :staff_id, :check_in_time)");
        $this->db->bind(':member_id', $data['member_id']);
        $this->db->bind(':guest_id', $data['guest_id']);
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
    public function isCheckedIn($type, $personId){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');

        $column = ($type === 'member') ? 'member_id' : 'guest_id';
        $this->db->query("SELECT id FROM attendance 
                          WHERE {$column} = :person_id 
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
        $this->db->query("SELECT a.id, a.member_id, a.guest_id, a.staff_id, a.check_in_time, a.check_out_time,
                          m.first_name AS member_first_name, m.last_name AS member_last_name,
                          g.first_name AS guest_first_name, g.last_name AS guest_last_name,
                          s.first_name AS staff_first_name, s.last_name AS staff_last_name
                          FROM attendance a 
                          LEFT JOIN member m ON a.member_id = m.id 
                          LEFT JOIN guest g ON a.guest_id = g.id 
                          LEFT JOIN staff s ON a.staff_id = s.id 
                          ORDER BY a.check_in_time DESC");
        return $this->db->resultSet();
    }

//getToday - today's attendance only
    public function getToday(){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');

        $this->db->query("SELECT a.id, a.member_id, a.guest_id, a.staff_id, a.check_in_time, a.check_out_time,
                          m.first_name AS member_first_name, m.last_name AS member_last_name,
                          g.first_name AS guest_first_name, g.last_name AS guest_last_name,
                          s.first_name AS staff_first_name, s.last_name AS staff_last_name
                          FROM attendance a 
                          LEFT JOIN member m ON a.member_id = m.id 
                          LEFT JOIN guest g ON a.guest_id = g.id 
                          LEFT JOIN staff s ON a.staff_id = s.id 
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
