<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Helpers\CountryHelper;
use App\Services\PricingService;

class CheckoutController extends Controller
{
    public function __construct(private PricingService $pricing) {}

    // Convertit "20,00 €", "20 €", "20.00" -> 20.00
    private function toFloat($val): float
    {
        if ($val === null) return 0.0;
        if (is_numeric($val)) return (float) $val;
        $s = preg_replace('/[^0-9,\.\-]/', '', (string) $val);
        $s = str_replace(',', '.', $s);
        return (float) $s;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $cart = Cart::with(['items.maillot.club.patches'])->firstOrCreate(['user_id' => $user->id]);

        $stockIssues = $this->pricing->checkStockAvailability($cart->items);

        $itemsOut   = [];
        $subTotal   = 0.0;
        $suppTotal  = 0.0;
        $grandTotal = 0.0;

        foreach ($cart->items as $it) {
            $price = $this->toFloat(
                $it->price
                ?? $it->prix
                ?? optional($it->maillot)->price
                ?? optional($it->maillot)->prix
                ?? 0
            );

            $qty     = max(1, (int) $it->quantity);
            $patches = $it->patches ?? [];

            $suppUnit  = $this->pricing->calculateSupplement($it->nom, $it->numero, $patches);
            $lineSupp  = $suppUnit * $qty;
            $lineTotal = ($price * $qty) + $lineSupp;

            $subTotal   += $price * $qty;
            $suppTotal  += $lineSupp;
            $grandTotal += $lineTotal;

            $club = optional(optional($it->maillot)->club)->name ?? null;
            $maillotName = optional($it->maillot)->nom ?? null;
            $title = trim(collect([$club, $maillotName])->filter()->implode(', '));
            $imageUrl = optional($it->maillot)->image ?? null;

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
                'patches'          => $patches,
                'patch_names'      => $this->pricing->resolvePatchNames($patches),
                'available_patches' => optional($it->maillot->club)->patches
                    ?->map(fn($p) => ['id' => $p->id, 'nom' => $p->nom])
                    ->toArray() ?? [],
            ];
        }

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
                        'addresses' => $billingAddresses->map(fn($addr) => [
                            'id'          => $addr->id,
                            'type'        => $addr->type,
                            'title'       => $addr->title ?? null,
                            'first_name'  => $addr->first_name,
                            'last_name'   => $addr->last_name,
                            'street'      => $addr->street,
                            'postal_code' => $addr->postal_code,
                            'city'        => $addr->city,
                            'country'     => CountryHelper::name($addr->country),
                            'is_default'  => (bool) $addr->is_default,
                        ])
                    ]
                )
            ],
            'items'          => $itemsOut,
            'subtotal'       => $subTotal,
            'supplements'    => $suppTotal,
            'total'          => $grandTotal,
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
            'stockIssues' => $stockIssues,
        ]);
    }

    public function proceedToPayment(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'billing_address_id'  => 'required|exists:user_addresses,id',
        ]);

        $cart = Cart::with('items.maillot')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.show')
                ->with('error', 'Votre panier est vide.');
        }

        $stockIssues = $this->pricing->checkStockAvailability($cart->items);

        if (!empty($stockIssues)) {
            return redirect()->route('checkout.index')
                ->with('error', 'Stock insuffisant pour certains articles.')
                ->with('stockIssues', $stockIssues);
        }

        session([
            'checkout_data' => [
                'shipping_address_id' => $validated['shipping_address_id'],
                'billing_address_id'  => $validated['billing_address_id'],
            ]
        ]);

        return redirect()->route('payment.index');
    }
}