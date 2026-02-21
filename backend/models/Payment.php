
<?php
class Payment{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

//create payment transaction record
    public function create($data){
        // include tendered and change_amount columns (nullable) so values sent
        // from frontend are persisted
        $sql = "INSERT INTO payment (payment_type, user_id, membership_id, attendance_id, staff_id, method, amount, tendered, change_amount, is_paid) 
                VALUES (:payment_type, :user_id, :membership_id, :attendance_id, :staff_id, :method, :amount, :tendered, :change_amount, :is_paid)";
        $this->db->query($sql);
        $this->db->bind(':payment_type', $data['payment_type']);
        $this->db->bind(':user_id', $data['user_id'] ?? null);
        $this->db->bind(':membership_id', $data['membership_id'] ?? null);
        $this->db->bind(':attendance_id', $data['attendance_id'] ?? null);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':method', $data['method']);
        $this->db->bind(':amount', $data['amount']);
        // tendered & change amount may be null
        $this->db->bind(':tendered', $data['tendered'] ?? null);
        $this->db->bind(':change_amount', $data['change_amount'] ?? null);
        $this->db->bind(':is_paid', $data['is_paid'] ?? false);

        if($this->db->execute()){
            return true;
        } else {
            return false;
        }
    }

//update existing payment transaction
    public function update($id, $data){
        // update all relevant columns including tendered/change
        $sql = "UPDATE payment SET payment_type = :payment_type, user_id = :user_id, membership_id = :membership_id, 
                 attendance_id = :attendance_id, staff_id = :staff_id, method = :method, amount = :amount, 
                 tendered = :tendered, change_amount = :change_amount, is_paid = :is_paid WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':payment_type', $data['payment_type']);
        $this->db->bind(':user_id', $data['user_id'] ?? null);
        $this->db->bind(':membership_id', $data['membership_id'] ?? null);
        $this->db->bind(':attendance_id', $data['attendance_id'] ?? null);
        $this->db->bind(':staff_id', $data['staff_id']);
        $this->db->bind(':method', $data['method']);
        $this->db->bind(':amount', $data['amount']);
        $this->db->bind(':tendered', $data['tendered'] ?? null);
        $this->db->bind(':change_amount', $data['change_amount'] ?? null);
        $this->db->bind(':is_paid', $data['is_paid'] ?? false);
        $this->db->bind(':id', $id);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

//look for specific payment transaction
    public function getById($id){
        $this->db->query("SELECT p.*, m.membership_type AS membership_type, u.first_name AS user_fname, u.last_name AS user_lname FROM payment p
        LEFT JOIN membership m ON p.membership_id = m.id
        LEFT JOIN user u ON p.user_id = u.id
        WHERE id = :id");
        $this->db->bind(':id', $id);
        $row = $this->db->single();

        if($row){
            return $row;
        } else {
            return false;
        }
    }

    public function getAll(){
        $this->db->query("SELECT p.*, m.membership_type AS membership_type, u.first_name AS user_fname, u.last_name AS user_lname, s.first_name AS staff_fname, s.last_name AS staff_lname FROM payment p
        LEFT JOIN membership m ON p.membership_id = m.id
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN user s ON p.staff_id = s.id
        ORDER BY p.payment_date DESC");
        return $this->db->resultSet();
    }

    // Aggregated payment report for a date range (optional start/end)
    public function report($start = null, $end = null){
        $sql = "SELECT COUNT(*) AS count, COALESCE(SUM(amount),0) AS total FROM payment WHERE is_paid = 1";
        $params = [];
        if ($start){
            $sql .= " AND DATE(payment_date) >= :start";
            $params[':start'] = $start;
        }
        if ($end){
            $sql .= " AND DATE(payment_date) <= :end";
            $params[':end'] = $end;
        }
        $this->db->query($sql);
        foreach ($params as $k => $v) $this->db->bind($k, $v);
        $row = $this->db->single();
        return $row ? $row : (object)['count' => 0, 'total' => 0];
    }

    public function delete($id){
        $this->db->query("DELETE FROM payment WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    // Check if a user has paid for a one-time visit today
    public function hasPaidToday($userId){
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');

        $this->db->query("SELECT id FROM payment 
                          WHERE user_id = :user_id 
                          AND payment_type = 'one-time' 
                          AND is_paid = 1 
                          AND DATE(payment_date) = :today 
                          LIMIT 1");
        $this->db->bind(':user_id', $userId);
        $this->db->bind(':today', $today);
        
        $row = $this->db->single();
        return $row ? true : false;
    }
}