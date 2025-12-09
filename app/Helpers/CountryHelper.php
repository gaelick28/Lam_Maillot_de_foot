<?php

namespace App\Helpers;

class CountryHelper
{
    
    protected static array $map = [
        'FR' => 'France',
        'BE' => 'Belgique',
        'CH' => 'Suisse',
        'LU' => 'Luxembourg',
        'MC' => 'Monaco',
        'DE' => 'Allemagne',
        'ES' => 'Espagne',
        'IT' => 'Italie',
        'PT' => 'Portugal',
        'NL' => 'Pays-Bas',
        'IE' => 'Irlande',
        'GB' => 'Grande-Bretagne',
        'UK' => 'Royaume-Uni',
        'US' => 'États-Unis',
        'CA' => 'Canada',
        'JP' => 'Japon',
        'CN' => 'Chine',
        'IN' => 'Inde',
        'AT' => 'Autriche',
        'SE' => 'Suède',
        'NO' => 'Norvège',
        'DK' => 'Danemark',
        'FI' => 'Finlande',
        'PL' => 'Pologne',
        'CZ' => 'République tchèque',
        'SK' => 'Slovaquie',
        'HU' => 'Hongrie',
    ];

    /**
     * Obtenir le nom d'un pays à partir de son code
     */
    public static function name(?string $code): ?string
    {
        if (!$code) {
            return null;
        }

        $code = strtoupper($code);

        return self::$map[$code] ?? $code;
    }

    /**
     * 🔥 NOUVELLE : Obtenir tous les pays
     * Retourne un tableau associatif [code => nom]
     */
    public static function all(): array
    {
        return self::$map;
    }

    /**
     * 🔥 NOUVELLE : Obtenir les pays formatés pour un select
     * Retourne un tableau d'objets [{code, name}]
     */
    public static function forSelect(): array
    {
        $countries = [];
        foreach (self::$map as $code => $name) {
            $countries[] = [
                'code' => $code,
                'name' => $name,
            ];
        }
        return $countries;
    }
}