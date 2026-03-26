<?php

namespace App\Http\Controllers;

use App\Models\Maillot;
use Inertia\Inertia;

class MaillotController extends Controller
{
    public function show($id)
    {
        $maillot = Maillot::with('club.patches')->findOrFail($id);

        // ✅ Créer un tableau des stocks par taille
        $stocks = [
            'S' => $maillot->stock_s,
            'M' => $maillot->stock_m,
            'L' => $maillot->stock_l,
            'XL' => $maillot->stock_xl,
            'XXL' => $maillot->stock_xxl,
        ];

        // ✅ Filtrer les tailles disponibles (uniquement celles en stock)
        $taillesDisponibles = array_filter($stocks, function($stock) {
            return $stock > 0;
        });

        // ✅ Si aucune taille en stock, on retourne toutes les tailles mais avec stock à 0
        $tailles = !empty($taillesDisponibles) ? array_keys($taillesDisponibles) : ['S', 'M', 'L', 'XL', 'XXL'];
        
        // ✅ Calculer la quantité totale disponible
        $quantite = array_sum($stocks);

        $autresMaillots = Maillot::with('club')
    ->where('club_id', $maillot->club_id)
    ->where('id', '!=', $maillot->id)
    ->inRandomOrder()
    ->limit(4)
    ->get()
    ->map(fn($m) => [
        'id' => $m->id,
        'nom' => $m->nom,
        'image' => $m->image,
        'image_dos' => $m->image_dos,
        'price' => $m->price,
        'badge' => $m->badge,
        'club_name' => $m->club->name ?? null,
        'is_new' => $m->is_new,
        'is_featured' => $m->is_featured,
    ]);

        return Inertia::render('MaillotDetail', [
            'maillot' => $maillot,
            'tailles' => $tailles,
            'stocks' => $stocks,  // ✅ NOUVEAU : Envoyer les stocks par taille
            'quantite' => $quantite,
            'nom' => $maillot->nom,
            'numero' => $maillot->numero,
            'prix' => $maillot->price,  // ✅ Prix réel de la BDD
            'prix_nom' => 3,
            'prix_numero' => 2,
            'autresMaillots' => $autresMaillots,
        ]);
    }
}