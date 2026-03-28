<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Order;
use App\Helpers\CountryHelper;

class AddressController extends Controller
{
    /**
     * Règles de validation communes à store() et update().
     */
    private function validationRules(): array
    {
        return [
            'type'        => 'required|in:billing,shipping',
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'required|string|max:100',
            'street'      => 'required|string',
            'city'        => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country'     => 'required|string|max:2',
            'phone'       => 'nullable|string|max:20',
            'is_default'  => 'boolean',
        ];
    }

    /**
     * Désactive les autres adresses par défaut du même type pour cet utilisateur.
     */
    private function clearDefaultForType(int $userId, string $type, ?int $excludeId = null): void
    {
        UserAddress::where('user_id', $userId)
            ->where('type', $type)
            ->where('is_archived', false)
            ->when($excludeId, fn($q) => $q->where('id', '<>', $excludeId))
            ->update(['is_default' => false]);
    }

    /**
     * Synchronise les infos de l'adresse de facturation vers le compte utilisateur.
     */
    private function syncBillingAddressToUser(UserAddress $address): void
    {
        User::find($address->user_id)->update([
            'first_name' => $address->first_name,
            'last_name'  => $address->last_name,
            'phone'      => $address->phone,
        ]);
    }

    /**
     * Vérifie si une adresse est liée à des commandes.
     */
    private function hasOrders(UserAddress $address): bool
    {
        return Order::where(function ($query) use ($address) {
            $query->where('shipping_address_id', $address->id)
                  ->orWhere('billing_address_id', $address->id);
        })->exists();
    }

    // Afficher la liste des adresses
    public function index(Request $request)
    {
        $user   = Auth::user();
        $userId = $user->id;

        $addresses = UserAddress::where('user_id', $userId)
            ->where('is_archived', false)
            ->withCount(['ordersAsShipping', 'ordersAsBilling'])
            ->orderBy('type', 'asc')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                $address->is_locked    = ($address->orders_as_shipping_count + $address->orders_as_billing_count) > 0;
                $address->orders_count = $address->orders_as_shipping_count + $address->orders_as_billing_count;
                $address->country_name = CountryHelper::name($address->country);
                return $address;
            });

        return Inertia::render('Addresses', [
            'user'      => $user,
            'addresses' => $addresses,
            'countries' => CountryHelper::forSelect(),
        ]);
    }

    // Enregistrer une nouvelle adresse
    public function store(Request $request)
    {
        Log::info('Données reçues pour création:', $request->all());

        $validated = $request->validate($this->validationRules());
        $userId    = Auth::id();

        if ($validated['is_default'] ?? false) {
            $this->clearDefaultForType($userId, $validated['type']);
        }

        $address = UserAddress::create([
            ...$validated,
            'user_id'     => $userId,
            'is_archived' => false,
        ]);

        if ($validated['type'] === 'billing') {
            $this->syncBillingAddressToUser($address);
        }

        return redirect()->back()->with('success', 'Adresse ajoutée avec succès.');
    }

    // Mettre à jour une adresse
    public function update(Request $request, UserAddress $address)
    {
        Log::info('Données de mise à jour reçues:', $request->all());

        $validated = $request->validate($this->validationRules());
        $userId    = Auth::id();

        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')
                ->with('error', 'Accès non autorisé.');
        }

        $isDefault = $validated['is_default'] ?? false;

        if ($this->hasOrders($address)) {
            // Adresse liée à des commandes : archiver et créer une nouvelle
            if ($isDefault) {
                $this->clearDefaultForType($userId, $validated['type']);
            }

            $address->update(['is_default' => false, 'is_archived' => true]);

            $newAddress = UserAddress::create([
                ...$validated,
                'user_id'     => $userId,
                'is_default'  => $isDefault,
                'is_archived' => false,
            ]);

            if ($newAddress->type === 'billing') {
                $this->syncBillingAddressToUser($newAddress);
            }
        } else {
            // Adresse libre : modification directe
            if ($isDefault) {
                $this->clearDefaultForType($userId, $validated['type'], $address->id);
            }

            $address->update($validated);

            if ($address->type === 'billing') {
                $this->syncBillingAddressToUser($address);
            }
        }

        return redirect()->route('addresses.index')
            ->with('success', 'Adresse mise à jour avec succès.');
    }

    // Supprimer une adresse
    public function destroy(Request $request, UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            return redirect()->route('addresses.index')
                ->with('error', 'Accès non autorisé.');
        }

        if ($this->hasOrders($address)) {
            $address->update(['is_archived' => true, 'is_default' => false]);
        } else {
            $address->delete();
        }

        return redirect()->route('addresses.index')
            ->with('success', 'Adresse supprimée avec succès.');
    }
}