<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Maillot;
use App\Models\Club;

class MaillotSeeder extends Seeder
{
    public function run(): void
    {
        $catalogue = [
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Domicile 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes.jfif'],
            ['club_slug' => 'inde', 'nom' => 'Inde Domicile 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/inde.jpg'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-domicile.webp'],
       
       //nouveaux maillots à ajouter ici
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes-dom25-26.jfif'],
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes-ext25-26.jfif'],
            ['club_slug' => 'inde', 'nom' => 'Inde Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/inde-exterieur-25-26.jpg'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-exterieur.webp'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Third 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-third.webp'],
        ];

        // Supprimer les anciens maillots Grêmio avec les mauvaises saisons AVANT d'ajouter les nouveaux
        $gremioClub = Club::where('slug', 'gremio')->first();
        if ($gremioClub) {
            $deleted = Maillot::where('club_id', $gremioClub->id)
                    ->where(function($query) {
                        $query->where('nom', 'like', '%2024-2025%');
                    })
                    ->delete();
            
            if ($deleted > 0) {
                $this->command?->info("{$deleted} ancien(s) maillot(s) Grêmio avec saison 2024-2025 supprimé(s)");
            }
        }

        foreach ($catalogue as $row) {
            $club = Club::where('slug', $row['club_slug'])->first();

            if (!$club) {
                $this->command?->warn("Club introuvable pour {$row['nom']} — Skippé");
                continue;
            }

            Maillot::updateOrCreate(
                [
                    'nom' => $row['nom'],
                    'club_id' => $club->id
                ],
                [
                    'price' => $row['price'],
                    'image' => $row['image']
                ]
            );
        }

        $this->command?->info('Maillots créés ou mis à jour (Cannes, Inde, Grêmio)');
    }
}