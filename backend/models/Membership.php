<?php
class Membership{
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    // Assign membership to user (create or update member record)
    public function assignMembership($userId, $membershipId, $data){
        // Update user record with membership details
        $sql = "UPDATE user SET membership_id = :membership_id, role = 'member', date_of_birth = :date_of_birth, emergency_contact = :emergency_contact WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':membership_id', $membershipId);
        $this->db->bind(':date_of_birth', $data['date_of_birth'] ?? null);
        $this->db->bind(':emergency_contact', $data['emergency_contact'] ?? null);
        $this->db->bind(':id', $userId);

        return $this->db->execute();
    }

    // Transactional creation of membership and assignment
    public function createMembershipForUser($data, $paymentData = null) {
        try {
            $this->db->beginTransaction();

            $days = $this->getDaysFromType($data['membership_type']);
            $endDate = date('Y-m-d', strtotime($data['start_date'] . " + $days days"));

            $sql = ("INSERT INTO membership (membership_type, start_date, end_date, is_paused, membership_status) VALUES (:membership_type, :start_date, :end_date, :is_paused, :membership_status)");
            $this->db->query($sql);
            $this->db->bind(':membership_type', $data['membership_type']);
            $this->db->bind(':start_date', $data['start_date']);
            $this->db->bind(':end_date', $endDate);
            $this->db->bind(':is_paused', $data['is_paused'] ?? false);
            $this->db->bind(':membership_status', $data['membership_status'] ?? 'active');

            if (!$this->db->execute()) {
                $this->db->rollBack();
                return false;
            }
            $membershipId = $this->db->lastInsertId();

            if (!$this->assignMembership($data['user_id'], $membershipId, $data)) {
                $this->db->rollBack();
                return false;
            }

            // Handle Payment
            if ($paymentData) {
                $paymentSql = "INSERT INTO payment (payment_type, user_id, membership_id, staff_id, method, amount, is_paid) VALUES ('registration', :user_id, :membership_id, :staff_id, :method, :amount, 1)";
                $this->db->query($paymentSql);
                $this->db->bind(':user_id', $data['user_id']);
                $this->db->bind(':membership_id', $membershipId);
                $this->db->bind(':staff_id', $paymentData['staff_id']);
                $this->db->bind(':method', $paymentData['method']);
                $this->db->bind(':amount', $paymentData['amount']);
                
                if (!$this->db->execute()) {
                    $this->db->rollBack();
                    return false;
                }
            }

            return $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    //update existing membership of a member
    public function updateMembership($data){
        $fields = [];
        $params = [':id' => $data['id']];

        $updatableFields = ['membership_type', 'start_date', 'end_date', 'is_paused', 'membership_status'];
        
        foreach ($updatableFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return true;
        }

        $sql = "UPDATE membership SET " . implode(', ', $fields) . " WHERE id = :id";
        $this->db->query($sql);
        
        foreach ($params as $key => $value) {
            $this->db->bind($key, $value);
        }

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }


//expire membership
    public function expireMembership($id){
        $sql = "UPDATE membership SET membership_status = 'expired' WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':id', $id);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

//pause membership
    public function pauseMembership($id){
        $sql = "UPDATE membership SET is_paused = TRUE, membership_status = 'paused' WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':id', $id);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

//resume membership
    public function resumeMembership($id){
        // Only resume if currently paused
        $this->db->query("SELECT membership_status FROM membership WHERE id = :id");
        $this->db->bind(':id', $id);
        $current = $this->db->single();

        if (!$current || $current->membership_status !== 'paused') {
            return false;
        }
        $sql = "UPDATE membership SET is_paused = FALSE, membership_status = 'active' WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':id', $id);

        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    // Check and expire membership based on date
    public function checkAndExpireMembership($id) {
        $this->db->query("SELECT * FROM membership WHERE id = :id");
        $this->db->bind(':id', $id);
        $membership = $this->db->single();

        if ($membership && $membership->membership_status === 'active') {
            if (date('Y-m-d') > $membership->end_date) {
                return $this->expireMembership($id);
            }
        }
        return true;
    }

    // Renew membership logic
    public function renewMembership($id, $paymentData = null) {
        try {
            $this->db->beginTransaction();

        $this->db->query("SELECT * FROM membership WHERE id = :id");
        $this->db->bind(':id', $id);
        $membership = $this->db->single();

            if (!$membership) {
                $this->db->rollBack();
                return false;
            }

        $daysToAdd = $this->getDaysFromType($membership->membership_type);
        $currentEndDate = $membership->end_date;
        $today = date('Y-m-d');

        // If expired, start renewal from today. If active, extend from current end date.
        if ($membership->membership_status === 'expired' || $currentEndDate < $today) {
            $newEndDate = date('Y-m-d', strtotime($today . " + $daysToAdd days"));
        } else {
            $newEndDate = date('Y-m-d', strtotime($currentEndDate . " + $daysToAdd days"));
        }

        $sql = "UPDATE membership SET end_date = :end_date, membership_status = 'active', is_paused = 0 WHERE id = :id";
        $this->db->query($sql);
        $this->db->bind(':end_date', $newEndDate);
        $this->db->bind(':id', $id);

            if (!$this->db->execute()) {
                $this->db->rollBack();
                return false;
            }

            // Handle Payment
            if ($paymentData) {
                // Need user_id for payment record
                $this->db->query("SELECT id FROM user WHERE membership_id = :membership_id");
                $this->db->bind(':membership_id', $id);
                $user = $this->db->single();
                $userId = $user ? $user->id : null;

                $paymentSql = "INSERT INTO payment (payment_type, user_id, membership_id, staff_id, method, amount, is_paid) VALUES ('renewal', :user_id, :membership_id, :staff_id, :method, :amount, 1)";
                $this->db->query($paymentSql);
                $this->db->bind(':user_id', $userId);
                $this->db->bind(':membership_id', $id);
                $this->db->bind(':staff_id', $paymentData['staff_id']);
                $this->db->bind(':method', $paymentData['method']);
                $this->db->bind(':amount', $paymentData['amount']);
                
                if (!$this->db->execute()) {
                    $this->db->rollBack();
                    return false;
                }
            }

            return $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    private function getDaysFromType($type) {
        switch ($type) {
            case '30-day': return 30;
            case '90-day': return 90;
            default: return 30;
        }
    }

//get all active memberships
    public function getActiveMemberships(){
        $this->db->query("SELECT * FROM membership WHERE membership_status = 'active' ORDER BY start_date DESC");
        return $this->db->resultSet();
    }

//get all paused memberships
    public function getPausedMemberships(){
        $this->db->query("SELECT * FROM membership WHERE membership_status = 'paused' ORDER BY start_date DESC");
        return $this->db->resultSet();
    }

// get all expired memberships
    public function getExpiredMemberships(){
        $this->db->query("SELECT * FROM membership WHERE membership_status = 'expired' ORDER BY start_date DESC");
        return $this->db->resultSet();
    }
//look for specific membership of a member
    public function findMembership($id){
        $this->db->query("SELECT * FROM membership WHERE id = :id");
        $this->db->bind(':id', $id);
        $row = $this->db->single();
        if($row){
            return $row;
        } else {
            return false;
        }
    }

//get all membership logs
    public function getMembership(){
        $this->db->query("SELECT m.*, u.first_name, u.last_name 
                          FROM membership m 
                          LEFT JOIN user u ON u.membership_id = m.id 
                          ORDER BY m.start_date DESC");
        return $this->db->resultSet();
    }

//delete membership
    public function deleteMembership($id){
        try {
            $this->db->beginTransaction();

            // Unlink users first to maintain integrity
            $this->db->query("UPDATE user SET membership_id = NULL, member_status = 'inactive' WHERE membership_id = :id");
            $this->db->bind(':id', $id);
            $this->db->execute();

            $sql = "DELETE FROM membership WHERE id = :id";
            $this->db->query($sql);
            $this->db->bind(':id', $id);

            if ($this->db->execute()) {
                return $this->db->commit();
            }
            $this->db->rollBack();
            return false;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}