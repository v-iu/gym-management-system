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

        // Revenue Chart Data (Last 6 Months)
        $revenueChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = date('Y-m-01', strtotime("-$i months"));
            $monthEnd = date('Y-m-t', strtotime("-$i months"));
            $label = date('M', strtotime("-$i months"));
            
            $this->db->query("SELECT COALESCE(SUM(amount), 0) AS total FROM payment WHERE is_paid = 1 AND payment_date BETWEEN :start AND :end");
            $this->db->bind(':start', $monthStart . ' 00:00:00');
            $this->db->bind(':end', $monthEnd . ' 23:59:59');
            $revenueChart[] = [
                'name' => $label,
                'total' => (float) $this->db->single()->total
            ];
        }

        // Attendance Chart Data (Last 7 Days)
        $attendanceChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $label = date('D', strtotime("-$i days"));

            $this->db->query("SELECT COUNT(*) AS total FROM attendance WHERE DATE(check_in_time) = :date");
            $this->db->bind(':date', $date);
            $attendanceChart[] = [
                'name' => $label,
                'total' => (int) $this->db->single()->total
            ];
        }

        $this->json([
            'success' => true,
            'data' => [
                'total_members'      => (int) $totalMembers,
                'total_staff'        => (int) $totalStaff,
                'active_memberships' => (int) $activeMemberships,
                'today_attendance'   => (int) $todayAttendance,
                'total_revenue'      => (float) $totalRevenue,
                'total_equipment'    => (int) $totalEquipment,
                'revenue_chart'      => $revenueChart,
                'attendance_chart'   => $attendanceChart,
            ]
        ]);
    }
}
