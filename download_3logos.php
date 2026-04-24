<?php

$baseUrl   = 'https://fou2foot.onrender.com';
$localPath = __DIR__ . '/storage/app/public/clubs/';

$files = [
    'gpqIQF5RB4saghjVBtGcCQbu83fqELKzBABIDpeu.png',
    'DzXSVEkJPR3MxKhjsy1b66NKJs48mDPdUtAu0DDv.png',
    'XmXmihsj27Gq8mLd5mlnGM7KPSrDrh4Mkpi0kSMk.png',
];

foreach ($files as $filename) {
    $url  = $baseUrl . '/storage/clubs/' . $filename;
    $data = @file_get_contents($url);
    if ($data && !str_contains(substr($data, 0, 100), '<!DOCTYPE')) {
        file_put_contents($localPath . $filename, $data);
        echo "[OK] $filename\n";
    } else {
        echo "[FAIL] $filename\n";
    }
}