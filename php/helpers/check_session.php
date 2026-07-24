<?php
require_once __DIR__ . '/session.php';
header('Content-Type: application/json');

if (isLoggedIn()) {
  echo json_encode(['ok' => true, 'loggedIn' => true, 'username' => $_SESSION['username']]);
} else {
  echo json_encode(['ok' => true, 'loggedIn' => false]);
}
