<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\Maillot;
use App\Helpers\CountryHelper;

class CheckoutController extends Controller
{
    // Convertit "20,00 €", "20 €", "20.00" -> 20.00
    private function toFloat($val): float
    {
        if ($val === null) return 0.0;
        if (is_numeric($val)) return (float) $val;
        $s = preg_replace('/[^0-9,\.\-]/', '', (string) $val); // garde chiffres, ., , et -
        $s = str_replace(',', '.', $s);
        return (float) $s;
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
                $issues[] = [
                    'message' => "Le maillot n'existe plus.",
                    'item_id' => $item->id,
                ];
                continue;
            }

            $requestedQty = (int) $item->quantity;
            $availableStock = $maillot->getStockForSize($item->size);

            if ($availableStock < $requestedQty) {
                $issues[] = [
                    'message' => sprintf(
                        "%s (taille %s) : Stock insuffisant",
                        $maillot->nom,
                        $item->size
                    ),
                    'details' => sprintf(
                        "Disponible: %d, Demandé: %d",
                        $availableStock,
                        $requestedQty
                    ),
                    'item_id' => $item->id,
                    'maillot_name' => $maillot->nom,
                    'size' => $item->size,
                    'available' => $availableStock,
                    'requested' => $requestedQty,
                ];
            }
        }

        return $issues;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // Suppléments (doivent matcher le front)
        $nomPrix    = 3.0;
        $numeroPrix = 2.0;

        // Panier + relations (adapte si besoin)
        $cart = Cart::with(['items.maillot'])->firstOrCreate(['user_id' => $user->id]);

        // ✅ VÉRIFICATION DES STOCKS
        $stockIssues = $this->checkStockAvailability($cart);

        $itemsOut   = [];
        $subTotal   = 0.0; // prix * quantité (sans suppléments)
        $suppTotal  = 0.0; // suppléments * quantité
        $grandTotal = 0.0; // total général

        foreach ($cart->items as $it) {
            // Prix unitaire : essaie plusieurs colonnes, puis la relation maillot
            $price = $this->toFloat(
                $it->price
                ?? $it->prix
                ?? optional($it->maillot)->price
                ?? optional($it->maillot)->prix
                ?? 0
            );

            $qty = max(1, (int) $it->quantity);

            // Supplément par maillot
            $suppUnit = 0.0;
            if (!empty($it->nom))    $suppUnit += $nomPrix;
            if (!empty($it->numero)) $suppUnit += $numeroPrix;

            $club = $it->club_name
                ?? optional(optional($it->maillot)->club)->name
                ?? optional(optional($it->maillot)->club)->nom
                ?? optional(optional($it->maillot)->club)->title
                ?? null;

            $maillotName = $it->maillot_name
                ?? optional($it->maillot)->name
                ?? optional($it->maillot)->nom
                ?? optional($it->maillot)->title
                ?? optional($it->maillot)->libelle
                ?? null;

            $title = trim(collect([$club, $maillotName])->filter()->implode(', '));

            $imageUrl = $it->image
                ?? optional($it->maillot)->image
                ?? optional($it->maillot)->image_url
                ?? null;

            // Totaux de la ligne
            $lineSupp  = $suppUnit * $qty;
            $lineTotal = ($price * $qty) + $lineSupp;

            // Mise à jour des totaux globaux
            $subTotal  += $price * $qty;
            $suppTotal += $lineSupp;
            $grandTotal += $lineTotal;

            $itemsOut[] = [
                'id'               => $it->id,
                'maillot_id'       => $it->maillot_id,
                'title'            => $title,
                'club_name'        => $club,
                'maillot_name'     => $maillotName,
                'image'            => $imageUrl,
                'size'             => $it->size,
                'quantity'         => $qty,
                'nom'              => $it->nom,
                'numero'           => $it->numero,
                'price'            => $price,
                'supplement_unit'  => $suppUnit,
                'supplement_line'  => $lineSupp,
                'total'            => $lineTotal,
            ];
        }

        // Charger les adresses de livraison ET de facturation
        $shippingAddresses = $user->addresses()
            ->where('type', 'shipping')
            ->where('is_archived', false)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $billingAddresses = $user->addresses()
            ->where('type', 'billing')
            ->where('is_archived', false)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $shippingAddress = $shippingAddresses->first();

        return Inertia::render('Checkout', [
            'auth' => [
                'user' => array_merge(
                    $user->only(['id', 'name', 'email']),
                    [
                        'addresses' => $billingAddresses->map(function($addr) {
                            return [
                                'id' => $addr->id,
                                'type' => $addr->type,
                                'title' => $addr->title ?? null,
                                'first_name' => $addr->first_name,
                                'last_name' => $addr->last_name,
                                'street' => $addr->street,
                                'postal_code' => $addr->postal_code,
                                'city' => $addr->city,
                                'country' => CountryHelper::name($addr->country),
                                'is_default' => (bool) $addr->is_default,
                            ];
                        })
                    ]
                )
            ],
            'items' => $itemsOut,
            'subtotal' => $subTotal,
            'supplements' => $suppTotal,
            'total' => $grandTotal,
            'shippingAddress' => $shippingAddress ? [
                'id' => $shippingAddress->id,
                'first_name' => $shippingAddress->first_name,
                'last_name' => $shippingAddress->last_name,
                'street' => $shippingAddress->street,
                'postal_code' => $shippingAddress->postal_code,
                'city' => $shippingAddress->city,
                'country' => CountryHelper::name($shippingAddress->country),
                'is_default' => (bool) $shippingAddress->is_default,
            ] : null,
            // ✅ NOUVEAU : Passer les erreurs de stock
            'stockIssues' => $stockIssues,
        ]);
    }

    /**
     * Passer au paiement
     */
    public function proceedToPayment(Request $request)
    {
        $user = $request->user();

        // Validation des adresses
        $validated = $request->validate([
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'billing_address_id' => 'required|exists:user_addresses,id',
        ]);

        // Vérifier que le panier n'est pas vide
        $cart = Cart::with('items')->where('user_id', $user->id)->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        // ✅ VÉRIFICATION FINALE DES STOCKS
        $stockIssues = $this->checkStockAvailability($cart);
        
        if (!empty($stockIssues)) {
            return redirect()->route('checkout.index')
                ->with('error', 'Stock insuffisant pour certains articles.')
                ->with('stockIssues', $stockIssues);
        }

        // Stocker les infos en session (temporaire jusqu'au paiement)
        session([
            'checkout_data' => [
                'shipping_address_id' => $validated['shipping_address_id'],
                'billing_address_id' => $validated['billing_address_id'],
            ]
        ]);

        // Rediriger vers la page de paiement
        return redirect()->route('payment.index');
    }
}