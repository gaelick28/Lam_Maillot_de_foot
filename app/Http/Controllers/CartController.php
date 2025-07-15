<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Maillot; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CartController extends Controller
{
    use AuthorizesRequests;
    public function show()
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $cart->load('items.maillot');
        return inertia('Checkout', [
            'cartItems' => $cart->items->map(fn($item) => [
    'id' => $item->id,
    'maillot_id' => $item->maillot_id,
    'name' => $item->maillot->name,
    'number' => $item->maillot->number,
    'size' => $item->size,
    'quantity' => $item->quantity,
    'price' => $item->maillot->price,
    'image' => $item->maillot->image,
    'total' => $item->maillot->price * $item->quantity,
    // AJOUTE ceci :
    'numero' => $item->numero,
    'nom' => $item->nom,
]),
            'user' => Auth::user(),
            // Ajouter l'adresse, etc.
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
        $this->authorize('delete', $item); // optionnel
        $item->delete();
        return back();
    }

    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        if ($cart) $cart->items()->delete();
        return back();
    }

    public function checkout(Request $request)
    {
        $cart = Cart::with('items.maillot')->where('user_id', Auth::id())->firstOrFail();

        // TODO: créer une commande réelle
        // Order::create([...])

        $cart->items()->delete(); // vide le panier
        return redirect()->route('orders.index')->with('success', 'Commande validée !');
    }
    
}
