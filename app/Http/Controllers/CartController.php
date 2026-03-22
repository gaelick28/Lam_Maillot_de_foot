<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Maillot; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Helpers\CountryHelper;
use App\Models\Patch;

class CartController extends Controller
{
    /**
     * Transférer le panier session vers la base de données
     * À appeler après la connexion
     */
    public function mergeSessionCart()
    {
        if (!Auth::check()) {
            return;
        }

        $sessionCart = Session::get('cart', []);
        
        if (empty($sessionCart)) {
            return;
        }

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        foreach ($sessionCart as $sessionItem) {
            // Normaliser les valeurs nulles
            $nom = $sessionItem['nom'] ?? null;
            $numero = $sessionItem['numero'] ?? null;

            // Chercher si cet article existe déjà dans le panier DB
            $existingItem = $cart->items()
                ->where('maillot_id', $sessionItem['maillot_id'])
                ->where('size', $sessionItem['size'])
                ->where('nom', $nom)
                ->where('numero', $numero)
                ->where('patches', json_encode($sessionItem['patches'] ?? []))
                ->first();

            if ($existingItem) {
                // Fusionner les quantités
                $existingItem->increment('quantity', $sessionItem['quantity']);
            } else {
                // Créer un nouvel item
                $cart->items()->create([
                    'maillot_id' => $sessionItem['maillot_id'],
                    'size' => $sessionItem['size'],
                    'quantity' => $sessionItem['quantity'],
                    'nom' => $nom,
                    'numero' => $numero,
                    'patches' => $sessionItem['patches'] ?? [],
                ]);
            }
        }

        // Vider le panier session
        Session::forget('cart');
    }

