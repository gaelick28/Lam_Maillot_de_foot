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
        
       
       
            // Belgique (2 maillots)
['club_slug' => 'belgique', 'nom' => 'Belgique Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/belgique-2026-domicile.webp'],
['club_slug' => 'belgique', 'nom' => 'Belgique Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/belgique-2024-exterieur-bleu.webp'],

// Côte d'Ivoire (3 maillots)
['club_slug' => 'cote-divoire', 'nom' => "Côte d'Ivoire Domicile 2025-2026", 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cote-dIvoire-2024-2025.webp'],
['club_slug' => 'cote-divoire', 'nom' => "Côte d'Ivoire Extérieur 2025-2026", 'price' => 20.00, 'image' => 'images/maillot/images_maillot/cote-dIvoire-2025-2026-Concept-Noir.webp'],


// Corée du Sud (3 maillots)
['club_slug' => 'coree-du-sud', 'nom' => 'Corée du Sud Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/coree-du-sud-2024-domicile.webp'],
['club_slug' => 'coree-du-sud', 'nom' => 'Corée du Sud Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/coree-du-sud-2024-exterieur.webp'],


// Croatie (2 maillots)
['club_slug' => 'croatie', 'nom' => 'Croatie Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/croatie-2024-domicile.webp'],
['club_slug' => 'croatie', 'nom' => 'Croatie Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/croatie-2024-exterieur.webp'],

// Aston Villa (3 maillots)
['club_slug' => 'aston-villa', 'nom' => 'Aston Villa Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/aston-villa-2025-2026.webp'],
['club_slug' => 'aston-villa', 'nom' => 'Aston Villa Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/public/images/maillot/images_maillot/aston-villa-2025-2026-exterieur.webp'],
['club_slug' => 'aston-villa', 'nom' => 'Aston Villa Third 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/aston-villa-2025-2026-dragon-noir.webp'],

// Brentford (1 maillot)
['club_slug' => 'brentford', 'nom' => 'Brentford Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/brentford-2024-2025-exterieur.webp'],

// Brighton (3 maillots)
['club_slug' => 'brighton', 'nom' => 'Brighton Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/brighton-2025-2026-domicile.webp'],
['club_slug' => 'brighton', 'nom' => 'Brighton Extérieur 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/brighton-2025-2026-exterieur.webp'],


// Crystal Palace (4 maillots)
['club_slug' => 'crystal-palace', 'nom' => 'Crystal Palace Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/crystal-palace-2025-2026-domicile.webp'],
['club_slug' => 'crystal-palace', 'nom' => 'Crystal Palace Extérieur 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/crystal-palace-2024-2025-ext.webp'],
['club_slug' => 'crystal-palace', 'nom' => 'Crystal Palace Third 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/crystal-palace-2025-2026-third.webp'],
['club_slug' => 'crystal-palace', 'nom' => 'Crystal Palace Domicile 2024-2025', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/crystal-palace-2024-2025-domicile.webp'],

// Angers (1 maillot)
['club_slug' => 'angers', 'nom' => 'Angers Domicile 2025-2026', 'price' => 20.00, 'image' => 'images/maillot/images_maillot/angers-dom.jfif'],

        
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