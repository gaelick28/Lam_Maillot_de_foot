<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Afficher la liste des adresses
     */
    public function index(Request $request)
    {
        $userId = \Illuminate\Support\Facades\Auth::user()->id; // sécurisé

    $addresses = UserAddress::where('user_id', $userId)
        ->orderBy('type', 'asc')
        ->orderBy('is_default', 'desc')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Addresses', [
        'addresses' => $addresses,
        ]);
    }

    /**
     * Enregistrer une nouvelle adresse
     */
    public function store(Request $request)
    {
        // DEBUG: Voir ce qui est reçu
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

        // DEBUG: Voir ce qui est validé
        Log::info('Données validées:', $validated);

        $userId = \Illuminate\Support\Facades\Auth::user()->id;

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

        // DEBUG: Voir ce qui est créé
        Log::info('Adresse créée:', $address->toArray());

        return redirect()->back()->with('success', 'Adresse ajoutée.');
    }

    /**
     * Mettre à jour une adresse
     */
    public function update(Request $request, UserAddress $address)
    {
        // DEBUG: Voir ce qui est reçu
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

        $userId = \Illuminate\Support\Facades\Auth::user()->id;

        // Vérifier que l'adresse appartient à l'utilisateur
        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')->with('error', 'Accès non autorisé.');
        }

        // Si cette adresse est par défaut, désactiver les autres du même type
        if ($address->type === 'billing' && $address->is_default) {
    $user = $address->user;
    $user->update([
        'first_name' => $address->first_name,
        'last_name'  => $address->last_name,
        'phone'      => $address->phone,
    ]);
}

        $address->update($validated);

        return redirect()->route('addresses.index')->with('success', 'Adresse mise à jour.');
        $address->update($validated);

// Synchronisation vers le compte utilisateur si adresse de facturation par défaut
$this->syncBillingAddressToUser($address);
if ($address->type === 'billing' && $address->user_id) {
    // si c’est la seule ou la première adresse de facturation, on peut forcer
    $isOnlyBilling = $address->user->addresses()
        ->where('type', 'billing')
        ->count() === 1;

    if ($address->is_default || $isOnlyBilling) {
        $address->user->update([
            'first_name' => $address->first_name,
            'last_name'  => $address->last_name,
            'phone'      => $address->phone,
        ]);
    }
}
    }

    /**
     * Supprimer une adresse
     */
    public function destroy(Request $request, UserAddress $address)
    {
        $userId = \Illuminate\Support\Facades\Auth::user()->id;

        // Vérifier que l'adresse appartient à l'utilisateur
        if ($address->user_id !== $userId) {
            return redirect()->route('addresses.index')->with('error', 'Accès non autorisé.');
        }

        $address->delete();

        return redirect()->route('addresses.index')->with('success', 'Adresse supprimée avec succès !');
    }
    private function syncBillingAddressToUser(UserAddress $address)
{
    if ($address->type === 'billing' && $address->is_default && $address->user) {
        $address->user->update([
            'first_name' => $address->first_name,
            'last_name'  => $address->last_name,
            'phone'      => $address->phone,
        ]);
    }
}
}
