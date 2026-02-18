<?php
class Members extends Controller {
    public function __construct(){
        $this->memberModel = $this->model('Member');
    }

//register a member
    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $data = $this->getRequestBody();
    
            $data = [
                'membership_id' => trim($_POST['membership_id'] ?? ''),
                'first_name' => trim($_POST['first_name'] ?? ''),
                'last_name' => trim($_POST['last_name'] ?? ''),
                'email' => trim($_POST['email'] ?? ''),
                'phone' => trim($_POST['phone'] ?? ''),
                'date_of_birth' => trim($_POST['date_of_birth'] ?? ''),
                'emergency_contact' => trim($_POST['emergency_contact'] ?? ''),
                'member_status' => trim($_POST['member_status'] ?? 'active'),
                'membership_id_err' => '',
                'name_err' => '',
                'email_err' => '',
                'phone_err' => '',
                'date_of_birth_err' => '',
                'emergency_contact_err' => '',
                'member_status_err' => ''
            ];

        //errors
            if(empty($data['membership_id'])){
                $data['membership_id_err'] = "Membership ID needed";
            } //check if membership is paused, expired, or cancelled
            //membership not active
                //check if membership exists, error "membership not found"

            if(empty($data['first_name']) || empty($data['last_name'])){
                $data['name_err'] = "Please enter first and last name";
            }

            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif ($this->memberModel->findEmail($data['email'])){
                $data['email_err'] = "Email is already taken";
            }

            if(empty($data['phone'])){
                $data['phone_err'] = "Please enter phone number";
            } elseif ($this->memberModel->findPhone($data['phone'])){
                $data['phone_err'] = "Phone number is already taken";
            }

            if(empty($data['date_of_birth'])){
                $data['date_of_birth_err'] = "Please enter date of birth";
            }

            if(empty($data['emergency_contact'])){
                $data['emergency_contact_err'] = "Please enter an emergency contact";
            }
            if(empty($data['member_status'])){
                $data['member_status_err'] =  "Select the member's status";
            }

        //if no more errors, register
            if(empty($data['membership_id_err']) && empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err']) && empty($data['date_of_birth_err']) && empty($data['emergency_contact_err']) && empty($data['member_status_err'])){
                if($this->memberModel->register($data)){
                    $this->json(['success' => true, 'message' => 'Member registered successfully'], 201);
                } else {
                    $this->error('Something went wrong', 500);
                }
            } else {
                $errors = array_filter([
                    'membership_id' => $data['membership_id_err'],
                    'name' => $data['name_err'],
                    'email' => $data['email_err'],
                    'phone' => $data['phone_err'],
                    'date_of_birth' => $data['date_of_birth_err'],
                    'emergency_contact' => $data['emergency_contact_err'],
                    'member_status' => $data['member_status_err']
                ]);
                $this->json(['success' => false, 'errors' => $errors], 422);
            }
        } else {
            $this->error('Method not allowed', 405);
        }
    }
}