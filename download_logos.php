<?php

$baseUrl   = 'https://fou2foot.onrender.com';
$localPath = __DIR__ . '/storage/app/public/clubs/';

if (!is_dir($localPath)) {
    mkdir($localPath, 0755, true);
}

$files = [
    'yV7vEUrpTOYQRAZa45lB3OfQ3hKsXSfjawpFvyVG.jpg',
    'LKxGGrczHa8iuaFifAywT18jQTDAnMecE6m43mrY.jpg',
    'aj5YnvzIpHtupodULd0jnpK8hdCJ5K5aDlpvhvML.png',
    'd0FI6QVNywll73fp9bO9RaBGZ8Yl5q5Sy2XKfxhP.webp',
    'jdMYxTYlw2pX5LXMBlqFd8OE34CKVI8ShqFSqWNn.png',
    'GDBdJLPY17IrLi70CX3qCipTr1nrTXat2U0mhKBN.png',
    'Uba0dHXO79OgbFplzGTd4Eyc7vqsbEkvY1zlQrs4.png',
    'gLXIDB3irv2QtjtxrVqtKLM66FY1An6MywSh2NZ5.png',
    'RpenTnD1Q54prsVzNgnBjtvSthc446SPjW8kBMEe.png',
    'LQxWmKSIZgKSLRjRev7VauqBU6CcNMfHcDYQ4geW.png',
    'bimCiwH9OoAeqS1gPc390X2c0KQvPmainfIjF8bi.png',
    'sHXK6I8bUJNLVn5sePaPQ7FavM74uHVempJPrWOM.png',
    'yT465J5uYp5lIKvQxbvYkwgN1a9GTUA4QTVyCOFj.jpg',
    'xWmfacCLMSLgkMDQ36bd3ZA7D9tTtBvbwitzN0KN.png',
    'j2EmxFM5M3ng1aWQk4EayVi5Y6PE1K9E8PFOm3z7.png',
    'cov8nk2xisbX4u67HUDLRUgTuhq5LxpRJOrlrIhF.jpg',
    'urJ4FDCGYhxhtvgyjfkfEbXX1Ln7n5uxMNAuEfC3.png',
    'ajhQjofc0zFwRIkGzFCmtRcxenfaTO9b0Fko0Kjt.webp',
    'RSbySPoA0buJVreYL3RRCFSjSDm2Yp1p9OEh0JNa.png',
    'H4789ukCNTWUs8yIMdqboPnRjgLAgMeIIiSVSuXW.png',
    'MbK01Xqc2J1sc2FQT5YSRiCdasS2ZPyuQPb9dnWE.png',
    '4zqoN70png16l6uGwAyIDxF9CqbkCPI7W51MzvED.webp',
    'Wi5jGGNHTwbtEGSjxbVfXQTnF1YM8wjIMKzOX967.png',
    'tZoXbj8mFkJxPp0ot3ER8pAtK0Nx97x5JQ73VplP.jpg',
    'JzUIlmpitEpkJSc8GWeB0Xa4Nx3XTAp4qpKVZyOD.png',
    '2zLfhE447LkUxB0UU3GBK2EiPOpxuokZtp6n45ZO.jpg',
    'q431v1653dvbUY1iDWwsc7aH2tUHneWk8gTamAts.png',
    'Q6h2IXnVAolY9GXvzjplnyQoH8qLSJADJX3pn4iB.png',
    'tPAZ4tfWLE6iZA7qnNi8vHGvpaJ1hSFHgQRq0vUX.png',
    'FDaLN2cEj0cDzr0FykNUvyc3yn2ZoJhcdKhJfUC4.png',
    'i1zKLIjBU2gQVAP7dR8j8NN6yrujGNAykMdAa7b8.png',
    'MIH68nZ3MqM6plz98Ph6DUFM6p01tiD46b1sXuP5.png',
    'NVmprLOoAKCDFuNa23NDBBBgz2nCR8DjPnM0A4VB.webp',
    '8g6dSd4vwfp8d0ymmZpzqbCEkSIb8RnmLhZdci01.png',
    'sEQtKa2AvmZNTviDPVFlvj7PoqG7PZMy8MW80GvT.png',
    'IcDhD6CzfQaCojHReGallbzI4s3GqFdv7w2WsWxp.png',
    'xTQTdzvzgGmTglevEhSs5XLovRB2q8uRajZo6O1l.png',
    'ruNw0QWQtvZ1QuuHHrJDNFqV8KZQTP7pGQ16UrKE.png',
    'l5aFJGFIc5KgbbsTfPTtGBD5xjHMwSmr8kjEmP8A.webp',
    'kSQkTMzUEJlayGAaLoJmYTZO8rjGQ6cFVev04OKK.jpg',
    'HNEsHlKtCYhVGplGhZ5qgZU213wh9DtMBBBbOp0S.png',
    'VbVcqRNQxbCvfnrQ3BvDkVw7LQQrtIJFQHSpax57.png',
    'vg41AvVtW2x9wFUJJW3aq5QSZOevgYR5fdtgivTe.png',
    'CRO8UEJNeLEV1ytMCsSl2nSCZbOLjVLlqCTBJ7k2.png',
    'H8PA44h24xCfKz0BSTLVbcDxKy1IEHrRUaDKXljg.png',
    'scu8khSeUTfIukQQA6wiyZabSESKjMOW5G5C0XoL.png',
    'xGnREQYP6zDo1IaWKSark1noktGYvGuTeY0y0ydr.png',
    'KTtkMbnpIxvioN3XxUzhWzBo9j6f6Eranr8IbD4O.png',
    'v3Q41EpMct9Bpro9BebJNFCDhpENz0oKJmfWedfi.png',
    '2SSI0fY9JAbOA8SyjGmTToANA2Wci4PIRGzRYVLG.png',
    'khJL5yz67PQdAwVlDMwQMKVlql59VznYoC4sOCvB.png',
    'r9ZQe0Lg1I6cLvQOg8Um8XuE03OClTwBiU3lktKm.webp',
    'IIl8SN0eUYSB7xJFbGo3znSUMgoCLyCygFKgzbLP.png',
    'rtxEkcjiVJz5FqWSFBsSVybPoKhZiLawz8T99Fyi.png',
    'Ie96PWw7IKqojnhcoeDuXOLscDBkai6VSH9NJXMn.png',
    'ydZhbLLv8PHo1elmu2yxbxwkAfSuQ9dBn3qxuiAk.png',
    'wzMf0ht1tH6FSLMjpHkW58B0UJxdn0j2S94EoJ1I.jpg',
    'sOoFl3q7Mt4lbvb6rEIohcBgS3WEBdl6mtknYMJ8.png',
    'tyomzmrlTRYgiPiIzmdNUsm7e7vG5MKgLgIRi2ib.png',
    'E818ACnHNY4tSW7MiAUS0pORK4XACVMbfe1f1lqp.png',
    'rxuhPfGeu6wFtAi3yPkKiyVSKUxTVszXFJy9ll7D.png',
    'kLdLuREJLvShhZp2Fvql6RH8IGzMSvj5y4Ftt53N.png',
    'Vb0Wjap7VT7HtOl78rPcujDo9KKLvwl7iJbF35u6.webp',
    'YYtUTSL5Mt5NfJjLXHUKccl5iCg8jtX57vrCrcwy.webp',
    'T2kY0c7aRx4acskIpH4PbMbEgtbk3JqxPylUPPgD.png',
    'rbtMtkwqACNhyVKNVDK9msBUbbt59vOqSCX0xagk.png',
    'z1TRTBjyKvNu9AcsgVpvaqFh6pgF3elXiY8sdpg5.png',
    'sflXgD0dRyf6VhK94xFqizYNlbWhszVMNkQUnPLa.png',
    'pZO0H7abFpZqDWLb6B3jngFQEhFU8X4qS5aSVCMJ.png',
    'F9JI9URVofrqZVbjxAW6TgYXcyQ6tnYAO1ZtLhO7.png',
    'xJWFtO2mgWR10M8lB3NzltPtXoy2F346bFXjcQVO.png',
    'ImsHpBPjQbvCZYyAT8tRcC8cO9c1FNNwNuMjbAdq.png',
    'tMU2OrBtH7JjpDSGWVDlus99xgK9M1BRnRnpSFWx.png',
    'tMhB37or1ZO8l3OFh87IjNkkoMrh0cWNjMuk0cVV.webp',
    'jglHoK09LPAcjefp0MeDtsGqql3j22xmlL97GoOI.png',
    'N9aA2EipASVngB10e4L7VYccBj8Qkfdsx6Lk6yup.png',
    'IlhxGQq7R0LPjjH899u0fgw7z7cYX1KswYiK49EM.png',
    'PK1ySMfFuEHW8jEy2kjGWrs41YqAhP8iFijstp0v.png',
    '7QUJ1QCDgSeCXlBJLu51JMiCjWUFTCwqBYAHTrVu.png',
    'kdslruSDZk0vOfaLKqEPZzTk0QdaLEhmUzG8hTMI.png',
    'OkPvyLOGb02iY3eDaEj8tKBDQrZOTWx8Wq6u7y0C.jpg',
    'gp0N9dcKZs9OlACoDI8TLxeapaGP6cCmH8hoieqN.png',
    '6VP1Ru87O2LA9lVSkTeMKg4QzHAwikqhWImBrchg.png',
    'cs70dZTTO0VXGFp0EtiKZUDTPLCZWlMWmk3yDJ8D.png',
    '4OmzeU75a3UCZGVvBBReEfkzrj7v3laZCw8WOP1C.png',
    'fLToR2URMmUCOVRi37UmKyCrT0FW00pFgQJb2Bae.png',
    'ndfX41aSpU7OLmqKIKi9qBqUnyEmsX1E56NRROA0.png',
    'pZH5hAILkUYPchaXyBemZ4uEqFurOr4HdNoCgQ0l.jpg',
    'MtWdwaGxNnhUMNreoYOQZIiMoYOv5ptynuWHIWAy.png',
    'NIVz8AoB3oLZOfRxbrpEqZvTemEkGwPwmyEEGDyM.png',
    't7x2qkHT7wEYlT0YQa9bI9z9DIdxSmxBVkYuT0ER.jpg',
    'X0kgCftgI1YcRdlp9nhZfvB4FXHuN8vfV9UqsYYa.png',
    'q5sF1Big8hBEhs4kmKbiY4pu7ZsHE3pqUegfp6vp.png',
    '0jV6xLhjiv61qtl7rt0iwd4bSzgRzuCmxuvEPLP3.png',
    'MGAHdy6Zh7Ork2wUHs5y138JehMRJzHw5WokWHAD.png',
    'X5eaSZqnNDQryyxgoQfEysRvhbGZDZ5J9ZcfRIwh.png',
    'O76ZLgwIRQe0jEocZDcwGAl47donA1jqa4rDiwYc.png',
    'H9HisJ8XV6uSGZAdlkjrDnckP4tB4OhFx1A3kyYl.png',
    'tot5vgz5lrf8ik1GPL5hU9qn7066ntBznjSr8OPf.jpg',
    'e7cfmUW45iX6oxX5IJ7w4rKVquScyzdSPyoNUO0g.png',
    'z1FVOK6pS2rlEO24bw18uxwZdcxejcPDggCnmfyb.png',
];

$total   = count($files);
$success = 0;
$skipped = 0;
$failed  = 0;

echo "Début du téléchargement de $total logos...\n\n";

foreach ($files as $filename) {
    $dest = $localPath . $filename;

    if (file_exists($dest)) {
        $content = file_get_contents($dest, false, null, 0, 100);
        if (!str_contains($content, '<!DOCTYPE') && !str_contains($content, '<html')) {
            echo "  [SKIP] $filename (déjà présent)\n";
            $skipped++;
            continue;
        }
        unlink($dest);
    }

    $url  = $baseUrl . '/storage/clubs/' . $filename;
    $data = @file_get_contents($url);

    if ($data === false || str_contains(substr($data, 0, 100), '<!DOCTYPE') || str_contains(substr($data, 0, 100), '<html')) {
        echo "  [FAIL] $filename\n";
        $failed++;
        continue;
    }

    file_put_contents($dest, $data);
    echo "  [OK]   $filename\n";
    $success++;

    usleep(200000);
}

echo "\n--- Résumé ---\n";
echo "  Téléchargés : $success\n";
echo "  Déjà présents : $skipped\n";
echo "  Échecs : $failed\n";