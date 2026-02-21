<?php
// Allow localhost origins during development (preserve credentials)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^https?://localhost(?::\d+)?$#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // fallback to the commonly used dev origin
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../backend/init.php';

$app = new App();
