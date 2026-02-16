<?php
// ============================================
// VERIFICAR SESIÓN - Para páginas protegidas
// ============================================

session_start();

// Verificar si está autenticado
$autenticado = isset($_SESSION['autenticado']) && $_SESSION['autenticado'] === true;

// Verificar IP y User Agent (seguridad extra)
if ($autenticado) {
    $ip_match = $_SESSION['ip'] === $_SERVER['REMOTE_ADDR'];
    $ua_match = $_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT'];
    
    if (!$ip_match || !$ua_match) {
        // Posible robo de sesión
        session_destroy();
        $autenticado = false;
    }
}

if (!$autenticado) {
    header('Location: error.html');
    exit;
}

// Pasar variable a JavaScript (opcional)
echo '<script>window.autenticado = true;</script>';
?>