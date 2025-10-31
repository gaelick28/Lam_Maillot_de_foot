<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Maillot;

class MaillotDeleteSeeder extends Seeder
{
    public function run()
    {
        $nomsASupprimer = [
            'Belgique Domicile 2025-2026',
            'Belgique Extérieur 2025-2026',
            "Côte d'Ivoire Domicile 2025-2026",
            "Côte d'Ivoire Extérieur 2025-2026",
            "Côte d'Ivoire Third 2025-2026",
            'Corée du Sud Domicile 2025-2026',
            'Corée du Sud Extérieur 2025-2026',
            'Corée du Sud Third 2025-2026',
            'Croatie Domicile 2025-2026',
            'Croatie Extérieur 2025-2026',
            'Aston Villa Domicile 2025-2026',
            'Aston Villa Extérieur 2025-2026',
            'Aston Villa Third 2025-2026',
            'Brentford Domicile 2025-2026',
            'Brighton Domicile 2025-2026',
            'Brighton Extérieur 2025-2026',
            'Brighton Third 2025-2026',
            'Crystal Palace Domicile 2025-2026',
            'Crystal Palace Extérieur 2025-2026',
            'Crystal Palace Third 2025-2026',
            'Crystal Palace Fourth 2025-2026',
            'Angers Domicile 2025-2026',
        ];

        Maillot::whereIn('nom', $nomsASupprimer)->delete();
    }
}
