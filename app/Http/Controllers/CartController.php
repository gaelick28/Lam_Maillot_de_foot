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
            $maillot = Maillot::with('club')->find($sessionItem['maillot_id']);
            
            if (!$maillot) {
                continue;
            }

            $price = $maillot->price ?? 0;
            $suppNom = ($sessionItem['nom'] ?? null) ? 3 : 0;
            $suppNumero = ($sessionItem['numero'] ?? null) ? 2 : 0;
            $supplement = $suppNom + $suppNumero;
            $quantity = $sessionItem['quantity'] ?? 1;
            $total = ($price + $supplement) * $quantity;

            $cartItems->push([
                'id' => $sessionItem['id'], // ID temporaire
                'club_name' => $maillot->club->name ?? 'Club inconnu',
                'maillot_name' => $maillot->nom ?? $maillot->name ?? 'Maillot',
                'maillot_id' => $sessionItem['maillot_id'],
                'image' => $maillot->image,
                'size' => $sessionItem['size'],
                'quantity' => $quantity,
                'price' => $price,
                'nom' => $sessionItem['nom'] ?? null,
                'numero' => $sessionItem['numero'] ?? null,
                'supplement' => $supplement,
                'total' => $total,
                'is_session' => true, // Marquer comme item de session
            ]);
        }

        // Si connecté, récupérer aussi les items de la DB
        if (Auth::check()) {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
            $cart->load('items.maillot.club');

            $user = \App\Models\User::with(['addresses' => function ($query) {
                $query->orderBy('is_default', 'desc')
                      ->orderBy('type', 'asc');
            }])->findOrFail(Auth::id());

                $shippingAddress = $user->addresses
            ->where('type', 'shipping')
            ->sortByDesc('created_at')  //  Priorise par défaut mais accepte les autres
                ->first();

            foreach ($cart->items as $item) {
                $maillot = $item->maillot;
                $price = $maillot ? $maillot->price : 0;
                $suppNom = $item->nom ? 3 : 0;
                $suppNumero = $item->numero ? 2 : 0;
                $supplement = $suppNom + $suppNumero;
                $total = ($price + $supplement) * $item->quantity;

                $cartItems->push([
                    'id' => $item->id,
                    'club_name' => $maillot->club->name ?? 'Club inconnu',
                    'maillot_name' => $maillot->nom ?? $maillot->name ?? 'Maillot',
                    'maillot_id' => $item->maillot_id,
                    'image' => $maillot->image,
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'nom' => $item->nom,
                    'numero' => $item->numero,
                    'supplement' => $supplement,
                    'total' => $total,
                    'is_session' => false, // Item de la DB
                ]);
            }
        }

        return inertia('Panier', [
            'cartItems' => $cartItems,
            'auth' => [
            'user' => $user,
            'shippingAddress' => $shippingAddress  // Nouveau nom plus clair
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

        // Si connecté → ajouter en DB
        if (Auth::check()) {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
            
            $item = $cart->items()
                ->where('maillot_id', $request->maillot_id)
                ->where('size', $request->size)
                ->where('numero', $numero)
                ->where('nom', $nom)
                ->first();

            if ($item) {
                $item->increment('quantity', $request->quantity);
            } else {
                $cart->items()->create([
                    'maillot_id' => $request->maillot_id,
                    'size' => $request->size,
                    'quantity' => $request->quantity,
                    'numero' => $numero,
                    'nom' => $nom,
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
                ($sessionItem['numero'] ?? null) == $numero
            ) {
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
        ]);

        $data['nom'] = $request->filled('nom') ? $request->nom : null;
        $data['numero'] = $request->filled('numero') ? $request->numero : null;

        // Si l'ID commence par "session_" → item de session
        if (str_starts_with($itemId, 'session_')) {
            $sessionCart = Session::get('cart', []);
            
            foreach ($sessionCart as $key => &$sessionItem) {
                if ($sessionItem['id'] === $itemId) {
                    $sessionItem['size'] = $data['size'];
                    $sessionItem['quantity'] = $data['quantity'];
                    $sessionItem['nom'] = $data['nom'];
                    $sessionItem['numero'] = $data['numero'];
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