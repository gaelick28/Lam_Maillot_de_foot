<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Club;
use App\Models\Order;
use App\Models\UserAddress;
use App\Helpers\CountryHelper;
use App\Models\OrderActivity;

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
    $user = request()->user();
    
    // 📊 Récupération des activités récentes
    $activities = [];

    // ✅ NOUVEAU : 0️⃣ Activités de changement de statut de commande (expédiée, livrée, etc.)
    $orderActivities = OrderActivity::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();

    foreach ($orderActivities as $orderActivity) {
        $activities[] = [
            'type' => $orderActivity->type,
            'icon' => 'box',
            'message' => $orderActivity->message,
            'date' => $orderActivity->created_at,
            'details' => $orderActivity->details, // Numéro de commande
        ];
    }

    // 1️⃣ Dernières commandes (3 max)
    $recentOrders = Order::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->limit(3)
        ->get();

        foreach ($recentOrders as $order) {
            $activities[] = [
                'type' => 'order',
                'icon' => 'box',
                'message' => "Commande {$order->order_number} passée",
                'date' => $order->created_at,
                'details' => number_format($order->total_amount, 2, ',', ' ') . ' €',
            ];
        }

        // 2️⃣ Dernière modification d'adresse
        $lastAddressUpdate = UserAddress::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->first();

        if ($lastAddressUpdate) {
            // Afficher même si pas modifiée (juste créée)
            $isModified = $lastAddressUpdate->updated_at->gt($lastAddressUpdate->created_at);
            $activities[] = [
                'type' => 'address',
                'icon' => 'map',
                'message' => $isModified ? 'Adresse de livraison modifiée' : 'Adresse de livraison ajoutée',
                'date' => $isModified ? $lastAddressUpdate->updated_at : $lastAddressUpdate->created_at,
                'details' => $lastAddressUpdate->city ?? null,
            ];
        }

        // 3️⃣ Création/Modification du compte
        $isAccountModified = $user->updated_at->gt($user->created_at);
        $activities[] = [
            'type' => 'account',
            'icon' => 'user',
            'message' => $isAccountModified ? 'Informations du compte modifiées' : 'Compte créé',
            'date' => $isAccountModified ? $user->updated_at : $user->created_at,
            'details' => null,
        ];

        // Trier par date décroissante et garder les 5 plus récentes
        if (count($activities) > 0) {
            usort($activities, function($a, $b) {
                return $b['date'] <=> $a['date'];
            });
            
            $activities = array_slice($activities, 0, 10);

            // Formater les dates pour l'affichage
            foreach ($activities as &$activity) {
                $activity['formatted_date'] = $activity['date']->locale('fr')->diffForHumans();
                $activity['full_date'] = $activity['date']->format('d/m/Y à H:i');
                unset($activity['date']); // Retirer l'objet Carbon (non sérialisable pour Inertia)
            }
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'activities' => $activities,
            
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
    ? "{$order->shippingAddress->street}, {$order->shippingAddress->postal_code} {$order->shippingAddress->city}, "
        . CountryHelper::name($order->shippingAddress->country)
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