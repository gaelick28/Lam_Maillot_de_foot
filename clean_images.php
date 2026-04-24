<?php
foreach (glob('storage/app/public/maillots/*') as $f) {
    $content = file_get_contents($f, false, null, 0, 100);
    if (str_contains($content, '<!DOCTYPE') || str_contains($content, '<html')) {
        unlink($f);
        echo 'Supprimé: ' . basename($f) . PHP_EOL;
    }
}
echo "Terminé.\n";