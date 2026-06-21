<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Patches mutuellement exclusifs
    |--------------------------------------------------------------------------
    |
    | Liste des paires de patches qui ne peuvent pas être sélectionnés
    | simultanément sur un même maillot. Utilisé pour la validation
    | côté serveur (CartController) et exposé au frontend via Inertia
    | pour la cohérence UX.
    |
    */
    'exclusive_pairs' => [
        ['Champions League', 'Europa League'],
        ['Euro', 'FIFA World Cup'],
        ['CAN', 'FIFA World Cup'],
        ['CONMEBOL Copa América', 'FIFA World Cup'],
        ['AFC Asian Cup', 'FIFA World Cup'],
    ],
];