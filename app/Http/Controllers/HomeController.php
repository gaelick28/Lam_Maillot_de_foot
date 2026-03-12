<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Club;
use App\Models\Maillot;

class HomeController extends Controller
{
    public function __invoke()
{
    $featuredIds = [37, 38, 369, 177, 1, 2, 187, 390];
    $newIds = [185, 382, 367, 363];

    $featuredMaillots = Maillot::whereIn('id', $featuredIds)
        ->get(['id', 'nom', 'price', 'image'])
        ->map(fn($m) => [
            'id' => $m->id,
            'nom' => $m->nom,
            'price' => $m->price,
            'image' => $m->image,
        ]);

    $newMaillots = Maillot::whereIn('id', $newIds)
        ->get(['id', 'nom', 'price', 'image'])
        ->map(fn($m) => [
            'id' => $m->id,
            'nom' => $m->nom,
            'price' => $m->price,
            'image' => $m->image,
        ]);

    $featuredClubs = Club::withCount('maillots')
        ->whereIn('slug', ['girondins-de-bordeaux', 'olympique-lyonnais', 'france'])
        ->get()
        ->map(fn($club) => [
            'name' => $club->name,
            'slug' => $club->slug,
            'logo' => $club->logo,
            'maillots_count' => $club->maillots_count,
            'image' => $this->getClubImage($club->slug),
        ]);

    return Inertia::render('Home', [
        'featuredMaillots' => $featuredMaillots,
        'newMaillots' => $newMaillots,
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