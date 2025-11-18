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

// 1.5 Ajout de nouveaux maillots (Third, etc.)
        $newMaillots = [
            [
                'club_slug' => 'valence-cf',
                'nom' => 'Valence Third 2025-2026',
                'price' => 20.00,
                'image' => 'images/maillot/images_maillot/valence-25-third.webp'
            ],
            // Pour ajouter d'autres maillots :
            // [
            //     'club_slug' => 'autre-club',
            //     'nom' => 'Autre Club Third 2025-2026',
            //     'price' => 20.00,
            //     'image' => 'images/maillot/images_maillot/autre-club-25-third.webp'
            // ],
        ];

        foreach ($newMaillots as $row) {
            $club = Club::where('slug', $row['club_slug'])->first();
            if ($club) {
                Maillot::updateOrCreate(
                    ['club_id' => $club->id, 'nom' => $row['nom']],
                    ['price' => $row['price'], 'image' => $row['image']]
                );
                $this->command?->info("✓ Maillot '{$row['nom']}' créé/mis à jour");
            } else {
                $this->command?->warn("⚠ Club '{$row['club_slug']}' non trouvé");
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
            87 => 'images/maillot/images_maillot/brentford-25-dom.webp',
            88 => 'images/maillot/images_maillot/brentford-2024-2025-exterieur.webp',
            // Brighton
            83 => 'images/maillot/images_maillot/brighton-2025-2026-domicile.webp',
            84 => 'images/maillot/images_maillot/brighton-2025-2026-exterieur.webp',
            // Crystal Palace
            85 => 'images/maillot/images_maillot/crystal-palace-2024-2025-domicile.webp',
            86 => 'images/maillot/images_maillot/crystal-palace-2025-2026-third.webp',
           
            // Angers
            59 => 'images/maillot/images_maillot/angers-dom.jfif',
            60=> 'images/maillot/images_maillot/angers-25-ext.webp',

            //Lens
            55 => 'images/maillot/images_maillot/rc-lens-dom.webp',
            56 => 'images/maillot/images_maillot/rc-lens-ext.webp',

            //Mexique
            33 => 'images/maillot/images_maillot/mexique2026-domicile.webp',
            34 => 'images/maillot/images_maillot/mexique-2024-exterieur.webp',

            //Danemark
            25 => 'images/maillot/images_maillot/danemark-dom.webp',
            26 => 'images/maillot/images_maillot/danemark-ext.webp',

            // Celta Vigo
             133 => 'images/maillot/images_maillot/celta-de-vigo-2025-2026-domicile.webp',
             134 => 'images/maillot/images_maillot/celta-de-vigo-2025-2026-exterieur.webp', 

            // RCD Espanyol
             135 => 'images/maillot/images_maillot/rcd-espanyol-2024-2025-domicile.webp',
             136 => 'images/maillot/images_maillot/rcd-espanyol-2025-2026-exterieur.webp',  

             //Atalanta
             149 => 'images/maillot/images_maillot/atalanta-2025-2026-domicile.webp',
             150 => 'images/maillot/images_maillot/atalanta-2025-2026-exterieur.webp',  



             // nouveaux maillots 

             //SELECTIONS
             11 => 'images/maillot/images_maillot/senegal-2026-domicile.webp',
             12 => 'images/maillot/images_maillot/senegal-2026-exterieur.webp',

             17 => 'images/maillot/images_maillot/suisse-2026-domicile.webp',
             18 => 'images/maillot/images_maillot/suisse-2026-exterieur.webp',

             23 => 'images/maillot/images_maillot/suede.webp',
             24 => 'images/maillot/images_maillot/suede-ext.webp',

             27 => 'images/maillot/images_maillot/ukraine-2026-domicile.webp',
             28 => 'images/maillot/images_maillot/ukraine-2025-ext.webp',

             //LIGUE 1
             61 => 'images/maillot/images_maillot/auxerre-25-dom.webp',
             62 => 'images/maillot/images_maillot/auxerre-25-ext.webp',

             41 => 'images/maillot/images_maillot/monaco-25-dom.webp',
             42 => 'images/maillot/images_maillot/monaco-25-ext.webp',

             43 => 'images/maillot/images_maillot/nice-2025-2026-domicile.webp',
             44 => 'images/maillot/images_maillot/nice-2025-2026-exterieur.webp',

             51=> 'images/maillot/images_maillot/nantes-25-dom.webp',
             52=> 'images/maillot/images_maillot/nantes-25-EXT.webp',

             53 => 'images/maillot/images_maillot/monpellier-domicile-20252026.jpg',
             54 => 'images/maillot/images_maillot/montpellier-exterieur-20252026.jpg',

             57 => 'images/maillot/images_maillot/reims-25-dom.webp',
             58 => 'images/maillot/images_maillot/reims-25-ext.webp',

             45 => 'images/maillot/images_maillot/rennes-25-dom.webp',
             46 => 'images/maillot/images_maillot/rennes-25-ext.webp',

             47 => 'images/maillot/images_maillot/strasbourg-25-dom.webp',
             48 => 'images/maillot/images_maillot/strasbourg-25-ext.webp',

             49 => 'images/maillot/images_maillot/toulouse-2025-2026.jpg',
             50 => 'images/maillot/images_maillot/toulouse-2025-2026-ext.jpg',


            // PREMIER LEAGUE 
             79 => 'images/maillot/images_maillot/everton-25-dom.webp',
             80 => 'images/maillot/images_maillot/everton-25-ext.webp',

             89 => 'images/maillot/images_maillot/fulham-25-dom.webp',
             90 => 'images/maillot/images_maillot/fulham-25-ext.webp',

             73 => 'images/maillot/images_maillot/leicester-2025-2026-domicile.webp',
             74 => 'images/maillot/images_maillot/leicester-2025-2026-exterieur.webp',

             77 => 'images/maillot/images_maillot/newcastle-2025-2026-domicile.webp',
             78 => 'images/maillot/images_maillot/newcastle-2025-2026-exterieur.webp',

             71 => 'images/maillot/images_maillot/tottenham-2025-2026-dom.webp',
             72 => 'images/maillot/images_maillot/tottenham-2025-2026-exterieur.webp',

             81 => 'images/maillot/images_maillot/wolverhampton-wanderers-25-dom.webp',
             82 => 'images/maillot/images_maillot/wolverhampton-wanderers-25-ext.webp',


             // BUNDESLIGA      
             99 => 'images/maillot/images_maillot/borussia-mönchengladbach-25-dom.webp',
             100 => 'images/maillot/images_maillot/borussia-mönchengladbach-25-ext.webp',

             111 => 'images/maillot/images_maillot/cologne-domicile-2025-2026.jpg',
             112 => 'images/maillot/images_maillot/cologne-25-ext.webp',

             103 => 'images/maillot/images_maillot/eintracht-25-dom.webp',
             104 => 'images/maillot/images_maillot/eintracht-francfort-2025-2026-exterieur.jpeg',

             107 => 'images/maillot/images_maillot/hertha-25-dom.webp',
             108 => 'images/maillot/images_maillot/hertha-25-ext.webp',

             105 => 'images/maillot/images_maillot/hoffenheim-25-dom.jfif',
             106 => 'images/maillot/images_maillot/hoffenheim-25-ext.jfif',

             95 => 'images/maillot/images_maillot/leipzig-25-dom.webp',
             96 => 'images/maillot/images_maillot/leipzig-25-ext.webp',

             109 => 'images/maillot/images_maillot/stuttgart-25-dom.webp',
             110 => 'images/maillot/images_maillot/stuttgart-25-ext.webp',

             101 => 'images/maillot/images_maillot/wolfsburg-25-dom.webp',
             102 => 'images/maillot/images_maillot/wolfsburg-25-ext.webp',

             113 => 'images/maillot/images_maillot/shalke-25-dom.jfif',
             114 => 'images/maillot/images_maillot/shalke-25-ext.jfif',

            
             // LIGA
             131 => 'images/maillot/images_maillot/betis-25-dom.webp',
             132 => 'images/maillot/images_maillot/betis-25-ext.webp',

             127 => 'images/maillot/images_maillot/villareal-25-dom.webp',
             128 => 'images/maillot/images_maillot/villareal-25-ext.webp',

             125 => 'images/maillot/images_maillot/valence-25-dom.webp',
             126 => 'images/maillot/images_maillot/valence-25-ext.webp',

             129 => 'images/maillot/images_maillot/seville-25-dom.jfif',
             130 => 'images/maillot/images_maillot/seville-25-ext.webp',

             123 => 'images/maillot/images_maillot/sociedad-25-dom.webp',
             124 => 'images/maillot/images_maillot/sociedad-25-ext.webp',


             //SERIA A
             155 => 'images/maillot/images_maillot/bologne-25-dom.webp',
             156 => 'images/maillot/images_maillot/bologne-25-ext.webp',

             151 => 'images/maillot/images_maillot/fiorentina-25-dom.webp',
             152 => 'images/maillot/images_maillot/fiorentina-25-ext.webp',

             147 => 'images/maillot/images_maillot/lazio-25-dom.webp',
             148 => 'images/maillot/images_maillot/lazio-25-ext.webp',

             153 => 'images/maillot/images_maillot/torino-25-dom.webp',
             154 => 'images/maillot/images_maillot/torino-25-ext.webp',


            //AUTRES
             159 => 'images/maillot/images_maillot/benfica-25-dom.webp',
             160 => 'images/maillot/images_maillot/benfica-25-ext.webp',

             167 => 'images/maillot/images_maillot/celtic-25-dom.webp',
             168 => 'images/maillot/images_maillot/celtic-25-ext.jfif',

             173 => 'images/maillot/images_maillot/eindhoven-25-dom.webp',
             174 => 'images/maillot/images_maillot/eindhoven-25-ext.webp',

             165 => 'images/maillot/images_maillot/fenerbahce-25-dom.webp',
             166 => 'images/maillot/images_maillot/fenerbahce-25-ext.jfif',

             157 => 'images/maillot/images_maillot/porto-25-dom.webp',
             158 => 'images/maillot/images_maillot/porto-25-ext.webp',

             169 => 'images/maillot/images_maillot/rangers-25-dom.webp',
             170 => 'images/maillot/images_maillot/rangers-25-ext.webp',

             163 => 'images/maillot/images_maillot/galatasaray-25-dom.webp',
             164 => 'images/maillot/images_maillot/galatasaray-25-ext.webp',

             161 => 'images/maillot/images_maillot/sporting-25-dom.jfif',
             162 => 'images/maillot/images_maillot/sporting-25-ext.webp',

        


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
