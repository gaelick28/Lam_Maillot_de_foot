<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Club;
use App\Models\Maillot;

class HomeController extends Controller
{
    public function __invoke()
    {
        $featuredMaillots = Maillot::where('is_featured', true)
            ->orderBy('home_order')
            ->get(['id', 'nom', 'price', 'image', 'badge'])
            ->map(fn($m) => [
                'id' => $m->id,
                'nom' => $m->nom,
                'price' => $m->price,
                'image' => $m->image,
                'badge' => $m->badge,
            ]);

        $newMaillots = Maillot::where('is_new', true)
            ->orderBy('home_order')
            ->get(['id', 'nom', 'price', 'image', 'badge'])
            ->map(fn($m) => [
                'id' => $m->id,
                'nom' => $m->nom,
                'price' => $m->price,
                'image' => $m->image,
                'badge' => $m->badge,
            ]);

        $featuredClubs = Club::where('is_featured_home', true)
            ->withCount('maillots')
            ->orderBy('home_order')
            ->get()
            ->map(fn($club) => [
                'name' => $club->name,
                'slug' => $club->slug,
                'logo' => $club->logo,
                'maillots_count' => $club->maillots_count,
                'image' => $club->image, 
            ]);

        return Inertia::render('Home', [
            'featuredMaillots' => $featuredMaillots,
            'newMaillots' => $newMaillots,
            'featuredClubs' => $featuredClubs,
        ]);
    }
}