<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Maillot; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    // Méthode pour récupérer le nombre d'articles
    public function getCount()
    {
        try {
            if (!Auth::check()) {
                return response()->json(['count' => 0]);
            }

            $cart = Cart::where('user_id', Auth::id())->first();
        
            if (!$cart) {
                return response()->json(['count' => 0]);
            }

            $count = $cart->items()->count();
            return response()->json(['count' => $count]);

        } catch (\Exception $e) {
            Log::error('Erreur compteur panier', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
        
            return response()->json(['count' => 0], 500);
        }
    }

   public function show()
{
    $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
    $cart->load('items.maillot.club');

    // Récupérer l'utilisateur avec ses adresses
$user = \App\Models\User::with(['addresses' => function ($query) {
    $query->orderBy('is_default', 'desc')
          ->orderBy('type', 'asc');
}])->findOrFail(Auth::id());

    // Trouver l'adresse de livraison par défaut
    $defaultShippingAddress = $user->addresses
        ->where('type', 'shipping')
        ->where('is_default', true)
        ->first();

    return inertia('Panier', [
        'cartItems' => $cart->items->map(function($item) {
            $maillot = $item->maillot;
            $price = $maillot ? $maillot->price : 0;
            $image = $maillot ? $maillot->image : null;
            $name = $maillot ? $maillot->name : '???';

            // Suppléments personnalisation
            $suppNom = $item->nom ? 3 : 0;
            $suppNumero = $item->numero ? 2 : 0;
            $supplement = $suppNom + $suppNumero;

            // Total ligne
            $total = ($price + $supplement) * $item->quantity;

            return [
                'id' => $item->id,
                'club_name' => $maillot->club->name ?? 'Club inconnu',
                'maillot_name' => $maillot->nom ?? $maillot->name ?? 'Maillot',
                'maillot_id' => $item->maillot_id,
                'name' => $name,
                'image' => $image,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'price' => $price,
                'nom' => $item->nom,
                'numero' => $item->numero,
                'supplement' => $supplement,
                'total' => $total,
            ];
        }),
        'auth' => [
            'user' => $user,
            'defaultShippingAddress' => $defaultShippingAddress
        ]
    ]);
}
    public function add(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        
        $item = $cart->items()
            ->where('maillot_id', $request->maillot_id)
            ->where('size', $request->size)
            ->where('numero', $request->numero ?? '')
            ->where('nom', $request->nom ?? '')
            ->first();

        if ($item) {
            $item->increment('quantity', $request->quantity);
        } else {
            $cart->items()->create([
                'maillot_id' => $request->maillot_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
                'numero' => $request->numero,
                'nom' => $request->nom,
            ]);
        }

        return redirect()->route('cart.show')->with('success', 'Article ajouté au panier');
    }

    public function update(Request $request, CartItem $item)
{
    if ($item->cart->user_id !== Auth::id()) abort(403);
    
    $data = $request->validate([
        'size'     => 'required|string|max:10',
        'quantity' => 'required|integer|min:1',
        'nom'      => 'nullable|string|max:50',
        'numero'   => 'nullable|string|max:3',
    ]);

    $item->update($data);

    // Retourner vers la page panier avec les données fraîches
    return redirect()->route('cart.show')->with('success', 'Article sauvegardé avec succès');
}
    // Méthode utilitaire pour récupérer les items du panier
    private function getCartItems()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        if (!$cart) return [];
        
        $cart->load('items.maillot.club');
        
        return $cart->items->map(function($item) {
            $maillot = $item->maillot;
            $price = $maillot ? $maillot->price : 0;
            $suppNom = $item->nom ? 3 : 0;
            $suppNumero = $item->numero ? 2 : 0;
            $supplement = $suppNom + $suppNumero;
            $total = ($price + $supplement) * $item->quantity;
            
            return [
                'id'          => $item->id,
                'club_name'   => $maillot->club->name ?? 'Club inconnu',
                'maillot_name'=> $maillot->nom ?? $maillot->name ?? 'Maillot',
                'maillot_id'  => $item->maillot_id,
                'name'        => $maillot->name ?? '???',
                'image'       => $maillot->image ?? null,
                'size'        => $item->size,
                'quantity'    => $item->quantity,
                'price'       => $price,
                'nom'         => $item->nom,
                'numero'      => $item->numero,
                'supplement'  => $supplement,
                'total'       => $total,
            ];
        });
    }

    public function remove(CartItem $item)
    {
        // Vérifier que l'item appartient bien à l'utilisateur connecté
        if ($item->cart->user_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }
        
        $item->delete();
        
        return back()->with('success', 'Article supprimé du panier');
    }

    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        if ($cart) {
            $cart->items()->delete();
        }
        
        return back()->with('success', 'Panier vidé');
    }

    public function checkout(Request $request)
    {
        $cart = Cart::with('items.maillot')->where('user_id', Auth::id())->firstOrFail();

        // TODO: créer une commande réelle
        $cart->items()->delete(); // vide le panier
        
        return redirect()->route('orders.index')->with('success', 'Commande validée !');
    }
    
}
