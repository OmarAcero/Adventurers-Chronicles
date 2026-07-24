<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

function isLoggedIn(): bool {
  return isset($_SESSION['user_id']);
}

function requireLogin(): void {
  if (!isLoggedIn()) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'No hay sesión activa.']);
    exit;
  }
}
