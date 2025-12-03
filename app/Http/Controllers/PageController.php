<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Club;
use App\Models\Order;

class PageController extends Controller
{
    public function home() {
        return Inertia::render('Home');
    }

    public function loginRegister() {
        return Inertia::render('LoginRegister');
    }

public function dashboard()
{
    return Inertia::render('Dashboard', [
        'user' => request()->user(), // corrected to use request()->user()
    ]);
}
    public function account() {
        return Inertia::render('Account');
    }

    
    // public function order() {
    //     return Inertia::render('Order', [
    //     'user' => request()->user(),]);
    // }    
   

   public function addresses()
{
    return Inertia::render('Addresses', [
        'user' => request()->user(), // corrected to use request()->user()
    ]);
}
   
   


    public function accountDetails() {
       return Inertia::render('AccountDetails', [
        // Ajoutez cette ligne pour passer explicitement l'utilisateur
        'user' => Auth::user() ? collect(Auth::user())->only(['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'birth_date', 'gender']) : null
       ]);
    }

    public function wishlist() {
        return Inertia::render('MyWishlist', [
        'user' => request()->user(),]);
    }

    public function page404() {
        return Inertia::render('Page404');
    }
    
   
    // barre de recherche 
// public function search(Request $request)
// {
//     $query = $request->get('q');
    
//     if (empty($query)) {
//         return redirect()->route('home');
//     }
    
//     // Rechercher le club par nom
//     $club = Club::where('name', 'LIKE', '%' . $query . '%')->first();
    
//     if ($club) {
//         // Si on trouve le club, rediriger vers ses maillots
//         return redirect()->route('club.maillots', ['slug' => $club->slug]);
//     }
    
//     // Si aucun club trouvé, afficher page de résultats vides
//     return inertia('SearchResults', [
//         'query' => $query,
//         'found' => false
//     ]);
// }
/**
 * Afficher l'historique des commandes de l'utilisateur
 */
public function order(Request $request)
{
    $user = $request->user();

    // Récupérer toutes les commandes de l'utilisateur avec les relations
    $orders = Order::with(['items.maillot', 'shippingAddress'])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    // Formater les données pour le frontend
    $ordersFormatted = $orders->map(function ($order) {
        return [
            'id' => $order->order_number, // Ex: CMD-2025-0001
            'date' => $order->created_at->format('d F Y'),
            'items' => $order->items->count(),
            'total' => (float) $order->total_amount,
            'status' => $order->status_label, // "En attente", "Livrée", etc.
            'itemsDetails' => $order->items->map(function ($item) {
                return [
                    'name' => $item->maillot_name,
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->subtotal,
                    'image' => $item->maillot ? $item->maillot->image : null,
                    'numero' => $item->numero,
                    'nom' => $item->nom,
                ];
            })->toArray(),
            'shippingAddress' => $order->shippingAddress 
                ? "{$order->shippingAddress->street}, {$order->shippingAddress->postal_code} {$order->shippingAddress->city}"
                : 'Adresse non disponible',
            'trackingNumber' => null, // À implémenter plus tard si besoin
        ];
    })->toArray();

    return Inertia::render('Order', [
        'user' => $user->only(['id', 'username', 'email']),
        'orders' => $ordersFormatted,
    ]);

}
}

