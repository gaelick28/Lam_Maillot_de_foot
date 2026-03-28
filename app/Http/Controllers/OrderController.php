<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Helpers\CountryHelper;
use App\Services\PricingService;

class OrderController extends Controller
{
    public function __construct(private PricingService $pricing) {}

    /**
     * Formate un item de commande en tableau pour le frontend.
     * Centralise le mapping commun à confirmation(), history() et show().
     */
    private function formatItem($item): array
    {
        return [
            'id'                   => $item->id,
            'maillot_name'         => $item->maillot_name,
            'club_name'            => $item->club_name,
            'image'                => $item->maillot->image ?? null,
            'size'                 => $item->size,
            'quantity'             => $item->quantity,
            'numero'               => $item->numero,
            'nom'                  => $item->nom,
            'personalization_text' => $item->personalization_text ?? null,
            'unit_price'           => $item->unit_price,
            'personalization_cost' => $item->personalization_cost,
            'subtotal'             => $item->subtotal,
            'patch_names'          => $this->pricing->resolvePatchNames($item->patches ?? []),
        ];
    }

    /**
     * Formate une adresse en tableau pour le frontend.
     */
    private function formatAddress($address): ?array
    {
        if (!$address) return null;

        return [
            'first_name'  => $address->first_name,
            'last_name'   => $address->last_name,
            'street'      => $address->street,
            'postal_code' => $address->postal_code,
            'city'        => $address->city,
            'country'     => CountryHelper::name($address->country),
        ];
    }

    /**
     * Page de confirmation de commande
     */
    public function confirmation(Request $request, $orderId)
    {
        $user  = $request->user();
        $order = Order::with(['items.maillot', 'shippingAddress', 'billingAddress'])
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('OrderConfirmation', [
            'auth'  => ['user' => $user->only(['id', 'username', 'email'])],
            'order' => [
                'id'                   => $order->id,
                'order_number'         => $order->order_number,
                'subtotal'             => $order->subtotal,
                'shipping_cost'        => $order->shipping_cost,
                'total_amount'         => $order->total_amount,
                'payment_method'       => $order->payment_method,
                'payment_method_label' => $order->payment_method_label,
                'order_status'         => $order->order_status,
                'status_label'         => $order->status_label,
                'items'                => $order->items->map(fn($item) => $this->formatItem($item)),
                'shippingAddress'      => $this->formatAddress($order->shippingAddress),
                'billingAddress'       => $this->formatAddress($order->billingAddress),
            ],
        ]);
    }

    /**
     * Historique des commandes
     */
    public function history(Request $request)
    {
        $user   = $request->user();
        $orders = Order::with(['items.maillot', 'shippingAddress', 'billingAddress'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Order', [
            'user'       => $user->only(['id', 'username', 'email']),
            'orders'     => $orders->map(function ($order) {
                $shipping = $order->shippingAddress;
                $billing  = $order->billingAddress;

                return [
                    'id'              => $order->order_number,
                    'date'            => $order->created_at->format('d F Y'),
                    'items'           => $order->items->count(),
                    'total'           => $order->total_amount,
                    'status'          => $order->status_label,
                    'trackingNumber'  => null,
                    'itemsDetails'    => $order->items->map(fn($item) => $this->formatItem($item)),
                    'shippingAddress' => $shipping
                        ? "{$shipping->first_name} {$shipping->last_name}\n{$shipping->street}\n{$shipping->postal_code} {$shipping->city}\n" . CountryHelper::name($shipping->country)
                        : 'Adresse non disponible',
                    'billingAddress'  => $billing
                        ? "{$billing->first_name} {$billing->last_name}\n{$billing->street}\n{$billing->postal_code} {$billing->city}\n" . CountryHelper::name($billing->country)
                        : 'Adresse non disponible',
                ];
            }),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /**
     * Détails d'une commande
     */
    public function show(Request $request, $orderId)
    {
        $user  = $request->user();
        $order = Order::with(['items.maillot', 'shippingAddress', 'billingAddress'])
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('OrderDetail', [
            'auth'  => ['user' => $user->only(['id', 'username', 'email'])],
            'order' => [
                'id'                   => $order->id,
                'order_number'         => $order->order_number,
                'subtotal'             => $order->subtotal,
                'shipping_cost'        => $order->shipping_cost,
                'total_amount'         => $order->total_amount,
                'payment_method'       => $order->payment_method,
                'payment_method_label' => $order->payment_method_label,
                'order_status'         => $order->order_status,
                'status_label'         => $order->status_label,
                'created_at'           => $order->created_at->format('d/m/Y H:i'),
                'paid_at'              => $order->paid_at?->format('d/m/Y H:i'),
                'items'                => $order->items->map(fn($item) => $this->formatItem($item)),
                'shippingAddress'      => $this->formatAddress($order->shippingAddress),
                'billingAddress'       => $this->formatAddress($order->billingAddress),
            ],
        ]);
    }
}