<?php
// ============================================
// API DE VERIFICACIÓN - Recibe contraseña y responde
// ============================================

header('Content-Type: application/json');
require_once 'config.php';

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

// Verificar contraseña (desde PHP, no visible en JS)
if ($password === SECRET_PASSWORD) {
    // Contraseña correcta - generar token de sesión
    session_start();
    $_SESSION['autenticado'] = true;
    $_SESSION['token'] = generarToken();
    $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
    $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Autenticación exitosa',
        'token' => $_SESSION['token']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Contraseña incorrecta'
    ]);
}
?>