<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Page de confirmation de commande
     */
    public function confirmation(Request $request, $orderId)
    {
        $user = $request->user();

        // Récupérer la commande avec ses items
        $order = Order::with(['items.maillot', 'shippingAddress', 'billingAddress'])
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('OrderConfirmation', [
            'auth' => ['user' => $user->only(['id', 'username', 'email'])],
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'total_amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_method_label' => $order->payment_method_label,
                'order_status' => $order->order_status,
                'status_label' => $order->status_label,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'maillot_name' => $item->maillot_name,
                        'club_name' => $item->club_name,
                        'image' => $item->maillot->image ?? null,
                        'size' => $item->size,
                        'quantity' => $item->quantity,
                        'numero' => $item->numero,
                        'nom' => $item->nom,
                        'personalization_text' => $item->personalization_text,
                        'unit_price' => $item->unit_price,
                        'personalization_cost' => $item->personalization_cost,
                        'subtotal' => $item->subtotal,
                    ];
                }),
                'shippingAddress' => $order->shippingAddress ? [
                    'first_name' => $order->shippingAddress->first_name,
                    'last_name' => $order->shippingAddress->last_name,
                    'street' => $order->shippingAddress->street,
                    'postal_code' => $order->shippingAddress->postal_code,
                    'city' => $order->shippingAddress->city,
                    'country'     => $order->shippingAddress->country,
                ] : null,
                'billingAddress' => $order->billingAddress ? [
                    'first_name' => $order->billingAddress->first_name,
                    'last_name' => $order->billingAddress->last_name,
                    'street' => $order->billingAddress->street,
                    'postal_code' => $order->billingAddress->postal_code,
                    'city' => $order->billingAddress->city,
                    'country'     => $order->shippingAddress->country,
                ] : null,
            ],
        ]);
    }

    /**
     * Historique des commandes
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Orders', [
            'auth' => ['user' => $user->only(['id', 'username', 'email'])],
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'order_status' => $order->order_status,
                    'status_label' => $order->status_label,
                    'created_at' => $order->created_at->format('d/m/Y'),
                    'items_count' => $order->items->count(),
                ];
            }),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Détails d'une commande
     */
    public function show(Request $request, $orderId)
    {
        $user = $request->user();

        $order = Order::with(['items.maillot', 'shippingAddress', 'billingAddress'])
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('OrderDetail', [
            'auth' => ['user' => $user->only(['id', 'username', 'email'])],
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'total_amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_method_label' => $order->payment_method_label,
                'order_status' => $order->order_status,
                'status_label' => $order->status_label,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'paid_at' => $order->paid_at ? $order->paid_at->format('d/m/Y H:i') : null,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'maillot_name' => $item->maillot_name,
                        'club_name' => $item->club_name,
                        'image' => $item->maillot->image ?? null,
                        'size' => $item->size,
                        'quantity' => $item->quantity,
                        'numero' => $item->numero,
                        'nom' => $item->nom,
                        'personalization_text' => $item->personalization_text,
                        'unit_price' => $item->unit_price,
                        'personalization_cost' => $item->personalization_cost,
                        'subtotal' => $item->subtotal,
                    ];
                }),
                'shippingAddress' => $order->shippingAddress,
                'billingAddress' => $order->billingAddress,
            ],
        ]);
    }
}