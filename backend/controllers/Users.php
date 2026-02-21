<?php
class Users extends Controller {
    public function __construct(){
        $this->userModel = $this->model('User');
    }

    // Get all users
    public function index(){
        $users = $this->userModel->getusers();
        $this->json(['success' => true, 'data' => $users]);
    }

//register a user
    public function register(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            // Use getRequestBody() for JSON, fallback to $_POST for form data
            $input = $this->getRequestBody();
            if (!$input) {
                $input = $_POST;
            }
            $input = (array) $input;

            $data = [
                'first_name' => trim($input['first_name'] ?? ''),
                'last_name' => trim($input['last_name'] ?? ''),
                'email' => trim($input['email'] ?? ''),
                'phone' => trim($input['phone'] ?? ''),
                'name_err' => '',
                'email_err' => '',
                'phone_err' => '',
                'role' => $input['role'] ?? 'guest'
            ];

            // validate `role` is an allowed enum value (prevents invalid/attacker-supplied values)
            $allowedRoles = ['staff', 'member', 'guest'];
            if (!in_array($data['role'], $allowedRoles, true)) {
                $data['role'] = 'guest';
            }

        //errors
            if(empty($data['first_name']) || empty($data['last_name'])){
                $data['name_err'] = "Please enter first and last name";
            }
            if(empty($data['email'])){
                $data['email_err'] = "Please enter email";
            } elseif ($this->userModel->findEmail($data['email'])){
                $data['email_err'] = "Email is already taken";
            }
            if(empty($data['phone'])){
                $data['phone_err'] = "Please enter phone number";
            } elseif ($this->userModel->findPhone($data['phone'])){
                $data['phone_err'] = "Phone number is already taken";
            }

        //if no more errors, register
            if(empty($data['name_err']) && empty($data['email_err']) && empty($data['phone_err'])){
                $newUserId = $this->userModel->register($data);
                if($newUserId){
                    $this->json(['success' => true, 'message' => 'User registered successfully', 'user_id' => $newUserId], 201);
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

    // GET - show single user
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $user = $this->userModel->getById($id);
        if (!$user) $this->error('User not found', 404);

        $this->json(['success' => true, 'data' => $user]);
    }

    // GET - list users by role (e.g. /Users/byRole/guest)
    public function byRole($role = null){
        $this->requireMethod('GET');
        if (!$role) $this->error('Role is required', 400);

        $allowed = ['staff','member','guest'];
        if (!in_array($role, $allowed, true)) {
            $this->error('Invalid role', 400);
            return;
        }

        $users = $this->userModel->getByRole($role);
        $this->json(['success' => true, 'data' => $users]);
    }

    // PUT - update user
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $input = (array) $this->getRequestBody();

        $data = [
            'first_name' => trim($input['first_name'] ?? ''),
            'last_name' => trim($input['last_name'] ?? ''),
            'email' => trim($input['email'] ?? ''),
            'phone' => trim($input['phone'] ?? ''),
            'role' => $input['role'] ?? 'guest',
            'date_of_birth' => $input['date_of_birth'] ?? null,
            'emergency_contact' => $input['emergency_contact'] ?? null,
            'membership_id' => $input['membership_id'] ?? null
        ];

        $errors = [];
        if (empty($data['first_name']) || empty($data['last_name'])) $errors['name'] = 'Please enter first and last name';
        if (empty($data['email'])) $errors['email'] = 'Please enter email';
        if (empty($data['phone'])) $errors['phone'] = 'Please enter phone number';

        // Validate role
        $allowedRoles = ['staff', 'member', 'guest'];
        if (!in_array($data['role'], $allowedRoles, true)) {
            $data['role'] = 'guest';
        }

        // uniqueness checks (exclude current user)
        if ($this->userModel->isEmailTaken($data['email'], $id)) {
            $errors['email'] = 'Email is already taken';
        }
        if ($this->userModel->isPhoneTaken($data['phone'], $id)) {
            $errors['phone'] = 'Phone number is already taken';
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

        if ($this->userModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'User updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - destroy user
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->userModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            $this->error('Something went wrong (possible foreign key constraint)', 500);
        }
    }
}
