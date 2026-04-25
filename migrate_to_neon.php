<?php
$mysql = new PDO('mysql:host=localhost;dbname=maillot;charset=utf8', 'root', '');
$mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$output = fopen('neon_import.sql', 'w');


// Clubs
fwrite($output, "DELETE FROM clubs;\n");
$clubs = $mysql->query('SELECT * FROM clubs')->fetchAll(PDO::FETCH_ASSOC);
foreach ($clubs as $row) {
    $cols = implode(',', array_keys($row));
    $vals = array_map(fn($v) => $v === null ? 'NULL' : "'" . str_replace("'", "''", $v) . "'", array_values($row));
    fwrite($output, "INSERT INTO clubs ($cols) VALUES (" . implode(',', $vals) . ");\n");
}
echo count($clubs) . " clubs exportés\n";

// Maillots
fwrite($output, "DELETE FROM maillots;\n");
$maillots = $mysql->query('SELECT * FROM maillots')->fetchAll(PDO::FETCH_ASSOC);
foreach ($maillots as $row) {
    $cols = implode(',', array_keys($row));
    $vals = array_map(fn($v) => $v === null ? 'NULL' : "'" . str_replace("'", "''", $v) . "'", array_values($row));
    fwrite($output, "INSERT INTO maillots ($cols) VALUES (" . implode(',', $vals) . ");\n");
}
echo count($maillots) . " maillots exportés\n";

// Users
fwrite($output, "DELETE FROM users;\n");
$users = $mysql->query('SELECT * FROM users')->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $row) {
    $cols = implode(',', array_keys($row));
    $vals = array_map(fn($v) => $v === null ? 'NULL' : "'" . str_replace("'", "''", $v) . "'", array_values($row));
    fwrite($output, "INSERT INTO users ($cols) VALUES (" . implode(',', $vals) . ");\n");
}
echo count($users) . " users exportés\n";

// Tables supplémentaires
foreach (['user_addresses', 'orders', 'order_items', 'order_activities', 'carts', 'cart_items', 'wishlists', 'patches', 'club_patch', 'sessions'] as $table)  {
    try {
        $rows = $mysql->query("SELECT * FROM $table")->fetchAll(PDO::FETCH_ASSOC);
        if (empty($rows)) {
            echo "$table vide\n";
            continue;
        }
        fwrite($output, "DELETE FROM $table;\n");
        foreach ($rows as $row) {
            $cols = implode(',', array_keys($row));
            $vals = array_map(fn($v) => $v === null ? 'NULL' : "'" . str_replace("'", "''", $v) . "'", array_values($row));
            fwrite($output, "INSERT INTO $table ($cols) VALUES (" . implode(',', $vals) . ");\n");
        }
        echo count($rows) . " lignes exportées pour $table\n";
    } catch (\Exception $e) {
        echo "Erreur sur $table: " . $e->getMessage() . "\n";
    }
}

fclose($output);
echo "Fichier neon_import.sql généré !\n";