<?php

namespace App\Helpers;

class CountryHelper
{
    protected static array $map = [
        'FR' => 'France',
        'BE' => 'Belgique',
        'CH' => 'Suisse',
        'LU' => 'Luxembourg',
        'DE' => 'Allemagne',
        'ES' => 'Espagne',
        'IT' => 'Italie',
        'PT' => 'Portugal',
        'NL' => 'Pays-Bas',
        'IE' => 'Irlande',
        'GB' => 'Royaume-Uni',
        'UK' => 'Royaume-Uni',
        'US' => 'États-Unis',
        'CA' => 'Canada',
        'JP' => 'Japon',
        'CN' => 'Chine',
        // ajoute d'autres codes si besoin
    ];

    public static function name(?string $code): ?string
    {
        if (!$code) {
            return null;
        }

        $code = strtoupper($code);

        return self::$map[$code] ?? $code; // fallback : renvoie le code si inconnu
    }
}
