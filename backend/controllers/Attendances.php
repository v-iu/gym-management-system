<?php
class Attendances extends Controller{
    public function __construct(){
        $this->attendanceModel = $this->model('Attendance');
    }

    public function checkInOut(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $data = $this->getRequestBody();

            $errors = [];

            $email = trim($data['email'] ?? '');
            $action = trim($data['action'] ?? 'checkin');

        //guest and member models
            $memberModel = $this->model('Member');
            $guestModel  = $this->model('Guest');

        //find user by email
            $member = $memberModel->findEmail($email);
            $guest  = $guestModel->findEmail($email);

        //errors
            if(empty($email)){
                $errors['email'] = "Please enter email";
            } elseif (!$member && !$guest){
                $errors['email'] = "Email not found";
            }

        //if no more errors
            if(empty($errors)){
                $member_id = null;
                $guest_id  = null;

            //set ids
                if($member){
                    $member_id = $member->id;
                } elseif($guest){
                    $guest_id = $guest->id;
                } else {
                    $this->error('ID not retrieved', 500);
                }
            
            //staff id should come from SESSION set from logging in as staff
                $staff_id = $_SESSION['user_id'] ?? null;

            //either check in or check out
                if($action == 'checkin'){
                    $this->attendanceModel->checkIn($member_id, $guest_id, $staff_id);
                    $this->json(['success' => true, 'message' => 'Checked in successfully']);
                } else {
                    $this->attendanceModel->checkOut($member_id, $guest_id);
                    $this->json(['success' => true, 'message' => 'Checked out successfully']);
                }
            } else {
                $this->json(['success' => false, 'errors' => $errors], 422);
            }
        } else {
            //load empty form
            $data = [
                'email' => '',
                'action' => 'checkin',
                'email_err' => ''
            ];
        }
    }
}