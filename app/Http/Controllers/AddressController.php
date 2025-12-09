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
    // Afficher la liste des adresses
    public function index(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $addresses = UserAddress::where('user_id', $userId)
            ->withCount(['ordersAsShipping', 'ordersAsBilling']) // 🔥 Compter les commandes liées
            ->orderBy('type', 'asc')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                // 🔥 Marquer les adresses "verrouillées" (utilisées dans des commandes)
                $address->is_locked = ($address->orders_as_shipping_count + $address->orders_as_billing_count) > 0;
                $address->orders_count = $address->orders_as_shipping_count + $address->orders_as_billing_count;
                
                // 🔥 AJOUT : Convertir le code pays en nom complet
                $address->country_name = CountryHelper::name($address->country);

                return $address;
            });

        return Inertia::render('Addresses', [
            'user' => $user,  
            'addresses' => $addresses,
            'countries' => CountryHelper::forSelect(), // 🔥 AJOUT : Liste des pays pour le select
        ]);
    }

    // Enregistrer une nouvelle adresse
    public function store(Request $request)
    {
        Log::info('Données reçues pour création:', $request->all());

        $validated = $request->validate([
            'type' => 'required|in:billing,shipping',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'street' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        Log::info('Données validées:', $validated);

        $userId = Auth::user()->id;

        // Si cette adresse est par défaut, désactiver les autres du même type
        if ($validated['is_default'] ?? false) {
            UserAddress::where('user_id', $userId)
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        // Synchroniser vers le compte utilisateur si c'est une adresse de facturation
        if ($validated['type'] === 'billing') {
            User::find($userId)->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
            ]);
        }

        $address = UserAddress::create([
            'user_id' => $userId,
            'type' => $validated['type'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'street' => $validated['street'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
            'country' => $validated['country'],
            'phone' => $validated['phone'],
            'is_default' => $validated['is_default'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Adresse ajoutée avec succès.');
    }

    // Mettre à jour une adresse
    public function update(Request $request, UserAddress $address)
    {
        Log::info('Données de mise à jour reçues:', $request->all());

        $validated = $request->validate([
            'type' => 'required|in:billing,shipping',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'street' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $userId = Auth::user()->id;

        // Vérifier que l'adresse appartient à l'utilisateur
        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')
                ->with('error', 'Accès non autorisé.');
        }

        // 🔥 AMÉLIORATION : Vérifier si l'adresse est utilisée dans des commandes
        $hasOrders = Order::where(function($query) use ($address) {
            $query->where('shipping_address_id', $address->id)
                  ->orWhere('billing_address_id', $address->id);
        })->exists();

        if ($hasOrders) {
            // ⚠️ L'adresse est verrouillée : créer une nouvelle adresse
            $isDefault = $validated['is_default'] ?? false;

            if ($isDefault) {
                UserAddress::where('user_id', $userId)
                    ->where('type', $validated['type'])
                    ->update(['is_default' => false]);
            }

            $newAddress = UserAddress::create([
                'user_id' => $userId,
                'type' => $validated['type'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'street' => $validated['street'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'country' => $validated['country'],
                'phone' => $validated['phone'],
                'is_default' => $isDefault,
            ]);

            // Synchroniser vers le compte utilisateur si c'est une adresse de facturation
            if ($newAddress->type === 'billing') {
                $this->syncBillingAddressToUser($newAddress);
            }

            // 🔥 Marquer l'ancienne adresse comme "archivée" au lieu de la laisser active
            $address->update(['is_default' => false]);

            return redirect()
                ->route('addresses.index')
                ->with('success', 'Une nouvelle adresse a été créée. L\'ancienne est conservée pour vos commandes existantes.');
        }

        // 🟢 L'adresse n'est pas verrouillée : modification normale
        $isDefault = $validated['is_default'] ?? false;

        if ($isDefault) {
            UserAddress::where('user_id', $userId)
                ->where('type', $validated['type'])
                ->where('id', '<>', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        // Synchroniser vers le compte utilisateur si c'est une adresse de facturation
        if ($address->type === 'billing') {
            $this->syncBillingAddressToUser($address);
        }

        return redirect()->route('addresses.index')
            ->with('success', 'Adresse mise à jour avec succès.');
    }

    // Supprimer une adresse
    public function destroy(Request $request, UserAddress $address)
    {
        $userId = Auth::user()->id;

        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')
                ->with('error', 'Accès non autorisé.');
        }

        // ❌ Ne pas supprimer si l'adresse est utilisée dans une commande
        $hasOrders = Order::where(function($query) use ($address) {
            $query->where('shipping_address_id', $address->id)
                  ->orWhere('billing_address_id', $address->id);
        })->exists();

        if ($hasOrders) {
            return redirect()
                ->route('addresses.index')
                ->with('error', 'Cette adresse est utilisée dans vos commandes et ne peut pas être supprimée. Elle sera conservée pour l\'historique.');
        }

        $address->delete();

        return redirect()->route('addresses.index')
            ->with('success', 'Adresse supprimée avec succès.');
    }

    // Synchroniser l'adresse de facturation vers le compte utilisateur
    private function syncBillingAddressToUser(UserAddress $address)
    {
        User::find($address->user_id)->update([
            'first_name' => $address->first_name,
            'last_name' => $address->last_name,
            'phone' => $address->phone,
        ]);
    }
}