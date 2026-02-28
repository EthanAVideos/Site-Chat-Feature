<?php
require 'auth.php'; // ensures user is logged in

$chat = $_GET['chat'] ?? 'General';

// whitelist allowed chats (important security)
$allowedChats = ['General','Recording','Modders','Admin'];
if (!in_array($chat, $allowedChats)) {
    echo json_encode([]);
    exit;
}

$chatFile = __DIR__ . "/chats/{$chat}.json";
if (!file_exists($chatFile)) {
    echo json_encode([]);
    exit;
}

$messages = json_decode(file_get_contents($chatFile), true);
if (!is_array($messages)) $messages = [];

header('Content-Type: application/json');
echo json_encode($messages);
