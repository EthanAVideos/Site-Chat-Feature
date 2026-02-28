<?php

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'loadChat':
        require __DIR__ . '/Configuration/loadChat.php';
        break;

    case 'sendChat':
        require __DIR__ . '/Configuration/sendChat.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Invalid endpoint']);
}
