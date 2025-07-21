<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Maillot; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function show()
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $cart->load('items.maillot');

        return inertia('Panier', [
            'cartItems' => $cart->items->map(function($item) {
                $maillot = $item->maillot;
                $price = $maillot ? $maillot->price : 0;
                $image = $maillot ? $maillot->image : null;
                $name = $maillot ? $maillot->name : '???';

                // Suppléments personnalisation
                $suppNom = $item->nom ? 3 : 0;         // 3€ pour nom
                $suppNumero = $item->numero ? 2 : 0;   // 2€ pour numéro
                $supplement = $suppNom + $suppNumero;

                // Total ligne
                $total = ($price + $supplement) * $item->quantity;

                return [
                    'id' => $item->id, 
                    'club_name' => $maillot->club->name,
                    'maillot_name' => $maillot->nom,
                    'maillot_id' => $maillot ? $maillot->id : null,
                    'name'       => $name,
                    'image'      => $image,
                    'size'       => $item->size,
                    'quantity'   => $item->quantity,
                    'price'      => $price,
                    'nom'        => $item->nom,
                    'numero'     => $item->numero,
                    'supplement' => $supplement,
                    'total'      => $total,
                ];
            }),
        ]);
    }

    public function add(Request $request)
    {
        
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $item = $cart->items()
            ->where('maillot_id', $request->maillot_id)
            ->where('size', $request->size)
            ->where('numero', $request->numero)
            ->where('nom', $request->nom)
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
        return redirect()->route('cart.show');
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
        // Order::create([...])

        $cart->items()->delete(); // vide le panier
        return redirect()->route('orders.index')->with('success', 'Commande validée !');
    }
    
   public function update(Request $request, CartItem $item)
{
    if ($item->cart->user_id !== Auth::id()) abort(403);

    $data = $request->validate([
        'size'     => 'required|string|max:10',
        'quantity' => 'required|integer|min:1',
        'nom'      => 'nullable|string|max:50',
        'numero'   => 'nullable|integer|min:0|max:99',
    ]);
    $item->update($data);

    // Regénère le panier entier et l'envoie
    $cart = $item->cart;
    $cart->load('items.maillot');
    $cartItems = $cart->items->map(function($item) {
        $maillot = $item->maillot;
        $price = $maillot ? $maillot->price : 0;
        $suppNom = $item->nom ? 3 : 0;
        $suppNumero = $item->numero ? 2 : 0;
        $supplement = $suppNom + $suppNumero;
        $total = ($price + $supplement) * $item->quantity;
        return [
            'id'          => $maillot->id,
            'club_name'   => $maillot->club->name,
            'maillot_name'=> $maillot->nom,
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
$item->update($data);

   return redirect()->route('cart.show')->with('success', 'Article du panier mis à jour !');
}


}