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
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $email === '' || $password === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios.']);
  exit;
}
if (strlen($username) < 3 || strlen($username) > 20) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'El usuario debe tener entre 3 y 20 caracteres.']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Correo inválido.']);
  exit;
}
if (strlen($password) < 6) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'La contraseña debe tener al menos 6 caracteres.']);
  exit;
}

$db = getDB();

$check = $db->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
$check->execute([$username, $email]);
if ($check->fetch()) {
  http_response_code(409);
  echo json_encode(['ok' => false, 'error' => 'Usuario o correo ya registrado.']);
  exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$insert = $db->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
$insert->execute([$username, $email, $hash]);

$_SESSION['user_id'] = (int)$db->lastInsertId();
$_SESSION['username'] = $username;
session_regenerate_id(true);

echo json_encode(['ok' => true, 'username' => $username]);
