<?php

namespace App\Helpers;

use Collator;


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
     * Obtenir tous les pays
     * Retourne un tableau associatif [code => nom] trié par nom
     */
    public static function all(): array
    {
        $countries = self::$map;

        // Si l’extension intl est dispo, tri FR insensible aux accents
        if (class_exists(Collator::class)) {
            $collator = new Collator('fr_FR');
            $collator->asort($countries);
        } else {
            // Fallback : tri simple par valeur
            asort($countries);
        }

        return $countries;
    }

    /**
     * Obtenir les pays formatés pour un select
     * Retourne un tableau d'objets [{code, name}] trié par nom
     */
    public static function forSelect(): array
    {
        $countries = [];

        foreach (self::all() as $code => $name) {
            $countries[] = [
                'code' => $code,
                'name' => $name,
            ];
        }

        return $countries;
    }
}