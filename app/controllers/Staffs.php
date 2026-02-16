<?php
class Staffs extends Controller {
    public function __construct(){
        $this->staffModel = $this->model('Staff');
    }

//register a staff member
    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);//sanitize
    
            $data = [
                'first_name' => trim($_POST['first_name'] ?? ''),
                'last_name' => trim($_POST['last_name'] ?? ''),
                'email' => trim($_POST['email'] ?? ''),
                'phone' => trim($_POST['phone'] ?? ''),
                'date_of_birth' => trim($_POST['date_of_birth'] ?? ''),
                'role' => trim($_POST['role'] ?? 'trainer'),
                'name_err' => '',
                'email_err' => '',
                'phone_err' => '',
                'date_of_birth_err' => '',
            ];

        //errors
            if(empty($data['first_name']) || empty($data['last_name'])){
                $data['name_err'] = "Please enter first and last name";
            }

            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif ($this->staffModel->findEmail($data['email'])){
                $data['email_err'] = "Email is already taken";
            }

            if(empty($data['phone'])){
                $data['phone_err'] = "Please enter phone number";
            } elseif ($this->staffModel->findPhone($data['phone'])){
                $data['phone_err'] = "Phone number is already taken";
            }

            if(empty($data['date_of_birth'])){
                $data['date_of_birth_err'] = "Please enter date of birth";
            }

        //if no more errors, register
            if(empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err']) && empty($data['date_of_birth_err'])){
                if($this->staffModel->register($data)){
                    //success, proceed to login
                    redirect('staff/login');
                } else {
                    die('Something went wrong');
                }
            } else {
                //load view with errors
                $this->view('staff/register', $data);
            }
        } else {
            //load empty form
            $data = [
                'first_name' => '',
                'last_name' => '',
                'email' => '',
                'phone' => '',
                'name_err' => '',
                'email_err' => '',
                'phone_err' => ''
            ];
        }
    }
}