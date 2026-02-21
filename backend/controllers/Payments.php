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

        // prefer the supplied staff_id but fall back to whoever is logged
        // in (similar to the attendance controller) so callers don't have to
        // include it every time.
        $staff_id = $data['staff_id'] ?? ($_SESSION['user_id'] ?? null);
        if ($staff_id !== null) {
            $data['staff_id'] = $staff_id;
        }

        $errors = [];
        if (empty($data['payment_type'])) $errors['payment_type'] = 'Payment type is required';
        if (empty($data['staff_id'])) $errors['staff_id'] = 'Staff is required';
        if (empty($data['method'])) $errors['method'] = 'Payment method is required';
        if (empty($data['amount']) || $data['amount'] <= 0) $errors['amount'] = 'Valid amount is required';

        // Backend logic: Calculate Change & Validate Tendered
        // Ensure we don't rely solely on frontend for these values
        if (isset($data['method']) && $data['method'] === 'cash') {
            if (isset($data['tendered']) && is_numeric($data['tendered'])) {
                $tendered = floatval($data['tendered']);
                $amount = floatval($data['amount']);

                if ($tendered < $amount) {
                    $errors['tendered'] = 'Tendered amount cannot be less than the payable amount';
                } else {
                    $data['tendered'] = $tendered;
                    $data['change_amount'] = $tendered - $amount;
                }
            }
        } else {
            // Non-cash methods should not have tendered/change values
            $data['tendered'] = null;
            $data['change_amount'] = null;
        }

        // Default is_paid to true if not provided, assuming immediate payment recording
        if (!isset($data['is_paid'])) {
            $data['is_paid'] = 1;
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

        try {
            if ($this->paymentModel->create($data)) {
                $this->json(['success' => true, 'message' => 'Payment recorded successfully'], 201);
            } else {
                // should theoretically never happen with exceptions enabled, but keep fallback
                $this->error('Could not record payment', 500);
            }
        } catch (Exception $ex) {
            // log and return the exception message to aid debugging
            error_log('Payments::store exception: ' . $ex->getMessage());
            $this->error('Payment store failed: ' . $ex->getMessage(), 500);
        }
    }

    // PUT - Update payment
    public function update($id = null){
        $this->requireMethod('PUT');
        if (!$id) $this->error('ID required', 400);

        $data = $this->getRequestBody();

        // basic server-side validation and recalc of tendered/change just like store
        $errors = [];
        if (empty($data['payment_type'])) $errors['payment_type'] = 'Payment type is required';
        if (empty($data['staff_id'])) $errors['staff_id'] = 'Staff is required';
        if (empty($data['method'])) $errors['method'] = 'Payment method is required';
        if (empty($data['amount']) || $data['amount'] <= 0) $errors['amount'] = 'Valid amount is required';

        if (isset($data['method']) && $data['method'] === 'cash') {
            if (isset($data['tendered']) && is_numeric($data['tendered'])) {
                $tendered = floatval($data['tendered']);
                $amount = floatval($data['amount']);

                if ($tendered < $amount) {
                    $errors['tendered'] = 'Tendered amount cannot be less than the payable amount';
                } else {
                    $data['tendered'] = $tendered;
                    $data['change_amount'] = $tendered - $amount;
                }
            }
        } else {
            $data['tendered'] = null;
            $data['change_amount'] = null;
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
            return;
        }

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

    // GET - payments report (optional start/end via query string)
    public function report(){
        $this->requireMethod('GET');
        $start = $_GET['start'] ?? null;
        $end = $_GET['end'] ?? null;
        $report = $this->paymentModel->report($start, $end);
        $this->json(['success' => true, 'data' => $report]);
    }

    // GET - helper used by the front-end to determine whether a guest has
    // already paid today.  This simply exposes the model's hasPaidToday() and
    // keeps us from needing to trigger a failing attendance checkin request.
    public function paidToday($userId = null){
        $this->requireMethod('GET');
        if (!$userId) {
            $this->error('User ID required', 400);
            return;
        }

        $paid = $this->paymentModel->hasPaidToday($userId);
        $this->json(['success' => true, 'paid' => $paid]);
    }
}
