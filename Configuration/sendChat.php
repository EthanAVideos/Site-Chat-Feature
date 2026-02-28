<?php
require 'auth.php'; // ensures user is logged in

$chat = $_POST['chat'] ?? 'General';
$message = trim($_POST['message'] ?? '');
if ($message === '') exit;

// whitelist allowed chats
$allowedChats = ['General','Recording','Modders','Admin'];
if (!in_array($chat, $allowedChats)) exit;

$chatFile = __DIR__ . "/chats/{$chat}.json";

// load previous messages
$messages = [];
if (file_exists($chatFile)) {
    $messages = json_decode(file_get_contents($chatFile), true);
    if (!is_array($messages)) $messages = [];
}

$timestamp = date('Y-m-d H:i:s');

// escape HTML for saving
$messages[] = [
    'user' => $user,
'timeStamp' => $timestamp,
'message' => htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
];

// save back
file_put_contents($chatFile, json_encode($messages, JSON_PRETTY_PRINT), LOCK_EX);

echo json_encode(['success' => true, 'user' => $user, 'timeStamp' => $timestamp, 'message' => $message]);
