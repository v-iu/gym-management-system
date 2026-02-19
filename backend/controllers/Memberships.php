<?php
class Memberships extends Controller {
    public function __construct(){
        $this->membershipModel = $this->model('Membership');
    }

    // GET - List all memberships
    public function index(){
        $this->requireMethod('GET');
        $memberships = $this->membershipModel->getAll();
        $this->json(['success' => true, 'data' => $memberships]);
    }

    // GET - Show single membership
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $membership = $this->membershipModel->getById($id);
        if (!$membership) $this->error('Membership not found', 404);

        $this->json(['success' => true, 'data' => $membership]);
    }

    // POST - Create membership
    public function store(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];
        if (empty($data['membership_type'])) $errors['membership_type'] = 'Membership type is required';
        if (empty($data['start_date'])) $errors['start_date'] = 'Start date is required';
        if (empty($data['total_days'])) $errors['total_days'] = 'Total days is required';

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        $membershipId = $this->membershipModel->create($data);
        if ($membershipId) {
            $this->json(['success' => true, 'message' => 'Membership created successfully', 'data' => ['id' => $membershipId]], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update membership
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();
        if ($this->membershipModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Membership updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete membership
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->membershipModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Membership deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
