<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Helpers\CountryHelper;
use App\Models\OrderActivity;
use App\Mail\OrderStatusChanged;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    /**
     * Afficher la liste des commandes
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $orders = Order::query()
            ->with(['user'])
            ->when($search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('username', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                      });
            })
            ->when($status, function ($query, $status) {
                $query->where('order_status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Statistiques par statut
        $stats = [
            'all' => Order::count(),
            'pending' => Order::where('order_status', 'pending')->count(),
            'shipped' => Order::where('order_status', 'shipped')->count(),
            'delivered' => Order::where('order_status', 'delivered')->count(),
            'cancelled' => Order::where('order_status', 'cancelled')->count(),
        ];

        return Inertia::render('AdminOrdersIndex', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'auth' => [
                'user' => auth('web')->user()
            ]
        ]);
    }

    /**
     * Afficher les détails d'une commande
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.maillot', 'shippingAddress', 'billingAddress']);

        // Formater les noms de pays
    if ($order->shippingAddress) {
        $order->shippingAddress->country_name = CountryHelper::name($order->shippingAddress->country);
    }
    
    if ($order->billingAddress) {
        $order->billingAddress->country_name = CountryHelper::name($order->billingAddress->country);
    }
        return Inertia::render('AdminOrdersShow', [
            'order' => $order,
            'auth' => [
                'user' => auth('web')->user()
            ]
        ]);
    }

    /**
     * Changer le statut d'une commande
     */
    public function updateStatus(Order $order, Request $request)
{
    $validated = $request->validate([
        'status' => 'required|in:pending,shipped,delivered,cancelled'
    ]);

    $oldStatus = $order->order_status;
    $newStatus = $validated['status'];

    // ✅ AJOUTER CETTE LIGNE
    OrderActivity::recordStatusChange($order, $oldStatus, $newStatus);

    $order->order_status = $newStatus;
    $order->save();
// ✅ Charger les relations
$order->load(['user', 'shippingAddress']);

// ✅ Envoyer l'email
try {
    Mail::to($order->user->email)->send(new OrderStatusChanged($order, $oldStatus, $newStatus));
    Log::info("Email envoyé pour commande {$order->order_number}");
} catch (\Exception $e) {
    Log::error("Erreur envoi email: " . $e->getMessage());
}


    $statusLabels = [
        'pending' => 'En attente',
        'shipped' => 'Expédiée',
        'delivered' => 'Livrée',
        'cancelled' => 'Annulée',
    ];

    return back()->with('success', "Commande #{$order->order_number} : statut changé de '{$statusLabels[$oldStatus]}' à '{$statusLabels[$newStatus]}'");
}
}