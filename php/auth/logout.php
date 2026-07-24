<?php
require_once __DIR__ . '/../helpers/session.php';
header('Content-Type: application/json');

$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true]);
