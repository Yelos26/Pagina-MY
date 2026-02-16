<?php
header('Content-Type: application/json');

$carpeta = '../cartas/';
$archivos = [];

if (is_dir($carpeta)) {
    $elementos = scandir($carpeta);
    
    foreach ($elementos as $elemento) {
        // Solo archivos .txt
        if (pathinfo($elemento, PATHINFO_EXTENSION) === 'txt') {
            $archivos[] = $elemento;
        }
    }
}

echo json_encode($archivos);
?>