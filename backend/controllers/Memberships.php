<?php
class Memberships extends Controller {
    public function __construct(){
        $this->membershipModel = $this->model('Membership');
        $this->userModel = $this->model('User');
    }

    // GET - List all memberships
    public function index(){
        $this->requireMethod('GET');
        $memberships = $this->membershipModel->getMembership();
        $this->json(['success' => true, 'data' => $memberships]);
    }

    // GET - Show single membership
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $membership = $this->membershipModel->findMembership($id);
        if (!$membership) $this->error('Membership not found', 404);

        $this->json(['success' => true, 'data' => $membership]);
    }

    // POST - Apply membership
    public function store(){
        $this->requireMethod('POST');
        
        $input = $this->getRequestBody();
        $data = $input ? (array) $input : $_POST;

        $errors = [];
        $validTypes = ['30-day', '90-day']; // Annual removed

        if (empty($data['membership_type']) || !in_array($data['membership_type'], $validTypes)) {
            $errors['membership_type'] = 'Valid membership type is required (30-day, 90-day)';
        }
        
        if (empty($data['start_date'])) {
            $errors['start_date'] = 'Start date is required';
        } elseif (!$this->validateDate($data['start_date'])) {
            $errors['start_date'] = 'Start date must be in Y-m-d format';
        }

        if (empty($data['user_id'])) $errors['user_id'] = 'User ID is required';

        // Payment validation
        // Fallback to session user_id if staff_id is not provided
        $staffId = $data['staff_id'] ?? ($_SESSION['user_id'] ?? null);
        $paymentData = null;
        if (!empty($data['amount']) && !empty($data['method']) && !empty($staffId)) {
            $paymentData = [
                'amount' => $data['amount'],
                'method' => $data['method'],
                'staff_id' => $staffId
            ];
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        // Use transactional method to prevent orphaned records
        if ($this->membershipModel->createMembershipForUser($data, $paymentData)) {
            $this->json(['success' => true, 'message' => 'Membership applied successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update membership
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        // Check existence and ownership (TODO: Add user authorization check here)
        $existing = $this->membershipModel->getById($id);
        if (!$existing) $this->error('Membership not found', 404);

        $data = (array) $this->getRequestBody();
        
        // Validation
        $errors = [];
        $validTypes = ['30-day', '90-day'];
        if (isset($data['membership_type']) && !in_array($data['membership_type'], $validTypes)) {
            $errors['membership_type'] = 'Invalid membership type';
        }
        if (isset($data['start_date']) && !$this->validateDate($data['start_date'])) {
            $errors['start_date'] = 'Invalid start date format (Y-m-d)';
        }
        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        // Merge with existing data to ensure all fields are present for the update
        $updateData = array_merge((array)$existing, $data);

        if ($this->membershipModel->updateMembership($updateData)) {
            $this->json(['success' => true, 'message' => 'Membership updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete membership
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        // Check existence (TODO: Add user authorization check here)
        if (!$this->membershipModel->findMembership($id)) {
            $this->error('Membership not found', 404);
        }

        if ($this->membershipModel->deleteMembership($id)) {
            $this->json(['success' => true, 'message' => 'Membership deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // POST - Renew a membership
    public function renew($id = null) {
        $this->requireMethod('POST');
        if (!$id) $this->error('ID required', 400);

        $input = $this->getRequestBody();
        $data = $input ? (array) $input : $_POST;

        // Fallback to session user_id if staff_id is not provided
        $staffId = $data['staff_id'] ?? ($_SESSION['user_id'] ?? null);
        $paymentData = null;
        if (!empty($data['amount']) && !empty($data['method']) && !empty($staffId)) {
            $paymentData = [
                'amount' => $data['amount'],
                'method' => $data['method'],
                'staff_id' => $staffId
            ];
        }

        if ($this->membershipModel->renewMembership($id, $paymentData)) {
            $this->json(['success' => true, 'message' => 'Membership renewed successfully']);
        } else {
            $this->error('Failed to renew membership', 500);
        }
    }

    // POST - Pause a membership
    public function pause($id = null) {
        $this->requireMethod('POST');
        if (!$id) $this->error('ID required', 400);

        if ($this->membershipModel->pauseMembership($id)) {
            $this->json(['success' => true, 'message' => 'Membership paused successfully']);
        } else {
            $this->error('Failed to pause membership', 500);
        }
    }

    // POST - Resume a membership
    public function resume($id = null) {
        $this->requireMethod('POST');
        if (!$id) $this->error('ID required', 400);

        if ($this->membershipModel->resumeMembership($id)) {
            $this->json(['success' => true, 'message' => 'Membership resumed successfully']);
        } else {
            $this->error('Failed to resume membership', 500);
        }
    }

    private function validateDate($date, $format = 'Y-m-d'){
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
