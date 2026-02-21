<?php
class Attendances extends Controller{
    public function __construct(){
        $this->attendanceModel = $this->model('Attendance');
        $this->paymentModel = $this->model('Payment');
        $this->userModel = $this->model('User');
        $this->membershipModel = $this->model('Membership');
    }

    // GET - List all attendance records
    public function index(){
        $this->requireMethod('GET');
        $attendance = $this->attendanceModel->getAttendance();
        $this->json(['success' => true, 'data' => $attendance]);
    }

    // GET - Today's attendance only
    public function today(){
        $this->requireMethod('GET');
        $attendance = $this->attendanceModel->getToday();
        $this->json(['success' => true, 'data' => $attendance]);
    }

    // GET - Attendance for a specific date (YYYY-MM-DD)
    public function byDate($date = null){
        $this->requireMethod('GET');
        if (!$date) $this->error('Date required', 400);

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !strtotime($date)){
            $this->error('Invalid date format. Use YYYY-MM-DD', 400);
            return;
        }

        $attendance = $this->attendanceModel->getByDate($date);
        $this->json(['success' => true, 'data' => $attendance]);
    }

    // GET - list available dates that have attendance records
    public function dates(){
        $this->requireMethod('GET');
        $dates = $this->attendanceModel->getAvailableDates();
        $this->json(['success' => true, 'data' => $dates]);
    }

    // POST - Check in a user (member / guest / staff)
    // Receptionist selects the user from the system and hits check-in
    // Expects: { role: 'member'|'guest'|'staff', user_id: int, staff_id: int }
    public function checkin(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];

        $role      = trim($data['role'] ?? '');       // 'member', 'guest' or 'staff'
        $user_id = trim($data['user_id'] ?? '');   // the user id
        $staff_id  = $data['staff_id'] ?? ($_SESSION['user_id'] ?? null);

        // Validate
        if (empty($role) || !in_array($role, ['member', 'guest', 'staff'])) {
            $errors['role'] = 'Role must be one of: member, guest or staff';
        }
        if (empty($user_id)) {
            $errors['user_id'] = 'Please select a user';
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

        // verify the user exists and matches the requested role
        $user = $this->userModel->getById($user_id);
        if (!$user) {
            $this->error('Selected user not found', 404);
            return;
        }
        if ($user->role !== $role) {
            $errors['role'] = 'Selected user does not match the chosen role';
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

        // If member, check if they have an active membership
        if ($role === 'member') {
            if (empty($user->membership_id)) {
                $this->error('Member does not have a membership assigned.', 403);
                return;
            }
            $membership = $this->membershipModel->getById($user->membership_id);
            if (!$membership || $membership->membership_status !== 'active') {
                $this->error('Member does not have an active membership.', 403);
                return;
            }
            if (strtotime($membership->end_date) < strtotime(date('Y-m-d'))) {
                $this->error('Membership has expired.', 403);
                return;
            }
        }

        // Build attendance data
        $attendanceData = [
            'user_id'   => $user_id,
            'staff_id'  => $staff_id
        ];

        // If guest, check if they have paid today
        if ($role === 'guest' && !$this->paymentModel->hasPaidToday($user_id)) {
            $this->error('Guest has not paid for today. Please record payment first.', 402);
            return;
        }

        // Check if already checked in today without checking out
        if ($this->attendanceModel->isCheckedIn($user_id)) {
            $this->error('This user is already checked in today', 409);
            return;
        }

        if ($this->attendanceModel->checkIn($attendanceData)) {
            $this->json(['success' => true, 'message' => 'Checked in successfully']);
        } else {
            $this->error('Check-in failed', 500);
        }
    }

    // POST - Check out by attendance record ID
    // Expects: { attendance_id: int }
    public function checkout(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $attendance_id = trim($data['attendance_id'] ?? '');

        if (empty($attendance_id)) {
            $this->error('Attendance record ID is required', 400);
            return;
        }

        if ($this->attendanceModel->checkOut($attendance_id)) {
            $this->json(['success' => true, 'message' => 'Checked out successfully']);
        } else {
            $this->error('Check-out failed. Record may not exist or already checked out.', 400);
        }
    }
}
