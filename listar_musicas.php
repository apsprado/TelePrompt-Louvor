<?php
/**
 * listar_musicas.php
 * Retorna a lista de arquivos .txt na pasta /musicas como JSON.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dir = __DIR__ . '/musicas';

if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}

$files = [];
$items = scandir($dir);

foreach ($items as $item) {
    // Ignora diretórios e arquivos ocultos
    if ($item === '.' || $item === '..') continue;

    // Filtra apenas arquivos .txt
    if (pathinfo($item, PATHINFO_EXTENSION) === 'txt') {
        $files[] = 'musicas/' . $item;
    }
}

// Ordena naturalmente (01, 02, 03...)
natsort($files);
$files = array_values($files);

echo json_encode($files);
