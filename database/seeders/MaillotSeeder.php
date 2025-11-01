<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Maillot;
use App\Models\Club;

class MaillotSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Anciens maillots avec club_slug (gestion spécifique)
        $catalogue = [
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Domicile 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes.jfif'],
            ['club_slug' => 'inde', 'nom' => 'Inde Domicile 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/inde.jpg'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-domicile.webp'],
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes-dom25-26.jfif'],
            ['club_slug' => 'cannes', 'nom' => 'AS Cannes Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cannes-ext25-26.jfif'],
            ['club_slug' => 'inde', 'nom' => 'Inde Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/inde-exterieur-25-26.jpg'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-exterieur.webp'],
            ['club_slug' => 'gremio', 'nom' => 'Grêmio Third 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/gremio-25-26-third.webp'],
        ];

        // Mise à jour ou création des anciens maillots par club_slug
        foreach ($catalogue as $row) {
            $club = Club::where('slug', $row['club_slug'])->first();
            if ($club) {
                Maillot::updateOrCreate(
                    ['club_id' => $club->id, 'nom' => $row['nom']],
                    ['price' => $row['price'], 'image' => $row['image']]
                );
            }
        }

        // 2. Mise à jour des images existantes avec id précis pour autres clubs
        $updates = [
            // Belgique
            9 => 'images/maillot/images_maillot/belgique-2026-domicile.webp',
            10 => 'images/maillot/images_maillot/belgique-2024-exterieur-bleu.webp',
            // Côte d'Ivoire
            13 => 'images/maillot/images_maillot/cote-dIvoire-2024-2025.webp',
            14 => 'images/maillot/images_maillot/cote-dIvoire-2025-2026-Concept-Noir.webp',
            // Corée du Sud
            31 => 'images/maillot/images_maillot/coree-du-sud-2024-domicile.webp',
            32 => 'images/maillot/images_maillot/coree-du-sud-2024-exterieur.webp',
            // Croatie
            21 => 'images/maillot/images_maillot/croatie-2024-domicile.webp',
            22 => 'images/maillot/images_maillot/croatie-2024-exterieur.webp',
            // Aston Villa
            75 => 'images/maillot/images_maillot/aston-villa-2025-2026.webp',
            76 => 'images/maillot/images_maillot/aston-villa-2025-2026-dragon-noir.webp',
    
            // Brentford
            88 => 'images/maillot/images_maillot/brentford-2024-2025-exterieur.webp',
            // Brighton
            83 => 'images/maillot/images_maillot/brighton-2025-2026-domicile.webp',
            84 => 'images/maillot/images_maillot/brighton-2025-2026-exterieur.webp',
            // Crystal Palace
            85 => 'images/maillot/images_maillot/crystal-palace-2024-2025-domicile.webp',
            86 => 'images/maillot/images_maillot/crystal-palace-2025-2026-third.webp',
           
            // Angers
            59 => 'images/maillot/images_maillot/angers-dom.jfif',
        ];

        foreach ($updates as $id => $image) {
            Maillot::where('id', $id)->update(['image' => $image]);
        }

        // 3. Suppression spécifique des anciens maillots Grêmio saison 2024-2025
        $gremioClub = Club::where('slug', 'gremio')->first();
        if ($gremioClub) {
            $deleted = Maillot::where('club_id', $gremioClub->id)
                ->where('nom', 'like', '%2024-2025%')
                ->delete();

            if ($deleted > 0) {
                $this->command?->info("{$deleted} ancien(s) maillot(s) Grêmio avec saison 2024-2025 supprimé(s)");
            }
        }

        $this->command?->info('Maillots créés ou mis à jour (Cannes, Inde, Grêmio, autres)');
    }
}
