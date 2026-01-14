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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

        // ✅ VÉRIFICATION DES STOCKS AVANT AFFICHAGE
        $stockIssues = $this->checkStockAvailability($cart);
        
        if (!empty($stockIssues)) {
            // Rediriger vers le panier avec les erreurs
            return redirect()->route('cart.show')
                ->with('error', 'Certains articles ne sont plus disponibles en stock.')
                ->with('stock_issues', $stockIssues);
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
            'shippingAddress' => $shippingAddress ? [
                'first_name'  => $shippingAddress->first_name,
                'last_name'   => $shippingAddress->last_name,
                'street'      => $shippingAddress->street,
                'postal_code' => $shippingAddress->postal_code,
                'city'        => $shippingAddress->city,
                'country'     => CountryHelper::name($shippingAddress->country),
            ] : null,
            'billingAddress' => $billingAddress ? [
                'first_name'  => $billingAddress->first_name,
                'last_name'   => $billingAddress->last_name,
                'street'      => $billingAddress->street,
                'postal_code' => $billingAddress->postal_code,
                'city'        => $billingAddress->city,
                'country'     => CountryHelper::name($billingAddress->country),
            ] : null,
        ]);
    }

    /**
     * ✅ NOUVELLE MÉTHODE : Vérifier la disponibilité des stocks
     */
    private function checkStockAvailability($cart)
    {
        $issues = [];

        foreach ($cart->items as $item) {
            $maillot = Maillot::find($item->maillot_id);
            
            if (!$maillot) {
                $issues[] = "Le maillot n'existe plus.";
                continue;
            }

            $requestedQty = (int) $item->quantity;
            $availableStock = $maillot->getStockForSize($item->size);

            if ($availableStock < $requestedQty) {
                $issues[] = sprintf(
                    "%s (taille %s) : Stock insuffisant (disponible: %d, demandé: %d)",
                    $maillot->nom,
                    $item->size,
                    $availableStock,
                    $requestedQty
                );
            }
        }

        return $issues;
    }

    /**
     * Traiter le paiement avec décrémentation des stocks
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

        // ✅ VÉRIFICATION FINALE DES STOCKS
        $stockIssues = $this->checkStockAvailability($cart);
        
        if (!empty($stockIssues)) {
            return redirect()->route('cart.show')
                ->with('error', 'Stock insuffisant pour certains articles.')
                ->with('stock_issues', $stockIssues);
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

            // Créer les order_items ET décrémenter les stocks
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

                // ✅ DÉCRÉMENTER LE STOCK
                $maillot = Maillot::find($item->maillot_id);
                
                if ($maillot) {
                    $success = $maillot->decrementStock($item->size, $qty);
                    
                    if (!$success) {
                        throw new \Exception("Impossible de décrémenter le stock pour {$maillot->nom} taille {$item->size}");
                    }
                }
            }

            // Vider le panier
            $cart->items()->delete();
            $cart->delete();

            // Supprimer la session checkout
            session()->forget('checkout_data');

            DB::commit();

            // ✅ ENVOI D'EMAIL DE CONFIRMATION (NON-BLOQUANT) IMPORTANT:COMMENTER ICI POUR TESTER SANS ENVOI
            $this->sendOrderConfirmationEmail($order);

            // Rediriger vers la page de confirmation
            return redirect()->route('order.confirmation', ['orderId' => $order->id])
                ->with('success', 'Votre commande a été validée avec succès !');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Une erreur est survenue : ' . $e->getMessage());
        }
    }

    /**
     * ✅ NOUVELLE MÉTHODE : Envoi d'email de confirmation de commande (non-bloquant)
     */
    private function sendOrderConfirmationEmail($order)
    {

    
        // Vérifier si l'envoi d'email est activé
        if (!env('MAIL_ORDER_CONFIRMATION_ENABLED', true)) {
            Log::info('Email de confirmation désactivé pour la commande ' . $order->order_number);
            return;
        }

        try {
            // Charger les relations nécessaires
            $order->load(['items.maillot', 'user', 'shippingAddress', 'billingAddress']);

            // Envoyer l'email
            Mail::to($order->user->email)->send(new \App\Mail\OrderConfirmationMail($order));

            Log::info('Email de confirmation envoyé avec succès pour la commande ' . $order->order_number);

        } catch (\Exception $e) {
            // ⚠️ IMPORTANT : On log l'erreur mais on ne fait PAS échouer la commande
            Log::error('Erreur lors de l\'envoi de l\'email de confirmation : ' . $e->getMessage(), [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'user_email' => $order->user->email ?? 'N/A',
            ]);

            // La commande est QUAND MÊME validée, même si l'email n'est pas parti
        }
    }
}