<?php
// ============================================
// CONFIGURACIÓN SEGURA - ESTE ARCHIVO NO ES PÚBLICO
// ============================================

// Contraseña secreta (solo accesible desde PHP)
define('SECRET_PASSWORD', '25062025');

// Generar token único para esta sesión
function generarToken() {
    return bin2hex(random_bytes(32));
}
?>