<?php
    class Controller {
    //load model
        public function model($model){
            require_once '../backend/models/' . $model . '.php';
            return new $model();
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
    }

 ?>