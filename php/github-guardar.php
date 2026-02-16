<?php
header('Content-Type: application/json');
require_once 'config.php';

// ============================================
// CONFIGURACIÓN DE GITHUB
// ============================================
define('GITHUB_TOKEN', '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'); // Token con permisos de escritura
define('GITHUB_REPO', 'Yelos26/Pagina-MY'); // Ej: 'amor-cartas/mi-proyecto'
define('GITHUB_BRANCH', 'main'); // Rama donde guardar

// Recibir datos
$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';
$nombre = $data['nombre'] ?? '';
$contenido = $data['contenido'] ?? '';

// Verificar contraseña especial para GitHub (puede ser la misma o diferente)
$password_github = 'github123456'; // Cámbiala en config.php

if ($password !== $password_github) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Contraseña incorrecta para GitHub'
    ]);
    exit;
}

if (empty($nombre) || empty($contenido)) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Faltan datos'
    ]);
    exit;
}

// ============================================
// GUARDAR EN GITHUB
// ============================================

// Generar nombre de archivo (evitar espacios, caracteres especiales)
$nombreArchivo = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $nombre);
$nombreArchivo = strtolower($nombreArchivo) . '.txt';
$rutaArchivo = 'cartas/' . $nombreArchivo;

// Obtener SHA del archivo si ya existe (para actualizar)
$sha = obtenerShaArchivo($rutaArchivo);

// Preparar datos para GitHub API
$githubData = [
    'message' => "Agregar carta: $nombre",
    'content' => base64_encode($contenido), // GitHub requiere base64
    'branch' => GITHUB_BRANCH
];

if ($sha) {
    $githubData['sha'] = $sha; // Para actualizar archivo existente
}

// Hacer petición a GitHub API
$ch = curl_init("https://api.github.com/repos/" . GITHUB_REPO . "/contents/" . $rutaArchivo);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($githubData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: token ' . GITHUB_TOKEN,
    'User-Agent: PHP',
    'Content-Type: application/json',
    'Accept: application/vnd.github.v3+json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode([
        'success' => true,
        'message' => '✅ Carta guardada en GitHub correctamente',
        'archivo' => $nombreArchivo,
        'url' => "https://github.com/" . GITHUB_REPO . "/blob/" . GITHUB_BRANCH . "/" . $rutaArchivo
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => '❌ Error al guardar en GitHub: ' . $response
    ]);
}

// Función para obtener SHA de archivo existente
function obtenerShaArchivo($ruta) {
    $ch = curl_init("https://api.github.com/repos/" . GITHUB_REPO . "/contents/" . $ruta . "?ref=" . GITHUB_BRANCH);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: token ' . GITHUB_TOKEN,
        'User-Agent: PHP'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        return $data['sha'] ?? null;
    }
    return null;
}
?>