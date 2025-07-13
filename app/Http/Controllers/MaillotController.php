<?php


namespace App\Http\Controllers;

use App\Models\Maillot;
use Inertia\Inertia;


class MaillotController extends Controller
{
    public function show($id)
    {
        $maillot = Maillot::with('club')->findOrFail($id);

        //  ajouter les tailles, quantités
        $tailles = ['S', 'M', 'L', 'XL'];
        $quantite = 1200; // ou récupère depuis la BDD

        return Inertia::render('MaillotDetail', [
            'maillot' => $maillot,
            'tailles' => $tailles,
            'quantite' => $quantite,
            'nom' => $maillot->nom,
            'numero' => $maillot->numero,
            'prix' => 20,
            'prix_nom' => 3,
            'prix_numero' => 2,
        ]);
    }
}
