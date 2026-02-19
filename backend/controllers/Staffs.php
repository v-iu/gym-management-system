<?php
class Staffs extends Controller {
    public function __construct(){
        $this->staffModel = $this->model('Staff');
    }

//register a staff member
    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $data = $this->getRequestBody();
    
            $data = [
                'first_name' => trim($_POST['first_name'] ?? ''),
                'last_name' => trim($_POST['last_name'] ?? ''),
                'email' => trim($_POST['email'] ?? ''),
                'phone' => trim($_POST['phone'] ?? ''),
                'date_of_birth' => trim($_POST['date_of_birth'] ?? ''),
                'role' => trim($_POST['role'] ?? 'trainer'),
                'password' => trim($_POST['password'] ?? ''),
                'name_err' => '',
                'email_err' => '',
                'phone_err' => '',
                'date_of_birth_err' => '',
                'password_err' => '',
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
            if(empty($data['password'])){
                $data['password_err'] = 'Please enter a password';
            } elseif (strlen($data['password']) < 6){
                $data['password_err'] = 'Password must 6 characters long';
            } elseif(!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/', $data['password'])){
                $data['password_err'] = "Password must contain an uppercase, lowercase, numbers and special characters.";
            }

        //if no more errors, register
            if(empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err']) && empty($data['date_of_birth_err'] && empty($data['password_err']))){
                // Hash password
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

                if($this->staffModel->register($data)){
                    $this->json(['success' => true, 'message' => 'Staff registered successfully'], 201);
                } else {
                    $this->error('Something went wrong', 500);
                }
            } else {
                $errors = array_filter([
                    'name' => $data['name_err'],
                    'email' => $data['email_err'],
                    'phone' => $data['phone_err'],
                    'date_of_birth' => $data['date_of_birth_err'],
                    'password' => $data['password_err']
                ]);
                $this->json(['success' => false, 'errors' => $errors], 422);
            }
        } else {
            $this->error('Method not allowed', 405);
        }
    }

    public function login(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $data = $this->getRequestBody();
    
            $data = [
                'email' => trim($_POST['email'] ?? ''),
                'password' => trim($_POST['password'] ?? ''),
                'name_err' => '',
                'email_err' => '',
                'password_err' => ''
            ];
        //errors
            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif (!$this->staffModel->findEmail($data['email'])){
                $data['email_err'] = "Email does not exist";
            }
            if(empty($data['password'])){
                $data['password_err'] = 'Enter password';
            }

            if(empty($data['email_err']) && empty($data['password_err'])){
                $loggedStaff = $this->staffModel->login($data['email'], $data['password']);
                
                if($loggedStaff){
                    $this->createSession($loggedStaff);
                } else {
                    $data['password_err'] = 'Wrong email or password';
                    $this->json(['success' => false, 'errors' => ['password' => $data['password_err']]], 422);
                }
            } else {
                //load view with errors
                $errors = array_filter([
                    'email' => $data['email_err'],
                    'password' => $data['password_err']
                ]);
                $this->json(['success' => false, 'errors' => $errors], 422);
            }
        } else {
            //load empty form
            $this->error('Method not allowed', 405);
        }
    }

    public function createSession($staff){
        $_SESSION['user_id'] = $staff->id;
        $_SESSION['user_email'] = $staff->email;
        $session = array_filter([
            'user_id' => $_SESSION['user_id'],
            'user_email' => $_SESSION['user_email'],
        ]);
        $this->json(['success' => true, 'message', 'Session was created', 'session' => $session], 201);
    }

    public function logout(){
        unset($_SESSION['user_id']);
        unset($_SESSION['user_email']);
        session_destroy();
        $this->json(['success' => true, 'message' => 'Logged out user'], 201);
    }
}