<?php
class Payments extends Controller {
    public function __construct(){
        $this->paymentModel = $this->model('Payment');
    }

    // GET - List all payments
    public function index(){
        $this->requireMethod('GET');
        $payments = $this->paymentModel->getAll();
        $this->json(['success' => true, 'data' => $payments]);
    }

    // GET - Show single payment
    public function show($id = null){
        $this->requireMethod('GET');
        if (!$id) $this->error('ID required', 400);

        $payment = $this->paymentModel->getById($id);
        if (!$payment) $this->error('Payment not found', 404);

        $this->json(['success' => true, 'data' => $payment]);
    }

    // POST - Create payment
    public function store(){
        $this->requireMethod('POST');
        $data = $this->getRequestBody();

        $errors = [];
        if (empty($data['payment_type'])) $errors['payment_type'] = 'Payment type is required';
        if (empty($data['staff_id'])) $errors['staff_id'] = 'Staff is required';
        if (empty($data['method'])) $errors['method'] = 'Payment method is required';
        if (empty($data['amount']) || $data['amount'] <= 0) $errors['amount'] = 'Valid amount is required';

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        if ($this->paymentModel->create($data)) {
            $this->json(['success' => true, 'message' => 'Payment recorded successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // PUT - Update payment
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();
        if ($this->paymentModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Payment updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // DELETE - Delete payment
    public function destroy($id = null){
        $this->requireMethod('DELETE');
        if (!$id) $this->error('ID required', 400);

        if ($this->paymentModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Payment deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
