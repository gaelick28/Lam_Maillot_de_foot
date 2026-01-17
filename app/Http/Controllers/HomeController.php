<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Club;

class HomeController extends Controller
{
    public function __invoke()
    {
        // ✅ Récupérer les clubs avec le nombre de maillots
        $featuredClubs = Club::withCount('maillots')
            ->whereIn('slug', ['girondins-de-bordeaux', 'olympique-lyonnais', 'france'])
            ->get()
            ->map(function ($club) {
                return [
                    'name' => $club->name,
                    'slug' => $club->slug,
                    'logo' => $club->logo,
                    'maillots_count' => $club->maillots_count,
                    // Image pour la carte (vous pouvez ajuster selon votre logique)
                    'image' => $this->getClubImage($club->slug),
                ];
            });

        return Inertia::render('Home', [
            'featuredClubs' => $featuredClubs,
        ]);
    }

    /**
     * Retourne l'image de présentation du club
     */
    private function getClubImage($slug)
    {
        $images = [
            'girondins-de-bordeaux' => '/images/maillot/images_maillot/girondins.jfif',
            'olympique-lyonnais' => '/images/maillot/images_maillot/lyon_75ans.jfif',
            'france' => '/images/maillot/images_maillot/france.jpg',
        ];

        return $images[$slug] ?? '/placeholder.svg';
    }
}