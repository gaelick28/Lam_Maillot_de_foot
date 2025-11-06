<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    // Afficher la liste des adresses
    public function index(Request $request)
    {
        $userId = Auth::user()->id; // sécurisé

        $addresses = UserAddress::where('user_id', $userId)
            ->orderBy('type', 'asc')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Addresses', [
            'addresses' => $addresses,
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

        return redirect()->back()->with('success', 'Adresse ajoutée.');
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
            return redirect()->route('addresses.index')->with('error', 'Accès non autorisé.');
        }

        // Si cette adresse est par défaut, désactiver les autres du même type
        if ($address->type === 'billing' && $validated['is_default'] ?? false) {
            UserAddress::where('user_id', $userId)
                ->where('type', 'billing')
                ->where('id', '<>', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        // Synchronisation vers le compte utilisateur si adresse de facturation par défaut
        if ($address->type === 'billing' && ($address->is_default || $this->isOnlyBilling($address))) {
            $this->syncBillingAddressToUser($address);
        }

        return redirect()->route('addresses.index')->with('success', 'Adresse mise à jour.');
    }

    // Supprimer une adresse
    public function destroy(Request $request, UserAddress $address)
    {
        $userId = Auth::user()->id;

        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')->with('error', 'Accès non autorisé.');
        }

        $address->delete();

        return redirect()->route('addresses.index')->with('success', 'Adresse supprimée avec succès !');
    }

    // Synchroniser l'adresse de facturation dans le compte utilisateur
    private function syncBillingAddressToUser(UserAddress $address)
    {
        if ($address->type === 'billing' && $address->is_default && $address->user) {
            $address->user->update([
                'first_name' => $address->first_name,
                'last_name' => $address->last_name,
                'phone' => $address->phone,
            ]);
        }
    }

    // Vérifier si c'est la seule adresse de facturation
    private function isOnlyBilling(UserAddress $address)
    {
        return $address->user->addresses()
            ->where('type', 'billing')
            ->count() === 1;
    }
}
