<?php

/**
 * Script de récupération des images depuis Render vers le local
 * À placer à la RACINE du projet Laravel et exécuter via :
 * php download_images.php
 */

$baseUrl   = 'https://fou2foot.onrender.com';
$localPath = __DIR__ . '/storage/app/public/maillots/';

// Créer le dossier si inexistant
if (!is_dir($localPath)) {
    mkdir($localPath, 0755, true);
}

$images = [
    // maillots (image principale)
    'hwYhUZorO0ZIqLL49RA5XUJBgwYmSwTJEIK55Js4.webp',
    'm4RPYcl4qDyfJo6rD1pIIKXPj0tQvWuh2ZuGJRqS.webp',
    'ct9BAgRsf3UvJIWJrzXfTpSG7PpBPxFuDXhPdZ8m.webp',
    'inc4jrKvLROkoY9VqTTczA8bTe5GnRzSZHTkmpuq.webp',
    'Wyd74maReR64uLhOeQIAv1jx3ZAA9liQQ0y2YdYF.webp',
    'cS881yVQLSr6GrJjXPsZQHeEUBIEEOVfa7aRHxrD.webp',
    'ZW7XOI3WBWvq98VeD8JNOmm97ubsXrwPb1vIkPrZ.webp',
    'urNVl9ufk1FTwYqCquhuc9xVf88LBsMpFimvXqoc.webp',
    'rJubYEFwAR6TuI94a5Rx91pmP5lYqvgaN5w0rmOK.webp',
    'vSSYu0HwY5pBPt5X2sLH6v6ARfDekhKx8iyqLWrd.webp',
    'Sb68Qe7jj89MnTxhiF72RlqIwP7GQbiD5LgGX3WA.webp',
    'lv1ozsSE2EaGf71Or9VMsLsOfXauAOUAtJB3e3cx.webp',
    'iCVaPYP31qXM80bVGU02AIBj3yI90kkRiyFjxGIa.webp',
    'oqjGGZZc1rMjSTAm8vmwAPOumkOSno6LC5kx9A5T.webp',
    'ub9NbeknaiX3XZQTars9T69rn6MRSjLtcXuqMiHt.webp',
    'sJfP26dTvHzJXXWFqBr6AbWWkX9pGb7DLnBQZJjj.webp',
    'Y8FRh516fNPwnncArrCVvn4vtfaHmm8os6Rx7zPL.webp',
    'iFzI64xxVgyG2oEVxWIjpfYjtwAIssnY4nzu8s7e.jpg',
    '6is8PTm58cBmdIyUfrU9oOgkeF07fUXcDSILGSha.jpg',
    '68NzVymZOHtkvDlmCRAiPmkclKQI4VKOCkD7RBJg.webp',
    'RV5f5jz1qhK7dBklSSsn6fLBAqoaZETaDsOjn2My.jpg',
    '5c04ht2Sa1mvP4YrVnRSlHsrBOYNhBY6vpOF7NNt.webp',
    'rlW77xklsjc9nVyjwDb7sz4QHRB1qTG0hkLbDa43.webp',
    'sQR1xNvY1EwXCNzC4FpPnWmJoMwSN162cqPlaS2Q.webp',
    'AUqBhepPmS9Hr5mZC3E7WS5K8z6dvWhdxZe19wmq.webp',
    'idmDDoVJNRYgC5WD8vI33oxPI6vQxEjWj3XzBHuB.webp',
    '4cDPH5kAOlbaowgeOMMuxcxvNmoIa5SoGT4H9x9A.webp',
    'MmVxEg35TOMKTz6QTGDCGpS4Lxc8EYlbxDQS6omU.png',
    'DAHRu7I0mipNDUB2TxUzFkIS1cjxPUkULRxXCnox.webp',
    'S0Y6oCmLgllFDXhPv0TAJ2rztvgDZXX1H0p2hWfl.jpg',
    'Vj937ImCakrL7rBGEpJxDmSsmwbhVImq2zB7OGnz.webp',
    'SAVQw62gZ7lPJKD7DRzZj8c8xaNby30sMtn4FiYO.webp',
    'uKAw4QMnMsFYo1kL9AO1GNncaqnzNVvWNqIYtWnz.webp',
    'voLxTqNHCKM88PtpTnfVrRj175NPo3ZO5OUhA1JK.jpg',
    '8IbIDDrACBtqmkZF66JM2tLutjmQaT6sQ0n4tLJx.jpg',
    '8MPXXQVpsJGm527YQGb5sH0VkSsStnCIxxRGN0IZ.webp',
    'zgHWJTSbmk5BmmX8HwcpYSCbX6xoZJyuQFgnu7Nv.jpg',
    '7snzOgtQuLj7W1B6AnXUWb7at3kdeEvBNtYbOqMI.webp',
    'angU4NvSuiR7fcEKG8GaUJ9ShogHUVNaWVKeIWok.webp',
    'Ai4rKeabfsZeOiBe1IPKrVvSHTkwE3yFkRf2WYCN.webp',
    'PiWgQKFVFhjTiLQHGDHOaWsaI05aXZv4Ff0JkNbs.webp',
    'Ayab2lnhV80lX3Bds3yki2bpWv9M2gRCCfhYldNo.webp',
    'SUOWHDjpoEijwQwUE7iffYnYqKSm4llwtcpyTmai.webp',
    // image_dos
    'jbRdwxT6qp5gX6KKGJVjSUyeRltoNSTP5PcGB1Ib.webp',
    '0VnB6nhboi681X3Vy7ojoQkhtY9lEnAID6lTjwdT.webp',
    'fofO3eGegHSeP73D5fgTSga7qiVVLUn9YX7iZQBa.webp',
    '4Sq7uTExqXCs94sJG3adUslDXylUCoPjTSOV3hHl.webp',
    'LmeR8Qh14qkI3XAqRD5Zsyvn3MoqQRJuUYMkwMw4.webp',
    '9l1bYdNlmSserNTUUDoBWTfD8vZip9EcAgS158Zf.webp',
    'TjGVBNltUFgpWm5KX1EKPcEhcSy0vPTFQqNreXdP.webp',
    '9a1gKvFEZFjcQI6AdjjngDjBNSGyoBcgrRv23Dr2.webp',
    'l7nY1iBVTNXdrJQzCfHTU9PHIwiFj1IW4A1knq4J.webp',
    '9qzUKU6JyEntnnxKEtLaujEFqiCQZvWV7cqPLFqH.webp',
    'OssfeSXdHlSQpnhKI6QBbXlwU11JoVCVQmGezAoU.webp',
    'Ax2XJAlLVZ7NwabCxOSATam086HfpwQJO6DNNGDh.png',
    '0UxwHjHu59BLTpafuGC7uNAh2QfNNojukLr6jEPO.webp',
    'bKefcVmJQihb883WNEdhU2M4QwKu9OlLcNKSCuvn.webp',
    'IVi7COTi5Hc2uNwPh64jrjPVBgBIQdQhCPmAEUKY.jpg',
    'zQdIArQvxmi15viVJufUTVlVyNagZjhGUsJUI8e4.jpg',
    '6NN9rBOLsdBsY3bUZiT4yYEJ7YWMT3Cdn3psVt44.jpg',
    'CE6zhbaeHU5qjiNif1lC3Q1Foix817H2x3SGKBTJ.webp',
    'rYtubfDehH8nyRBjRbFoVXMugIFLIn5SK1Y6coHQ.jpg',
    'rQ0c0HZleqWtmoVuisj4WFYAWbq7h0ftx1LGJvwn.jpg',
    'Z7oUcawIu2vKofvfxf0k4FHoPvFoqwwzDKKQ6bVQ.webp',
    'WKv0EZb9Y8pNCGxlSdFaYJetTUugwOzEYKwVYUi4.webp',
    'PV1jGFlBxBtxpYsdiD0AOrWqWRpsbSdCVh1xjTeE.webp',
    'ZEhcwYQVGDbtFGMgFcmBSYzgyMyv2SZIpyMR0gZR.webp',
    'V1cpoB9eX9evbj1QU6sIJdc3O2bDCYUffWR1QVQU.webp',
];

$total     = count($images);
$success   = 0;
$skipped   = 0;
$failed    = 0;

echo "Début du téléchargement de $total fichiers...\n\n";

foreach ($images as $filename) {
    $dest = $localPath . $filename;

    if (file_exists($dest)) {
        echo "  [SKIP] $filename (déjà présent)\n";
        $skipped++;
        continue;
    }

    $url  = $baseUrl . '/storage/maillots/' . $filename;
    $data = @file_get_contents($url);

    if ($data === false || strlen($data) < 1000) {
        echo "  [FAIL] $filename\n";
        $failed++;
        continue;
    }

    file_put_contents($dest, $data);
    echo "  [OK]   $filename\n";
    $success++;

    // Pause légère pour ne pas surcharger Render
    usleep(200000);
}

echo "\n--- Résumé ---\n";
echo "  Téléchargés : $success\n";
echo "  Déjà présents : $skipped\n";
echo "  Échecs : $failed\n";