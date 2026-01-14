<?php

namespace App\Http\Controllers;

use App\Models\Maillot;
use Inertia\Inertia;

class MaillotController extends Controller
{
    public function show($id)
    {
        $maillot = Maillot::with('club')->findOrFail($id);

        // ✅ Créer un tableau des stocks par taille
        $stocks = [
            'S' => $maillot->stock_s,
            'M' => $maillot->stock_m,
            'L' => $maillot->stock_l,
            'XL' => $maillot->stock_xl,
        ];

        // ✅ Filtrer les tailles disponibles (uniquement celles en stock)
        $taillesDisponibles = array_filter($stocks, function($stock) {
            return $stock > 0;
        });

        // ✅ Si aucune taille en stock, on retourne toutes les tailles mais avec stock à 0
        $tailles = !empty($taillesDisponibles) ? array_keys($taillesDisponibles) : ['S', 'M', 'L', 'XL'];
        
        // ✅ Calculer la quantité totale disponible
        $quantite = array_sum($stocks);

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
        ]);
    }
}