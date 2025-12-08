<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
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

    public function index(Request $request)
    {
        $user = $request->user();

        // Suppléments (doivent matcher le front)
        $nomPrix    = 3.0;
        $numeroPrix = 2.0;

        // Panier + relations (adapte si besoin)
        $cart = Cart::with(['items.maillot'])->firstOrCreate(['user_id' => $user->id]);

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

    // ... (totaux ligne déjà OK)

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
        'title'            => $title,       // <-- libellé complet
        'club_name'        => $club,        // pour fallback côté front
        'maillot_name'     => $maillotName, // pour fallback côté front
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

        // Adresse de livraison  (comme dans Panier.jsx)
       $userAddresses = $user->addresses()
    ->where('type', 'shipping')
    ->orderBy('created_at', 'desc')
    ->get();

$shippingAddress = $userAddresses->first();

        return Inertia::render('Checkout', [
            'auth'            => ['user' => $user->only(['id','name','email'])],
            'items'           => $itemsOut,
            'subtotal'        => $subTotal,
            'supplements'     => $suppTotal,
            'total'           => $grandTotal,
            'shippingAddress' => $shippingAddress ? [
    'id'          => $shippingAddress->id,
    'first_name'  => $shippingAddress->first_name,
    'last_name'   => $shippingAddress->last_name,
    'street'      => $shippingAddress->street,
    'postal_code' => $shippingAddress->postal_code,
    'city'        => $shippingAddress->city,
    'country'     => CountryHelper::name($shippingAddress->country),
    'is_default'  => (bool) $shippingAddress->is_default,
] : null,
        ]);
    }

    /**
     * 🔥 NOUVELLE MÉTHODE : Passer au paiement
     * Valide les adresses et redirige vers /payment
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

    /**
     * ⚠️ ANCIENNE MÉTHODE (à supprimer ou garder pour référence)
     * Ne sera plus utilisée, remplacée par PaymentController::process
     */
    // public function confirm(Request $request)
    // {
    //     // TODO : créer la commande (Order + OrderItems) depuis le panier, vider le panier, rediriger vers une page "merci".
    //     return redirect()->back()->with('success', 'Commande confirmée (démo).');
    // }
}
