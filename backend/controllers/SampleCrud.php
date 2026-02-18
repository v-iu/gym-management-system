<?php
/**
 * ============================================================
 *  SAMPLE CRUD CONTROLLER — REFERENCE FILE
 * ============================================================
 *
 *  URL routing (handled by App.php):
 *    GET    /SampleCrud/index        → list all
 *    GET    /SampleCrud/show/{id}    → get one
 *    POST   /SampleCrud/create       → create
 *    PUT    /SampleCrud/update/{id}  → update
 *    DELETE /SampleCrud/destroy/{id} → delete
 *
 *  How it works:
 *    1. public/index.php receives every request.
 *    2. App.php parses the `url` query param:
 *         ?url=SampleCrud/show/5
 *         → controller = "SampleCrud", method = "show", params = [5]
 *    3. The matching controller method is called.
 *    4. The controller loads the model via $this->model('ModelName')
 *       and returns JSON via $this->json() or $this->error().
 *
 *  NOTES:
 *    - PHP only auto-fills $_POST for POST requests.
 *      For PUT/DELETE, read php://input and parse it manually.
 *    - The frontend sends form-encoded data (URLSearchParams),
 *      so we use parse_str() for PUT bodies.
 * ============================================================
 */

class SampleCrud extends Controller {

    private $sampleModel;

    public function __construct() {
        // Load the model — file must exist at backend/models/SampleItem.php
        $this->sampleModel = $this->model('SampleItem');
    }

    // ─── READ ALL ──────────────────────────────────────────────
    // GET /SampleCrud/index
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->error('Method not allowed', 405);
        }

        $items = $this->sampleModel->getAll();
        $this->json(['success' => true, 'data' => $items]);
    }

    // ─── READ ONE ──────────────────────────────────────────────
    // GET /SampleCrud/show/{id}
    public function show($id = null) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->error('Method not allowed', 405);
        }

        if (!$id) {
            $this->error('ID is required', 400);
        }

        $item = $this->sampleModel->getById($id);

        if (!$item) {
            $this->error('Item not found', 404);
        }

        $this->json(['success' => true, 'data' => $item]);
    }

    // ─── CREATE ────────────────────────────────────────────────
    // POST /SampleCrud/create
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Method not allowed', 405);
        }

        // PHP auto-populates $_POST for POST + form-encoded
        $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);

        $data = [
            'first_name' => trim($_POST['first_name'] ?? ''),
            'last_name'  => trim($_POST['last_name'] ?? ''),
            'email'      => trim($_POST['email'] ?? ''),
            'phone'      => trim($_POST['phone'] ?? ''),
        ];

        // ── Validation ──
        $errors = [];

        if (empty($data['first_name']) || empty($data['last_name'])) {
            $errors['name'] = 'First and last name are required';
        }
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif ($this->sampleModel->findByEmail($data['email'])) {
            $errors['email'] = 'Email already exists';
        }
        if (empty($data['phone'])) {
            $errors['phone'] = 'Phone is required';
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        // ── Insert ──
        if ($this->sampleModel->create($data)) {
            $this->json(['success' => true, 'message' => 'Item created successfully'], 201);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // ─── UPDATE ────────────────────────────────────────────────
    // PUT /SampleCrud/update/{id}
    public function update($id = null) {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->error('Method not allowed', 405);
        }

        if (!$id) {
            $this->error('ID is required', 400);
        }

        // For PUT requests, PHP does NOT auto-populate $_POST.
        // The body is form-encoded (URLSearchParams from the frontend),
        // so we read php://input and parse it manually.
        $putData = [];
        parse_str(file_get_contents('php://input'), $putData);

        $data = [
            'first_name' => trim($putData['first_name'] ?? ''),
            'last_name'  => trim($putData['last_name'] ?? ''),
            'email'      => trim($putData['email'] ?? ''),
            'phone'      => trim($putData['phone'] ?? ''),
        ];

        // ── Validation ──
        $errors = [];

        if (empty($data['first_name']) || empty($data['last_name'])) {
            $errors['name'] = 'First and last name are required';
        }
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        }
        if (empty($data['phone'])) {
            $errors['phone'] = 'Phone is required';
        }

        if (!empty($errors)) {
            $this->json(['success' => false, 'errors' => $errors], 422);
        }

        // ── Update ──
        if ($this->sampleModel->update($id, $data)) {
            $this->json(['success' => true, 'message' => 'Item updated successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }

    // ─── DELETE ────────────────────────────────────────────────
    // DELETE /SampleCrud/destroy/{id}
    public function destroy($id = null) {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->error('Method not allowed', 405);
        }

        if (!$id) {
            $this->error('ID is required', 400);
        }

        if ($this->sampleModel->delete($id)) {
            $this->json(['success' => true, 'message' => 'Item deleted successfully']);
        } else {
            $this->error('Something went wrong', 500);
        }
    }
}
