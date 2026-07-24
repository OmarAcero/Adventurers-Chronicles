<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/session.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido.']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios.']);
  exit;
}

$db = getDB();
$stmt = $db->prepare('SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?');
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'Usuario o contraseña incorrectos.']);
  exit;
}

$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['username'] = $user['username'];
session_regenerate_id(true);

echo json_encode(['ok' => true, 'username' => $user['username']]);
