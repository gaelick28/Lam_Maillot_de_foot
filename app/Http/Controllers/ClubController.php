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
    
    public function findSlugByName(Request $request)
{
    $term = $request->query('name');
    $club = \App\Models\Club::whereRaw('LOWER(name) = ?', [strtolower($term)])->first();

    if(!$club) {
        return response()->json(['error' => 'Club non trouvé'], 404);
    }

    return response()->json(['slug' => $club->slug]);
}


}
