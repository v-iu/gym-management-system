<?php
class Attendances extends Controller{
    public function __construct(){
        $this->attendanceModel = $this->model('Attendance');
    }

    public function checkInOut(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);

            $data = [
                'email' => trim($_POST['email'] ?? ''),
                'action' => trim($_POST['action'] ?? 'checkin'), // checkin or checkout
                'email_err' => ''
            ];

        //guest and member models
            $memberModel = $this->model('Member');
            $guestModel  = $this->model('Guest');

        //find user by email
            $member = $memberModel->findEmail($data['email']);
            $guest  = $guestModel->findEmail($data['email']);

        //errors
            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif (!$member && !$guest){
                $data['email_err'] = "Email not found";
            }

        //if no more errors
            if(empty($data['email_err'])){
                $member_id = null;
                $guest_id  = null;

            //set ids
                if($member){
                    $member_id = $member->id;
                } elseif($guest){
                    $guest_id = $guest->id;
                } else {
                    die("ID not retrieved");
                }
            
            //staff id should come from SESSION set from logging in as staff
                $staff_id = $_SESSION['user_id'];

            //either check in or check out
                if($data['action'] == 'checkin'){
                    $this->attendanceModel->checkIn($member_id, $guest_id, $staff_id);
                } else {
                    $this->attendanceModel->checkOut($member_id, $guest_id);
                }
            } else {
            //load view with errors
                $this->view('users/checkinout', $data);
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