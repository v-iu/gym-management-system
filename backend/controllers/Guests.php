<?php
class Guests extends Controller {
    public function __construct(){
        $this->guestModel = $this->model('Guest');
    }

//register a guest
    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);//sanitize
    
            $data = [
                'first_name' => trim($_POST['first_name'] ?? ''),
                'last_name' => trim($_POST['last_name'] ?? ''),
                'email' => trim($_POST['email'] ?? ''),
                'phone' => trim($_POST['phone'] ?? ''),
                'name_err' => '',
                'email_err' => '',
                'phone_err' => ''
            ];

        //errors
            if(empty($data['first_name']) || empty($data['last_name'])){
                $data['name_err'] = "Please enter first and last name";
            }
            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif ($this->guestModel->findEmail($data['email'])){
                $data['email_err'] = "Email is already taken";
            }
            if(empty($data['phone'])){
                $data['phone_err'] = "Please enter phone number";
            } elseif ($this->guestModel->findPhone($data['phone'])){
                $data['phone_err'] = "Phone number is already taken";
            }

        //if no more errors, register
            if(empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err'])){
                if($this->guestModel->register($data)){
                    $this->json(['success' => true, 'message' => 'Guest registered successfully'], 201);
                } else {
                    $this->error('Something went wrong', 500);
                }
            } else {
                $errors = array_filter([
                    'name' => $data['name_err'],
                    'email' => $data['email_err'],
                    'phone' => $data['phone_err']
                ]);
                $this->json(['success' => false, 'errors' => $errors], 422);
            }
        } else {
            $this->error('Method not allowed', 405);
        }
    }
}