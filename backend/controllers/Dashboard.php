<?php
class Dashboard extends Controller {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    // GET - Dashboard stats overview
    public function index(){
        $this->requireMethod('GET');

        // Total members (stored in `user` with role = 'member')
        $this->db->query("SELECT COUNT(*) AS total FROM user WHERE role = 'member'");
        $totalMembers = $this->db->single()->total;

        // Total staff (stored in `user` with role = 'staff')
        $this->db->query("SELECT COUNT(*) AS total FROM user WHERE role = 'staff'");
        $totalStaff = $this->db->single()->total;

        // Active memberships
        $this->db->query("SELECT COUNT(*) AS total FROM membership WHERE membership_status = 'active'");
        $activeMemberships = $this->db->single()->total;

        // Today's attendance (using Asia/Manila timezone)
        date_default_timezone_set('Asia/Manila');
        $today = date('Y-m-d');
        $this->db->query("SELECT COUNT(*) AS total FROM attendance WHERE DATE(check_in_time) = :today");
        $this->db->bind(':today', $today);
        $todayAttendance = $this->db->single()->total;

        // Total revenue (paid only)
        $this->db->query("SELECT COALESCE(SUM(amount), 0) AS total FROM payment WHERE is_paid = 1");
        $totalRevenue = $this->db->single()->total;

        // Total equipment
        $this->db->query("SELECT COUNT(*) AS total FROM equipment");
        $totalEquipment = $this->db->single()->total;

        $this->json([
            'success' => true,
            'data' => [
                'total_members'      => (int) $totalMembers,
                'total_staff'        => (int) $totalStaff,
                'active_memberships' => (int) $activeMemberships,
                'today_attendance'   => (int) $todayAttendance,
                'total_revenue'      => (float) $totalRevenue,
                'total_equipment'    => (int) $totalEquipment,
            ]
        ]);
    }
}
