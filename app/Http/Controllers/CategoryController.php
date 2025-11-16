<?php
// app/Http/Controllers/CategoryController.php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\Maillot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Configuration des catégories avec leurs clubs associés
     */
    private function getCategoryConfig()
    {
        return [
            'selections-nationales' => [
                'title' => 'Sélections Nationales',
                'description' => 'Découvrez notre collection de maillots des plus grandes équipes nationales',
                'slugs' => [
                    'france', 'bresil', 'espagne', 'pays-bas', 'belgique', 
                    'senegal', 'cote-divoire', 'maroc', 'suisse', 'pologne', 
                    'croatie', 'suede', 'danemark', 'ukraine', 'japon', 
                    'coree-du-sud', 'mexique', 'inde'
                ]
            ],
            'ligue-1' => [
                'title' => 'Ligue 1',
                'description' => 'Les maillots des clubs de l\'élite du football français',
                'slugs' => [
                    'olympique-lyonnais', 'girondins-de-bordeaux', 'lille', 'monaco', 
                    'nice', 'rennes', 'strasbourg', 'toulouse', 'nantes', 
                    'montpellier', 'lens', 'reims', 'angers', 'auxerre', 'cannes'
                ]
            ],
            'premier-league' => [
                'title' => 'Premier League',
                'description' => 'Les maillots des plus grands clubs anglais',
                'slugs' => [
                    'liverpool', 'manchester-city', 'arsenal', 'chelsea', 
                    'tottenham-hotspur', 'leicester-city', 'aston-villa', 
                    'newcastle-united', 'everton', 'wolverhampton-wanderers', 
                    'brighton', 'crystal-palace', 'brentford', 'fulham'
                ]
            ],
            'bundesliga' => [
                'title' => 'Bundesliga',
                'description' => 'Les maillots des clubs allemands de prestige',
                'slugs' => [
                    'bayern-munich', 'borussia-dortmund', 'rb-leipzig', 
                    'bayer-leverkusen', 'borussia-monchengladbach', 'wolfsburg', 
                    'eintracht-francfort', 'hoffenheim', 'hertha-berlin', 
                    'stuttgart', 'cologne', 'schalke'
                ]
            ],
            'liga' => [
                'title' => 'La Liga',
                'description' => 'Les maillots des clubs espagnols légendaires',
                'slugs' => [
                    'atletico-madrid', 'athletic-bilbao', 'real-madrid', 
                    'fc-barcelone', 'real-sociedad', 'valence-cf', 
                    'villarreal', 'sevilla-fc', 'real-betis', 
                    'celta-vigo', 'espanyol'
                ]
            ],
            'serie-a' => [
                'title' => 'Serie A',
                'description' => 'Les maillots des clubs italiens mythiques',
                'slugs' => [
                    'inter-milan', 'naples', 'juventus', 'ac-milan', 
                    'as-roma', 'lazio-rome', 'atalanta', 'fiorentina', 
                    'torino', 'bologne'
                ]
            ],
            'autres-clubs' => [
                'title' => 'Autres Clubs',
                'description' => 'Découvrez les maillots d\'autres grands clubs européens',
                'slugs' => [
                    'porto', 'benfica', 'sporting-cp', 'galatasaray', 
                    'fenerbahce', 'celtic-fc', 'rangers-fc', 
                    'ajax-amsterdam', 'psv-eindhoven', 'gremio'
                ]
            ]
        ];
    }

    /**
     * Méthode générique pour afficher une catégorie
     */
    public function show($categorySlug)
    {
        $config = $this->getCategoryConfig();

        // Vérifier si la catégorie existe
        if (!isset($config[$categorySlug])) {
            abort(404, 'Catégorie non trouvée');
        }

        $category = $config[$categorySlug];

        // Récupérer UN maillot représentatif par club (20 premiers)
        $featuredMaillots = Club::whereIn('slug', $category['slugs'])
            ->with(['maillots' => function($query) {
                $query->orderBy('id', 'asc')->limit(1);
            }])
            ->limit(20)
            ->get()
            ->map(function($club) {
                $maillot = $club->maillots->first();
                if (!$maillot) return null;
                
                return [
                    'id' => $maillot->id,
                    'club_name' => $club->name,
                    'club_slug' => $club->slug,
                    'maillot_name' => $maillot->nom,
                    'image' => $maillot->image,
                    'price' => $maillot->price ?? 20.00,
                    'href' => "/clubs/{$club->slug}/maillots"
                ];
            })
            ->filter() // Enlever les null
            ->values();

        return Inertia::render('CategoryPage', [
            'featuredMaillots' => $featuredMaillots,
            'title' => $category['title'],
            'description' => $category['description'],
            'categorySlug' => $categorySlug
        ]);
    }

    // Méthodes spécifiques (pour garder la compatibilité si besoin)
    public function selectionsNationales()
    {
        return $this->show('selections-nationales');
    }

    public function ligue1()
    {
        return $this->show('ligue-1');
    }

    public function premierLeague()
    {
        return $this->show('premier-league');
    }

    public function bundesliga()
    {
        return $this->show('bundesliga');
    }

    public function liga()
    {
        return $this->show('liga');
    }

    public function serieA()
    {
        return $this->show('serie-a');
    }

    public function autresClubs()
    {
        return $this->show('autres-clubs');
    }
}