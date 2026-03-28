<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\UserAddress;
use App\Models\Maillot;
use App\Helpers\CountryHelper;
use App\Services\PricingService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function __construct(private PricingService $pricing) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $checkoutData = session('checkout_data');

        if (!$checkoutData) {
            return redirect()->route('checkout.index')
                ->with('error', 'Veuillez d\'abord valider votre commande.');
        }

        $cart = Cart::with(['items.maillot.club'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        $stockIssues = $this->pricing->checkStockAvailability($cart->items);

        if (!empty($stockIssues)) {
            return redirect()->route('cart.show')
                ->with('error', 'Certains articles ne sont plus disponibles en stock.')
                ->with('stock_issues', $stockIssues);
        }

        $subtotal    = 0.0;
        $supplements = 0.0;
        $items       = [];

        foreach ($cart->items as $item) {
            $price   = (float) ($item->price ?? $item->maillot->price ?? 0);
            $qty     = (int) $item->quantity;
            $patches = $item->patches ?? [];

            $suppUnit  = $this->pricing->calculateSupplement($item->nom, $item->numero, $patches);
            $lineSupp  = $suppUnit * $qty;
            $lineTotal = ($price * $qty) + $lineSupp;

            $subtotal    += $price * $qty;
            $supplements += $lineSupp;

            $items[] = [
                'id'              => $item->id,
                'maillot_id'      => $item->maillot_id,
                'title'           => $item->maillot->nom ?? 'Maillot',
                'club_name'       => $item->maillot->club->name ?? null,
                'image'           => $item->maillot->image ?? null,
                'size'            => $item->size,
                'quantity'        => $qty,
                'nom'             => $item->nom,
                'numero'          => $item->numero,
                'patches'         => $patches,
                'patch_names'     => $this->pricing->resolvePatchNames($patches),
                'price'           => $price,
                'supplement_line' => $lineSupp,
                'total'           => $lineTotal,
            ];
        }

        $shippingCost = 0.0;
        $total        = $subtotal + $supplements + $shippingCost;

        $shippingAddress = UserAddress::find($checkoutData['shipping_address_id']);
        $billingAddress  = UserAddress::find($checkoutData['billing_address_id']);

        return Inertia::render('Payment', [
            'auth'            => ['user' => $user->only(['id', 'username', 'email'])],
            'items'           => $items,
            'subtotal'        => $subtotal,
            'supplements'     => $supplements,
            'shipping_cost'   => $shippingCost,
            'total'           => $total,
            'shippingAddress' => $shippingAddress ? [
                'first_name'  => $shippingAddress->first_name,
                'last_name'   => $shippingAddress->last_name,
                'street'      => $shippingAddress->street,
                'postal_code' => $shippingAddress->postal_code,
                'city'        => $shippingAddress->city,
                'country'     => CountryHelper::name($shippingAddress->country),
            ] : null,
            'billingAddress'  => $billingAddress ? [
                'first_name'  => $billingAddress->first_name,
                'last_name'   => $billingAddress->last_name,
                'street'      => $billingAddress->street,
                'postal_code' => $billingAddress->postal_code,
                'city'        => $billingAddress->city,
                'country'     => CountryHelper::name($billingAddress->country),
            ] : null,
        ]);
    }

    public function process(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'payment_method' => 'required|in:card,paypal,transfer',
        ]);

        $checkoutData = session('checkout_data');

        if (!$checkoutData) {
            return redirect()->route('checkout.index')
                ->with('error', 'Session expirée. Veuillez recommencer.');
        }

        $cart = Cart::with(['items.maillot.club'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        $stockIssues = $this->pricing->checkStockAvailability($cart->items);

        if (!empty($stockIssues)) {
            return redirect()->route('cart.show')
                ->with('error', 'Stock insuffisant pour certains articles.')
                ->with('stock_issues', $stockIssues);
        }

        DB::beginTransaction();

        try {
            $subtotal     = 0.0;
            $shippingCost = 0.0;

            foreach ($cart->items as $item) {
                $price   = (float) ($item->price ?? $item->maillot->price ?? 0);
                $qty     = (int) $item->quantity;
                $patches = $item->patches ?? [];

                $subtotal += $this->pricing->calculateLineTotal($price, $item->nom, $item->numero, $patches, $qty);
            }

            $totalAmount = $subtotal + $shippingCost;

            $order = Order::create([
                'user_id'             => $user->id,
                'order_number'        => Order::generateOrderNumber(),
                'subtotal'            => $subtotal,
                'shipping_cost'       => $shippingCost,
                'total_amount'        => $totalAmount,
                'shipping_address_id' => $checkoutData['shipping_address_id'],
                'billing_address_id'  => $checkoutData['billing_address_id'],
                'payment_method'      => $validated['payment_method'],
                'payment_status'      => 'paid',
                'order_status'        => 'pending',
                'paid_at'             => now(),
            ]);

            foreach ($cart->items as $item) {
                $price   = (float) ($item->price ?? $item->maillot->price ?? 0);
                $qty     = (int) $item->quantity;
                $patches = $item->patches ?? [];

                $suppUnit           = $this->pricing->calculateSupplement($item->nom, $item->numero, $patches);
                $personalizationCost = $suppUnit * $qty;
                $subtotalLine       = ($price * $qty) + $personalizationCost;

                OrderItem::create([
                    'order_id'             => $order->id,
                    'maillot_id'           => $item->maillot_id,
                    'maillot_name'         => $item->maillot->nom ?? 'Maillot',
                    'club_name'            => $item->maillot->club->name ?? null,
                    'unit_price'           => $price,
                    'size'                 => $item->size,
                    'quantity'             => $qty,
                    'numero'               => $item->numero,
                    'patches'              => $patches,
                    'nom'                  => $item->nom,
                    'personalization_cost' => $personalizationCost,
                    'subtotal'             => $subtotalLine,
                ]);

                $maillot = Maillot::find($item->maillot_id);

                if ($maillot) {
                    $success = $maillot->decrementStock($item->size, $qty);

                    if (!$success) {
                        throw new \Exception("Impossible de décrémenter le stock pour {$maillot->nom} taille {$item->size}");
                    }
                }
            }

            $cart->items()->delete();
            $cart->delete();

            session()->forget('checkout_data');

            DB::commit();

            $this->sendOrderConfirmationEmail($order);

            return redirect()->route('order.confirmation', ['orderId' => $order->id])
                ->with('success', 'Votre commande a été validée avec succès !');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Une erreur est survenue : ' . $e->getMessage());
        }
    }

    private function sendOrderConfirmationEmail($order)
    {
        if (!env('MAIL_ORDER_CONFIRMATION_ENABLED', true)) {
            Log::info('Email de confirmation désactivé pour la commande ' . $order->order_number);
            return;
        }

        try {
            $order->load(['items.maillot', 'user', 'shippingAddress', 'billingAddress']);
            Mail::to($order->user->email)->send(new \App\Mail\OrderConfirmationMail($order));
            Log::info('Email de confirmation envoyé pour la commande ' . $order->order_number);
        } catch (\Exception $e) {
            Log::error('Erreur envoi email confirmation : ' . $e->getMessage(), [
                'order_id'    => $order->id,
                'order_number' => $order->order_number,
                'user_email'  => $order->user->email ?? 'N/A',
            ]);
        }
    }
}