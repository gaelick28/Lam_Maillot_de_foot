<?php
namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClubController extends Controller
{
    public function maillots($slug)
    {
        $club = Club::where('slug', $slug)->firstOrFail();
        $maillots = $club->maillots()->get();

        return Inertia::render('MaillotsList', [
            'club' => $club,
            'maillots' => $maillots,
        ]);
    }
}
