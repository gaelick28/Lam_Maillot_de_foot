<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Recherche en temps réel pour l'autocomplétion
     * Accessible sans authentification
     */
    public function autocomplete(Request $request)
    {
        $query = $request->input('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        // Recherche approximative sur le nom du club
        $clubs = Club::where(function($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
              ->orWhere('slug', 'LIKE', "%{$query}%");
        })
        ->with(['maillots' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])
        ->limit(8)
        ->get()
        ->map(function($club) {
            $firstMaillot = $club->maillots->first();
            
            // 🔥 CORRECTION: S'assurer que l'URL de l'image est absolue
            $imageUrl = null;
            if ($firstMaillot && $firstMaillot->image) {
                $imageUrl = $firstMaillot->image;
                
                // Si l'image ne commence pas par http:// ou https:// ou /
                if (!str_starts_with($imageUrl, 'http://') && 
                    !str_starts_with($imageUrl, 'https://') && 
                    !str_starts_with($imageUrl, '/')) {
                    // Ajouter le / au début
                    $imageUrl = '/' . $imageUrl;
                }
            }
            
            return [
                'id' => $club->id,
                'name' => $club->name,
                'slug' => $club->slug,
                'image' => $imageUrl,
                'maillots_count' => $club->maillots->count(),
                'url' => "/clubs/{$club->slug}/maillots"
            ];
        });

        return response()->json($clubs);
    }

    /**
     * Page de résultats de recherche complète
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        if (strlen($query) < 2) {
            return redirect()->route('home');
        }

        // 🔥 CORRECTION: Recherche uniquement sur name et slug (pas de colonnes pays/ligue)
        $clubs = Club::where(function($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
              ->orWhere('slug', 'LIKE', "%{$query}%");
        })
        ->with(['maillots' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])
        ->paginate(12);

        return Inertia::render('SearchResults', [
            'clubs' => $clubs,
            'query' => $query
        ]);
    }

    /**
     * API pour obtenir le slug d'un club (pour compatibilité)
     */
    public function getClubSlug(Request $request)
    {
        $name = $request->input('name', '');
        
        if (strlen($name) < 2) {
            return response()->json(['slug' => null]);
        }

        $club = Club::where('name', 'LIKE', "%{$name}%")
            ->orWhere('slug', 'LIKE', "%{$name}%")
            ->first();

        if ($club) {
            return response()->json(['slug' => $club->slug]);
        }

        return response()->json(['slug' => null], 404);
    }
}