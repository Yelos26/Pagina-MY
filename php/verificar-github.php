<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

// Contraseña ESPECIAL para GitHub (diferente a la del login)
define('GITHUB_PASSWORD', '20250625');

if ($password === GITHUB_PASSWORD) {
    echo json_encode([
        'success' => true,
        'message' => 'Contraseña correcta'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Contraseña incorrecta'
    ]);
}
?>