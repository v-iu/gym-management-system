<?php
class TrainerServices extends Controller {
    public function __construct(){
        $this->serviceModel = $this->model('TrainerService');
    }

    // GET - List all services
    public function index(){
        $this->requireMethod('GET');
        $services = $this->serviceModel->getAll();
        $this->json(['success' => true, 'data' => $services]);
    }

    // GET - Show single service
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $service = $this->serviceModel->getById($id);
        if (!$service) $this->error('Service not found', 404);

        $this->json(['success' => true, 'data' => $service]);
    }

    // POST - Create service
    public function store(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];
        if (empty($data['service_name'])) $errors['service_name'] = 'Service name is required';
        if (empty($data['price']) || $data['price'] <= 0) $errors['price'] = 'Valid price is required';
        if (empty($data['duration_minutes'])) $errors['duration_minutes'] = 'Duration is required';

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        if ($this->serviceModel->create($data)) {
            $this->json(['success' => true, 'message' => 'Service created successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update service
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();
        if ($this->serviceModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Service updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete service
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->serviceModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Service deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