    /**
     * Récupérer le nombre d'articles (session + DB)
     */
    public function getCount()
    {
        try {
            $count = 0;

            // Compter les items en session
            $sessionCart = Session::get('cart', []);
            foreach ($sessionCart as $item) {
                $count += $item['quantity'] ?? 1;
            }

            // Si connecté, ajouter les items de la DB
            if (Auth::check()) {
                $cart = Cart::where('user_id', Auth::id())->first();
                if ($cart) {
                    $count += $cart->items()->sum('quantity');
                }
            }

            return response()->json(['count' => $count]);

        } catch (\Exception $e) {
            Log::error('Erreur compteur panier', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return response()->json(['count' => 0], 500);
        }
    }

    /**
     * Afficher le panier (session + DB si connecté)
     */
    public function show()
    {
        $cartItems = collect();
        $user = null;
        $shippingAddress = null;

        // Récupérer les items de la session
        $sessionCart = Session::get('cart', []);
        
        foreach ($sessionCart as $sessionItem) {
            $maillot = Maillot::with('club.patches')->find($sessionItem['maillot_id']);
            
            if (!$maillot) {
                continue;
            }

            $price = $maillot->price ?? 0;
            $suppNom = ($sessionItem['nom'] ?? null) ? 3 : 0;
            $suppNumero = ($sessionItem['numero'] ?? null) ? 2 : 0;
            $patches = $sessionItem['patches'] ?? [];
            $suppPatches = count($patches) * 3;
            $supplement = $suppNom + $suppNumero + $suppPatches;
            $quantity = $sessionItem['quantity'] ?? 1;
            $total = ($price + $supplement) * $quantity;

            $cartItems->push([
                'id' => $sessionItem['id'], // ID temporaire
                'club_name' => $maillot->club->name ?? 'Club inconnu',
                'maillot_name' => $maillot->nom ?? $maillot->name ?? 'Maillot',
                'maillot_id' => $sessionItem['maillot_id'],
                'image' => $maillot->image,
                'size' => $sessionItem['size'],
                'is_session' => true,
                'stock' => $maillot->getStockForSize($sessionItem['size']),  
                'quantity' => $quantity,
                'price' => $price,
                'nom' => $sessionItem['nom'] ?? null,
                'numero' => $sessionItem['numero'] ?? null,
                'supplement' => $supplement,
                'total' => $total,
                'is_session' => true, // Marquer comme item de session
                'patches' => $sessionItem['patches'] ?? [],
                'available_patches' => $maillot->club?->patches?->map(fn($p) => ['id' => $p->id, 'nom' => $p->nom, 'prix' => $p->prix])->toArray() ?? [],
                ]);
        }

        // Si connecté, récupérer aussi les items de la DB
        if (Auth::check()) {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
            $cart->load('items.maillot.club.patches');

            $user = \App\Models\User::with(['addresses' => function ($query) {
    $query->where('is_archived', false) // 🔥 FILTRER les archivées
          ->orderBy('type', 'asc')
          ->orderBy('is_default', 'desc')
          ->orderBy('created_at', 'desc');
}])->findOrFail(Auth::id());

// Récupérer la première adresse de livraison active
$shippingAddress = $user->addresses
    ->where('type', 'shipping')
    ->first(); // La requête est déjà triée

            foreach ($cart->items as $item) {
                $maillot = $item->maillot;
                $price = $maillot ? $maillot->price : 0;
                $suppNom = $item->nom ? 3 : 0;
                $suppNumero = $item->numero ? 2 : 0;
                $patches = $item->patches ?? [];
                $suppPatches = count($patches) * 3;
                $supplement = $suppNom + $suppNumero + $suppPatches;
                $total = ($price + $supplement) * $item->quantity;

                $cartItems->push([
                    'id' => $item->id,
                    'club_name' => $maillot->club->name ?? 'Club inconnu',
                    'maillot_name' => $maillot->nom ?? $maillot->name ?? 'Maillot',
                    'maillot_id' => $item->maillot_id,
                    'image' => $maillot->image,
                    'size' => $item->size,
                    'is_session' => false,
                    'stock' => $maillot ? $maillot->getStockForSize($item->size) : 0,  
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'nom' => $item->nom,
                    'numero' => $item->numero,
                    'supplement' => $supplement,
                    'total' => $total,
                    'is_session' => false, // Item de la DB
                    'patches' => $item->patches ?? [],
                    'available_patches' => $maillot->club?->patches?->map(fn($p) => ['id' => $p->id, 'nom' => $p->nom, 'prix' => $p->prix])->toArray() ?? [],
                    ]);
            }
        }

        return inertia('Panier', [
            'cartItems' => $cartItems,
            'auth' => [
                'user' => $user,
                'shippingAddress' => $shippingAddress ? [
                    'id'          => $shippingAddress->id,
                    'first_name'  => $shippingAddress->first_name,
                    'last_name'   => $shippingAddress->last_name,
                    'street'      => $shippingAddress->street,
                    'postal_code' => $shippingAddress->postal_code,
                    'city'        => $shippingAddress->city,
                    'country'     => CountryHelper::name($shippingAddress->country),
                    'phone'       => $shippingAddress->phone,
                    'is_default'  => (bool) $shippingAddress->is_default,
                ] : null,
                 ]
        ]);
    }

    /**
     * Ajouter un article (session si non connecté, DB si connecté)
     */
    public function add(Request $request)
    {
        $nom = $request->filled('nom') ? $request->nom : null;
        $numero = $request->filled('numero') ? $request->numero : null;
        $patches = $request->input('patches', []);
        sort($patches);

        // 🔥 RÉCUPÉRER LE MAILLOT POUR VÉRIFIER LE STOCK
        $maillot = Maillot::findOrFail($request->maillot_id);
        
        // 🔥 DÉTERMINER LE STOCK DISPONIBLE POUR LA TAILLE
        $stockField = 'stock_' . strtolower($request->size);
        $stockDisponible = $maillot->$stockField ?? 0;
        
        // 🔥 VÉRIFICATION : La quantité demandée est-elle disponible ?
        if ($request->quantity > $stockDisponible) {
            return back()->withErrors([
                'quantity' => "Stock insuffisant. Seulement {$stockDisponible} article(s) disponible(s) en taille {$request->size}."
            ])->with('error', "Stock insuffisant pour la taille {$request->size}");
        }

        // Si connecté → ajouter en DB
        if (Auth::check()) {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
            
            $item = $cart->items()
                ->where('maillot_id', $request->maillot_id)
                ->where('size', $request->size)
                ->where('numero', $numero)
                ->where('nom', $nom)
                ->where(function($q) use ($patches) {
                $sorted = $patches;
                sort($sorted);
                $q->whereRaw("JSON_LENGTH(patches) = ?", [count($sorted)]);
                foreach ($sorted as $patchId) {
                    $q->whereRaw("JSON_CONTAINS(patches, ?)", [(string)$patchId]);
                }
            })
                ->first();

            if ($item) {
                  // 🔥 VÉRIFIER QUE LA NOUVELLE QUANTITÉ TOTALE NE DÉPASSE PAS LE STOCK
                $nouvelleQuantite = $item->quantity + $request->quantity;
                
                if ($nouvelleQuantite > $stockDisponible) {
                    return back()->withErrors([
                        'quantity' => "Stock insuffisant. Vous avez déjà {$item->quantity} article(s) dans votre panier. Maximum disponible : {$stockDisponible}."
                    ])->with('error', "Vous avez déjà {$item->quantity} article(s) dans votre panier.");
                }
                
                $item->increment('quantity', $request->quantity);
            } else {
                $cart->items()->create([
                    'maillot_id' => $request->maillot_id,
                    'size' => $request->size,
                    'quantity' => $request->quantity,
                    'numero' => $numero,
                    'nom' => $nom,
                    'patches' => $request->input('patches', []),
                                ]);
            }

            return back()->with('success', 'Article ajouté au panier');
        }

        // Si non connecté → ajouter en session
        $sessionCart = Session::get('cart', []);

        // Chercher si cet article existe déjà
        $found = false;
        foreach ($sessionCart as &$sessionItem) {
            if (
                $sessionItem['maillot_id'] == $request->maillot_id &&
                $sessionItem['size'] == $request->size &&
                ($sessionItem['nom'] ?? null) == $nom &&
                ($sessionItem['numero'] ?? null) == $numero &&
                ($sessionItem['patches'] ?? []) == $request->input('patches', [])
            ) {
                
                // 🔥 VÉRIFIER QUE LA NOUVELLE QUANTITÉ TOTALE NE DÉPASSE PAS LE STOCK
                $nouvelleQuantite = $sessionItem['quantity'] + $request->quantity;
                
                if ($nouvelleQuantite > $stockDisponible) {
                    return back()->withErrors([
                        'quantity' => "Stock insuffisant. Vous avez déjà {$sessionItem['quantity']} article(s) dans votre panier. Maximum disponible : {$stockDisponible}."
                    ])->with('error', "Vous avez déjà {$sessionItem['quantity']} article(s) dans votre panier.");
                }

                $sessionItem['quantity'] += $request->quantity;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $sessionCart[] = [
                'id' => 'session_' . uniqid(), // ID temporaire unique
                'maillot_id' => $request->maillot_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
                'nom' => $nom,
                'numero' => $numero,
                'patches' => $request->input('patches', []),
            ];
        }

        Session::put('cart', $sessionCart);

        return back()->with('success', 'Article ajouté au panier');
    }

    /**
     * Mettre à jour un article
     */
    public function update(Request $request, $itemId)
    {
        $data = $request->validate([
            'size'     => 'required|string|max:10',
            'quantity' => 'required|integer|min:1',
            'nom'      => 'nullable|string|max:50',
            'numero'   => 'nullable|string|max:3',
            'patches' => 'nullable|array',
        ]);

        $data['nom'] = $request->filled('nom') ? $request->nom : null;
        $data['numero'] = $request->filled('numero') ? $request->numero : null;
        $data['patches'] = $request->input('patches', []);

// ✅ VÉRIFICATION DU STOCK AVANT MISE À JOUR
if (str_starts_with($itemId, 'session_')) {
    $sessionCart = Session::get('cart', []);
    $maillotId = null;
    foreach ($sessionCart as $si) {
        if ($si['id'] === $itemId) {
            $maillotId = $si['maillot_id'];
            break;
        }
    }
} else {
    $itemCheck = CartItem::findOrFail($itemId);
    $maillotId = $itemCheck->maillot_id;
}

if ($maillotId) {
    $maillot = Maillot::find($maillotId);
    if ($maillot) {
        $stockDisponible = $maillot->getStockForSize($data['size']);
        if ($data['quantity'] > $stockDisponible) {
            return redirect()->route('cart.show')->with('error', sprintf(
                'Stock insuffisant en taille %s. Disponible : %d.',
                strtoupper($data['size']),
                $stockDisponible
            ));
        }
    }
}


        // Si l'ID commence par "session_" → item de session
        if (str_starts_with($itemId, 'session_')) {
            $sessionCart = Session::get('cart', []);
            
            foreach ($sessionCart as $key => &$sessionItem) {
                if ($sessionItem['id'] === $itemId) {
                    $sessionItem['size'] = $data['size'];
                    $sessionItem['quantity'] = $data['quantity'];
                    $sessionItem['nom'] = $data['nom'];
                    $sessionItem['numero'] = $data['numero'];
                    $sessionItem['patches'] = $data['patches'];
                    break;
                }
            }

            Session::put('cart', $sessionCart);
            return redirect()->route('cart.show')->with('success', 'Article sauvegardé');
        }

        // Sinon → item de la DB
        $item = CartItem::findOrFail($itemId);

        if ($item->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart = $item->cart;

        $duplicate = $cart->items()
            ->where('id', '!=', $item->id)
            ->where('maillot_id', $item->maillot_id)
            ->where('size', $data['size'])
            ->where('nom', $data['nom'])
            ->where('numero', $data['numero'])
          ->where(function($q) use ($data) {
                    $sorted = $data['patches'];
                    sort($sorted);
                    $q->whereRaw("JSON_LENGTH(patches) = ?", [count($sorted)]);
                    foreach ($sorted as $patchId) {
                        $q->whereRaw("JSON_CONTAINS(patches, ?)", [(string)$patchId]);
                    }
                })
            ->first();

        if ($duplicate) {
            $duplicate->quantity += $data['quantity'];
            $duplicate->save();
            $item->delete();
        } else {
            $item->update($data);
        }

        return redirect()->route('cart.show')->with('success', 'Article sauvegardé');
    }

    /**
     * Supprimer un article
     */
    public function remove($itemId)
    {
        // Si item de session
        if (str_starts_with($itemId, 'session_')) {
            $sessionCart = Session::get('cart', []);
            $sessionCart = array_filter($sessionCart, function($item) use ($itemId) {
                return $item['id'] !== $itemId;
            });
            Session::put('cart', array_values($sessionCart));
            
            return back()->with('success', 'Article supprimé du panier');
        }

        // Sinon item de la DB
        $item = CartItem::findOrFail($itemId);

        if ($item->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $item->delete();
        return back()->with('success', 'Article supprimé du panier');
    }

    /**
     * Vider le panier
     */
    public function clear()
    {
        // Vider la session
        Session::forget('cart');

        // Vider la DB si connecté
        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())->first();
            if ($cart) {
                $cart->items()->delete();
            }
        }

        return back()->with('success', 'Panier vidé');
    }

    /**
     * Checkout - Rediriger vers login si non connecté
     */
    public function checkout(Request $request)
    {
        // Si non connecté, rediriger vers login
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('message', 'Veuillez vous connecter pour finaliser votre commande');
        }

        $cart = Cart::with('items.maillot')->where('user_id', Auth::id())->firstOrFail();

        // TODO: créer une commande réelle
        $cart->items()->delete();
        
        return redirect()->route('orders.index')->with('success', 'Commande validée !');
    }
}