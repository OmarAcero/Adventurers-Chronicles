<?php
// Conexión a la base de datos.
// Valores por defecto de XAMPP local. Cambiar al subir a Hostinger.

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'adventurers_chronicles');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    try {
      $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
      );
    } catch (PDOException $e) {
      http_response_code(500);
      header('Content-Type: application/json');
      echo json_encode(['ok' => false, 'error' => 'No se pudo conectar a la base de datos.']);
      exit;
    }
  }
  return $pdo;
}
