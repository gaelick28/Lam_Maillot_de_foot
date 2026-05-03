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
    'GB' => 'Royaume-Uni',
    'AT' => 'Autriche',
    'SE' => 'Suède',
    'NO' => 'Norvège',
    'DK' => 'Danemark',
    'FI' => 'Finlande',
    'PL' => 'Pologne',
    'CZ' => 'République tchèque',
    'SK' => 'Slovaquie',
    'HU' => 'Hongrie',
    'GR' => 'Grèce',
    'CY' => 'Chypre',
    'MT' => 'Malte',
    'RO' => 'Roumanie',
    'BG' => 'Bulgarie',
    'HR' => 'Croatie',
    'SI' => 'Slovénie',
    'EE' => 'Estonie',
    'LV' => 'Lettonie',
    'LT' => 'Lituanie',
    'AD' => 'Andorre',
    'MD' => 'Moldavie',
    'UA' => 'Ukraine',
    'RS' => 'Serbie',
    'ME' => 'Monténégro',
    'AL' => 'Albanie',
    'MK' => 'Macédoine du Nord',

    // Amérique du Nord
    'US' => 'États-Unis',
    'CA' => 'Canada',
    'MX' => 'Mexique',

    // Amérique du Sud
    'BR' => 'Brésil',
    'CO' => 'Colombie',
    'CL' => 'Chili',
    'UY' => 'Uruguay',
    'VE' => 'Venezuela',
    'PY' => 'Paraguay',
    'EC' => 'Équateur',
    'PE' => 'Pérou',
    'BO' => 'Bolivie',

    // Amérique centrale & Caraïbes
    'GT' => 'Guatemala',
    'HN' => 'Honduras',
    'NI' => 'Nicaragua',
    'CR' => 'Costa Rica',
    'PA' => 'Panama',
    'DO' => 'République dominicaine',
    'SV' => 'El Salvador',
    'BZ' => 'Belize',
    'AW' => 'Aruba',
    'AG' => 'Antigua-et-Barbuda',
    'BS' => 'Bahamas',
    'BB' => 'Barbade',
    'DM' => 'Dominique',
    'GD' => 'Grenade',
    'KN' => 'Saint-Kitts-et-Nevis',
    'LC' => 'Sainte-Lucie',
    'VC' => 'Saint-Vincent-et-les-Grenadines',
    'TT' => 'Trinité-et-Tobago',
    'HT' => 'Haïti',
    'JM' => 'Jamaïque',
    'SX' => 'Saint-Martin (Pays-Bas)',

    // Outre-mer français
    'GP' => 'Guadeloupe',
    'MQ' => 'Martinique',
    'GF' => 'Guyane française',
    'RE' => 'La Réunion',
    'YT' => 'Mayotte',
    'PF' => 'Polynésie française',
    'NC' => 'Nouvelle-Calédonie',
    'WF' => 'Wallis-et-Futuna',
    'BL' => 'Saint-Barthélemy',
    'MF' => 'Saint-Martin',
    'PM' => 'Saint-Pierre-et-Miquelon',

    // Afrique
    'MA' => 'Maroc',
    'EG' => 'Égypte',
    'SN' => 'Sénégal',
    'CI' => 'Côte d\'Ivoire',
    'CM' => 'Cameroun',
    'NG' => 'Nigeria',
    'GH' => 'Ghana',
    'ZA' => 'Afrique du Sud',
    'MG' => 'Madagascar',
    'CV' => 'Cap-Vert',
    'ST' => 'Sao Tomé-et-Principe',

    // Moyen-Orient
    'LB' => 'Liban',
    'IR' => 'Iran',
    'IQ' => 'Irak',
    'SY' => 'Syrie',
    'TR' => 'Turquie',
    'SA' => 'Arabie saoudite',
    'AE' => 'Émirats arabes unis',
    'KW' => 'Koweït',
    'OM' => 'Oman',
    'YE' => 'Yémen',

    // Asie
    'CN' => 'Chine',
    'JP' => 'Japon',
    'KR' => 'Corée du Sud',
    'IN' => 'Inde',
    'PK' => 'Pakistan',
    'BD' => 'Bangladesh',
    'LK' => 'Sri Lanka',
    'TH' => 'Thaïlande',
    'VN' => 'Vietnam',
    'LA' => 'Laos',
    'KH' => 'Cambodge',
    'MM' => 'Myanmar',
    'MY' => 'Malaisie',
    'SG' => 'Singapour',
    'ID' => 'Indonésie',
    'PH' => 'Philippines',
    'TW' => 'Taïwan',
    'HK' => 'Hong Kong',

    // Océanie
    'AU' => 'Australie',
    'NZ' => 'Nouvelle-Zélande',           
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