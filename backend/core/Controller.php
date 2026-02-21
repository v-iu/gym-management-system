<?php
class Controller {
    // load model
    public function model($model){
        require_once APPROOT . '/models/' . $model . '.php';
        return new $model();
    }

    // Send JSON response
    protected function json($data, $status = 200){
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code($status);
        echo json_encode($data);
        return null;
    }

    // Send error response (convenience wrapper)
    protected function error($message, $status = 400){
        return $this->json(['success' => false, 'message' => $message], $status);
    }

    // Get parsed request body for JSON, form-urlencoded, and PUT/DELETE
    protected function getRequestBody(){
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
        $raw = file_get_contents('php://input');

        if (stripos($contentType, 'application/json') !== false) {
            $decoded = json_decode($raw, true);
            return $decoded !== null ? $decoded : null;
        }

        // For normal POST requests PHP already populates $_POST
        if ($method === 'POST') {
            return $_POST;
        }

        // For PUT/PATCH/DELETE - parse urlencoded body
        if (in_array($method, ['PUT','PATCH','DELETE'])) {
            parse_str($raw, $data);
            return $data;
        }

        // Fallback
        return $_REQUEST;
    }

    // Ensure request method matches expected value
    protected function requireMethod($expected){
        $actual = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $expected = strtoupper($expected);
        if ($actual !== $expected){
            $this->error('Method not allowed', 405);
            exit;
        }
    }
}
