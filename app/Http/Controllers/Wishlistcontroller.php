<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Maillot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Afficher la page wishlist
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            // Si non connecté, rediriger vers login avec message
            return redirect()->route('login')->with('message', 'Connectez-vous pour voir votre liste de souhaits');
        }

        $wishlistItems = Wishlist::where('user_id', $user->id)
            ->with(['maillot.club'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'created_at' => $item->created_at,
                    'maillot' => [
                        'id' => $item->maillot->id,
                        'nom' => $item->maillot->nom,
                        'image' => $item->maillot->image,
                        'price' => $item->maillot->price,
                        'club_name' => $item->maillot->club->name ?? 'Club inconnu',
                        'slug' => $item->maillot->id,
                    ]
                ];
            });

        return Inertia::render('MyWishlist', [
            'wishlistItems' => $wishlistItems,
            'user' => $user
        ]);
    }

    /**
     * Ajouter un maillot à la wishlist
     */
    public function add(Request $request)
    {
        $request->validate([
            'maillot_id' => 'required|exists:maillots,id'
        ]);

        $user = Auth::user();

        if (!$user) {
            // Si non connecté, retourner un message pour stocker en localStorage
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vous connecter pour sauvegarder votre wishlist',
                'use_local_storage' => true
            ], 401);
        }

        // Vérifier si déjà dans la wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('maillot_id', $request->maillot_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ce maillot est déjà dans votre liste de souhaits'
            ], 409);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'maillot_id' => $request->maillot_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maillot ajouté à votre liste de souhaits'
        ]);
    }

    /**
     * Retirer un maillot de la wishlist
     */
    public function remove(Request $request, $maillotId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
                'use_local_storage' => true
            ], 401);
        }

        $deleted = Wishlist::where('user_id', $user->id)
            ->where('maillot_id', $maillotId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Maillot retiré de votre liste de souhaits'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Maillot non trouvé dans votre wishlist'
        ], 404);
    }

    /**
     * Vider toute la wishlist
     */
    public function clear()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 401);
        }

        Wishlist::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Liste de souhaits vidée'
        ]);
    }

    /**
     * Récupérer les IDs des maillots dans la wishlist (pour l'affichage des cœurs)
     */
    public function getIds()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'wishlist_ids' => []
            ]);
        }

        $ids = Wishlist::where('user_id', $user->id)
            ->pluck('maillot_id')
            ->toArray();

        return response()->json([
            'wishlist_ids' => $ids
        ]);
    }

    /**
     * Synchroniser localStorage avec la BDD lors de la connexion
     */
    public function sync(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 401);
        }

        $request->validate([
            'maillot_ids' => 'required|array',
            'maillot_ids.*' => 'exists:maillots,id'
        ]);

        $syncedCount = 0;

        foreach ($request->maillot_ids as $maillotId) {
            $created = Wishlist::firstOrCreate([
                'user_id' => $user->id,
                'maillot_id' => $maillotId,
            ]);

            if ($created->wasRecentlyCreated) {
                $syncedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "$syncedCount maillot(s) synchronisé(s)",
            'synced_count' => $syncedCount
        ]);
    }
}