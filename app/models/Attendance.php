<?php
class Attendance {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//checkIn - check in time
    public function checkIn($member_id, $guest_id, $staff_id){
        //get date time now
        date_default_timezone_set('Asia/Manila');
        $date = date('Y-m-d H:i:s');  

        //insert to create new attendance record w check in time
        //if guest id, insert with guest id and staff id, if member id, insert member id and staff id
        if ($guest_id){
            $sql = ("INSERT INTO attendance (guest_id, staff_id, check_in_time) VALUES (:guest_id, :staff_id,:check_in_time)");
            $this->db->query($sql);
            $this->db->bind(':guest_id', $guest_id);
            $this->db->bind(':staff_id', $staff_id);
            $this->db->bind(':check_in_time', $date);    
        } else if ($member_id){
            $sql = ("INSERT INTO attendance (member_id, staff_id, check_in_time) VALUES (:member_id, :staff_id, :check_in_time)");
            $this->db->query($sql);
            $this->db->bind(':member_id', $member_id);
            $this->db->bind(':staff_id', $staff_id);
            $this->db->bind(':check_in_time', $date);
        }

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//checkOut - check out time
    public function checkOut($member_id, $guest_id){
        //get date time now
        date_default_timezone_set('Asia/Manila');
        $date = date('Y-m-d') . '%'; //only get current date w % to match any time on certain date
        $datetime = date('Y-m-d H:i:s');  //date and time for check out time

        //get the attendance id first - select the specific guest/member/staff id on the specific date to update
        if ($guest_id){
            $this->db->query("SELECT id FROM attendance WHERE guest_id = :guest_id AND DATE(check_in_time) = :date");
            $this->db->bind(':guest_id', $guest_id);
            $this->db->bind(':date', $date);
            $id = $this->db->single();
            
        } else if ($member_id){
            $this->db->query("SELECT id FROM attendance WHERE member_id = :member_id AND DATE(check_in_time) = :date");
            $this->db->bind(':member_id', $member_id);
            $this->db->bind(':date', $date);
            $id = $this->db->single();
        }
        
        //update record to set check out time
        $sql = ("UPDATE attendance SET check_out_time = :checkout WHERE id = :id");
        $this->db->query($sql);
        $this->db->bind(':checkout', $datetime);
        $this->db->bind(':id', $id);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//getAttendance - to view attendance logs
    public function getAttendance(){
        $this->db->query("SELECT a.id, s.first_name AS first_name, s.last_name AS last_name, g.first_name AS first_name, g.last_name AS last_name, m.first_name AS first_name, m.last_name AS last_name, a.check_in_time, a.check_out_time FROM attendance a LEFT JOIN staff s ON a.staff_id = s.id LEFT JOIN guest g ON a.guest_id = g.id LEFT JOIN member m ON a.member_id = m.id ORDER BY a.check_in_time DESC");
        return $this->db->resultSet();
    }

}