<?php
class TrainerSessions extends Controller {
    public function __construct(){
        $this->sessionModel = $this->model('TrainerSession');
    }

    // GET - List all sessions
    public function index(){
        $this->requireMethod('GET');
        $sessions = $this->sessionModel->getAll();
        $this->json(['success' => true, 'data' => $sessions]);
    }

    // GET - Show single session
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $session = $this->sessionModel->getById($id);
        if (!$session) $this->error('Session not found', 404);

        $this->json(['success' => true, 'data' => $session]);
    }

    // POST - Create session
    public function store(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];
        if (empty($data['member_id'])) $errors['member_id'] = 'Member is required';
        if (empty($data['staff_id'])) $errors['staff_id'] = 'Trainer is required';
        if (empty($data['service_id'])) $errors['service_id'] = 'Service is required';
        if (empty($data['session_date'])) $errors['session_date'] = 'Session date is required';

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        if ($this->sessionModel->create($data)) {
            $this->json(['success' => true, 'message' => 'Session scheduled successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update session
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();
        if ($this->sessionModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Session updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete session
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->sessionModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Session deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
