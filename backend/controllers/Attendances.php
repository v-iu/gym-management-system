<?php
class Attendances extends Controller{
    public function __construct(){
        $this->attendanceModel = $this->model('Attendance');
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

    // POST - Check in a member or guest
    // Receptionist selects the person from the system and hits check-in
    // Expects: { type: 'member'|'guest', person_id: int, staff_id: int }
    public function checkin(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];

        $type      = trim($data['type'] ?? '');       // 'member' or 'guest'
        $person_id = trim($data['person_id'] ?? '');   // the member or guest id
        $staff_id  = $data['staff_id'] ?? ($_SESSION['user_id'] ?? null);

        // Validate
        if (empty($type) || !in_array($type, ['member', 'guest'])) {
            $errors['type'] = 'Type must be "member" or "guest"';
        }
        if (empty($person_id)) {
            $errors['person_id'] = 'Please select a member or guest';
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

        // Build attendance data
        $attendanceData = [
            'member_id' => ($type === 'member') ? $person_id : null,
            'guest_id'  => ($type === 'guest')  ? $person_id : null,
            'staff_id'  => $staff_id
        ];

        // Check if already checked in today without checking out
        if ($this->attendanceModel->isCheckedIn($type, $person_id)) {
            $this->error('This person is already checked in today', 409);
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
