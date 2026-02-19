<?php
class Equipments extends Controller {
    public function __construct(){
        $this->equipmentModel = $this->model('Equipment');
    }

    // GET - List all equipment
    public function index(){
        $this->requireMethod('GET');
        $equipment = $this->equipmentModel->getAll();
        $this->json(['success' => true, 'data' => $equipment]);
    }

    // GET - Show single equipment
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $equipment = $this->equipmentModel->getById($id);
        if (!$equipment) $this->error('Equipment not found', 404);

        $this->json(['success' => true, 'data' => $equipment]);
    }

    // POST - Create equipment
    public function store(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];
        if (empty($data['name'])) $errors['name'] = 'Equipment name is required';
        if (empty($data['type'])) $errors['type'] = 'Type is required';
        if (empty($data['serial_num'])) $errors['serial_num'] = 'Serial number is required';
        if (empty($data['staff_id'])) $errors['staff_id'] = 'Assigned staff is required';

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        if ($this->equipmentModel->create($data)) {
            $this->json(['success' => true, 'message' => 'Equipment added successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update equipment
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();
        if ($this->equipmentModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Equipment updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete equipment
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->equipmentModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Equipment deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // GET - Get maintenance records for equipment
    public function records($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('Equipment ID required', 400);

        $records = $this->equipmentModel->getRecords($id);
        $this->json(['success' => true, 'data' => $records]);
    }

    // POST - Add maintenance record
    public function addRecord(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        if (empty($data['equipment_id'])) $this->error('Equipment ID required', 400);
        if (empty($data['status'])) $this->error('Status required', 400);

        $data['staff_id'] = $data['staff_id'] ?? ($_SESSION['user_id'] ?? 1);

        if ($this->equipmentModel->addRecord($data)) {
            $this->json(['success' => true, 'message' => 'Maintenance record added'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
