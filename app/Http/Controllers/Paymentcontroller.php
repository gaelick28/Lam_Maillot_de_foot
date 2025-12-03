<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\UserAddress;

class PaymentController extends Controller
{
    /**
     * Afficher la page de paiement
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Récupérer les données du checkout depuis la session
        $checkoutData = session('checkout_data');

        if (!$checkoutData) {
            return redirect()->route('checkout.index')
                ->with('error', 'Veuillez d\'abord valider votre commande.');
        }

        // Récupérer le panier
        $cart = Cart::with(['items.maillot.club'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        // Calculer les totaux
        $nomPrix = 3.0;
        $numeroPrix = 2.0;
        $subtotal = 0.0;
        $supplements = 0.0;

        $items = [];

        foreach ($cart->items as $item) {
            $price = (float) ($item->price ?? $item->maillot->price ?? 0);
            $qty = (int) $item->quantity;

            // Supplément personnalisation
            $suppUnit = 0.0;
            if (!empty($item->nom)) $suppUnit += $nomPrix;
            if (!empty($item->numero)) $suppUnit += $numeroPrix;

            $lineSupp = $suppUnit * $qty;
            $lineTotal = ($price * $qty) + $lineSupp;

            $subtotal += $price * $qty;
            $supplements += $lineSupp;

            $items[] = [
                'id' => $item->id,
                'maillot_id' => $item->maillot_id,
                'title' => $item->maillot->nom ?? 'Maillot',
                'club_name' => $item->maillot->club->name ?? null,
                'image' => $item->maillot->image ?? null,
                'size' => $item->size,
                'quantity' => $qty,
                'nom' => $item->nom,
                'numero' => $item->numero,
                'price' => $price,
                'supplement_line' => $lineSupp,
                'total' => $lineTotal,
            ];
        }

        $shippingCost = 0.0; // Frais de port (à ajuster si besoin)
        $total = $subtotal + $supplements + $shippingCost;

        // Récupérer les adresses
        $shippingAddress = UserAddress::find($checkoutData['shipping_address_id']);
        $billingAddress = UserAddress::find($checkoutData['billing_address_id']);

        return Inertia::render('Payment', [
            'auth' => ['user' => $user->only(['id', 'username', 'email'])],
            'items' => $items,
            'subtotal' => $subtotal,
            'supplements' => $supplements,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'shippingAddress' => $shippingAddress,
            'billingAddress' => $billingAddress,
        ]);
    }

    /**
     * Traiter le paiement (factice)
     */
    public function process(Request $request)
    {
        $user = $request->user();

        // Validation
        $validated = $request->validate([
            'payment_method' => 'required|in:card,paypal,transfer',
        ]);

        // Récupérer les données du checkout
        $checkoutData = session('checkout_data');

        if (!$checkoutData) {
            return redirect()->route('checkout.index')
                ->with('error', 'Session expirée. Veuillez recommencer.');
        }

        // Récupérer le panier
        $cart = Cart::with(['items.maillot.club'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        // Transaction pour garantir la cohérence
        DB::beginTransaction();

        try {
            // Calculer les totaux
            $nomPrix = 3.0;
            $numeroPrix = 2.0;
            $subtotal = 0.0;
            $shippingCost = 0.0;

            foreach ($cart->items as $item) {
                $price = (float) ($item->price ?? $item->maillot->price ?? 0);
                $qty = (int) $item->quantity;

                // Supplément personnalisation
                $suppUnit = 0.0;
                if (!empty($item->nom)) $suppUnit += $nomPrix;
                if (!empty($item->numero)) $suppUnit += $numeroPrix;

                $subtotal += ($price + $suppUnit) * $qty;
            }

            $totalAmount = $subtotal + $shippingCost;

            // Créer la commande
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'shipping_address_id' => $checkoutData['shipping_address_id'],
                'billing_address_id' => $checkoutData['billing_address_id'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'paid', // Paiement factice = directement payé
                'order_status' => 'pending',
                'paid_at' => now(),
            ]);

            // Créer les order_items
            foreach ($cart->items as $item) {
                $price = (float) ($item->price ?? $item->maillot->price ?? 0);
                $qty = (int) $item->quantity;

                // Supplément personnalisation
                $suppUnit = 0.0;
                if (!empty($item->nom)) $suppUnit += $nomPrix;
                if (!empty($item->numero)) $suppUnit += $numeroPrix;

                $personalizationCost = $suppUnit * $qty;
                $subtotalLine = ($price * $qty) + $personalizationCost;

                OrderItem::create([
                    'order_id' => $order->id,
                    'maillot_id' => $item->maillot_id,
                    'maillot_name' => $item->maillot->nom ?? 'Maillot',
                    'club_name' => $item->maillot->club->name ?? null,
                    'unit_price' => $price,
                    'size' => $item->size,
                    'quantity' => $qty,
                    'numero' => $item->numero,
                    'nom' => $item->nom,
                    'personalization_cost' => $personalizationCost,
                    'subtotal' => $subtotalLine,
                ]);
            }

            // Vider le panier
            $cart->items()->delete();
            $cart->delete();

            // Supprimer la session checkout
            session()->forget('checkout_data');

            DB::commit();

            // Rediriger vers la page de confirmation
            return redirect()->route('order.confirmation', ['orderId' => $order->id])
                ->with('success', 'Votre commande a été validée avec succès !');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Une erreur est survenue : ' . $e->getMessage());
        }
    }
}