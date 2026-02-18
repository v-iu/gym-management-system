<?php
    class Controller {
    //load model
        public function model($model){
            require_once '../backend/models/' . $model . '.php';
            return new $model();
        }
    //get json request body
        public function getRequestBody() {
            $data = file_get_contents("php://input");
            return json_decode($data, true);
        }
    //send JSON response
        public function json($data, $statusCode = 200){
            http_response_code($statusCode);
            echo json_encode($data);
            exit;
        }

    //send error response
        public function error($message, $statusCode = 400){
            $this->json(['success' => false, 'error' => $message], $statusCode);
        }

    //get JSON or form-encoded request body
        public function getRequestBody(){
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

            if (strpos($contentType, 'application/json') !== false) {
                $input = json_decode(file_get_contents('php://input'), true);
                return $input ?? [];
            }

            // For PUT/DELETE, PHP doesn't populate $_POST
            if (in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'DELETE'])) {
                parse_str(file_get_contents('php://input'), $input);
                return $input;
            }

            return $_POST;
        }

    //require specific HTTP method
        public function requireMethod($method){
            if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
                $this->error('Method not allowed', 405);
            }
        }
    }

 ?>