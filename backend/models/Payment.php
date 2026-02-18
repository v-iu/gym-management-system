
<?php
class Payment{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//create payment transaction record
    public function createPayment($data){
        $sql = ("INSERT INTO payment (payment_type, membership_id, attendance_id, staff_id, method, amount, is_paid) VALUES (:payment_type, :membership_id, :attendance_id, :staff_id, :method, :amount, :is_paid)");
        $this->db->query($sql);
        $this->db->bind(':payment_type', $data['payment_type']);
        $this->db->bind(':membership_id', $data['membership_id'] ?? '');
        $this->db->bind(':attendance_id', $data['attendance_id'] ?? '');
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':method', $data['method']);
        $this->db->bind(':amount', $data['amount']);
        $this->db->bind(':is_paid', $data['is_paid'] ?? false);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update existing payment transaction
    public function updatePayment($data){
        $sql = ("UPDATE payment SET payment_type = :payment_type, membership_id = :membership_id, attendance_id = :attendance_id, staff_id = :staff_id, method = :method, amount = :amount, is_paid = :is_paid WHERE id = :id");
        $this->db->query($sql);
        $this->db->bind(':payment_type', $data['payment_type']);
        $this->db->bind(':membership_id', $data['membership_id'] ?? '');
        $this->db->bind(':attendance_id', $data['attendance_id'] ?? '');
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':method', $data['method']);
        $this->db->bind(':amount', $data['amount']);
        $this->db->bind(':is_paid', $data['is_paid'] ?? false);
        $this->db->bind(':id', $data['id']);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

//look for specific payment transaction
    public function findPayment($id){
        $this->db->query("SELECT p.*, m.membership_type AS membership_type, a.guest_id AS guest_id FROM payment p
        LEFT JOIN membership m ON p.membership_id = m.id
        LEFT JOIN attendance a ON a.attendance_id = a.id
        WHERE id = :id");
        $this->db->bind(':id', $id);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }

    public function getPayment(){
        $this->db->query("SELECT p.*, m.membership_type AS membership_type, a.guest_id AS guest_id, s.first_name AS staff_fname, s.last_name AS staff_lname FROM payment p
        LEFT JOIN membership m ON p.membership_id = m.id
        LEFT JOIN attendance a ON a.attendance_id = a.id
        LEFT JOIN staff s ON p.staff_id = s.id
        ORDER BY p.payment_date DESC");
        return $this->db->resultSet();
    }
}