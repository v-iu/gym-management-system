<?php
class Attendance extends Controller {
    public function __construct(){
        $this->userModel = $this->model('Attendance');
        $this->guestModel = $this->model('Guest');
    }

    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            //sanitize
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);

            $data = [
                'first_name' => trim($_POST['first_name'] ?? ''),
                'last_name' => trim($_POST['last_name'] ?? ''),
                'email' => trim($_POST['email'] ?? ''),
                'phone' => trim($_POST['phone'] ?? ''),
                'name_err' => '',
                'email_err' => '',
                'phone_err' => ''
            ];

            if(empty($data['first_name']) || empty($data['last_name'])){
                $data['name_err'] = "Please enter first and last name";
            }

            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            }

            if(empty($data['phone'])){
                $data['phone_err'] = "Please enter phone number";
            }

            if(empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err'])){
                if($this->guestModel->register($data)){
                    //success
                } else {
                    die('Something went wrong');
                }
            } else {
                //load view with errors
            }
        }
    }
}