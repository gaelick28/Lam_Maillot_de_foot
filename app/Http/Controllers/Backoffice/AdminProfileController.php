<?php

namespace App\Http\Controllers\Backoffice;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use App\Models\User;
use App\Models\UserAddress;
use App\Helpers\CountryHelper;
use App\Http\Controllers\Controller;

class AdminProfileController extends Controller
{
    /**
     * Afficher la page de profil
     */
    public function edit()
    {
        $user = Auth::guard('web')->user();

        //  Récupérer l'adresse principale de l'admin depuis user_addresses
        $address = UserAddress::where('user_id', $user->id)
            ->where('is_default', true)
            ->first();

        return Inertia::render('AdminProfile', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                ]
            ],
            //  Envoyer l'adresse séparément
            'address' => $address ? [
                'id' => $address->id,
                'first_name' => $address->first_name,
                'last_name' => $address->last_name,
                'street' => $address->street,
                'postal_code' => $address->postal_code,
                'city' => $address->city,
                'country' => $address->country,
                'country_name' => CountryHelper::name($address->country),  // Nom du pays
            ] : null,
            //  Envoyer la liste des pays depuis CountryHelper
            'countries' => CountryHelper::forSelect(),
        ]);
    }

    /**
     * Mettre à jour le mot de passe
     */
    public function updatePassword(Request $request)
    {
        $user = User::find(Auth::guard('web')->id());

        $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', Password::min(6), 'confirmed'],
        ], [
            'current_password.required' => 'Le mot de passe actuel est requis.',
            'new_password.required' => 'Le nouveau mot de passe est requis.',
            'new_password.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
            'new_password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        // Vérifier que le mot de passe actuel est correct
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Le mot de passe actuel est incorrect.'
            ]);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->new_password);
$user->save();

        return back()->with('success', 'Mot de passe modifié avec succès !');
    }

    /**
     * Mettre à jour les informations personnelles
     */
    public function updateInfo(Request $request)
    {
        $user = User::find(Auth::guard('web')->id());

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            // Validation des champs d'adresse
            'address.first_name' => ['nullable', 'string', 'max:255'],
            'address.last_name' => ['nullable', 'string', 'max:255'],
            'address.street' => ['nullable', 'string', 'max:255'],
            'address.postal_code' => ['nullable', 'string', 'max:10'],
            'address.city' => ['nullable', 'string', 'max:255'],
            'address.country' => ['nullable', 'string', 'max:2'],
        ], [
            'username.required' => 'Le nom d\'utilisateur est requis.',
            'username.unique' => 'Ce nom d\'utilisateur est déjà utilisé.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'phone.max' => 'Le numéro de téléphone ne peut pas dépasser 20 caractères.',
            'address.country.max' => 'Le code pays doit être de 2 caractères (ex: FR).',
        ]);

        // Mettre à jour les infos utilisateur
       $user->username = $validated['username'];
$user->email = $validated['email'];
$user->phone = $validated['phone'];
$user->save();
        //  Gérer l'adresse dans user_addresses
        if (isset($validated['address']) && !empty(array_filter($validated['address']))) {
            // Récupérer ou créer l'adresse par défaut
            $address = UserAddress::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'is_default' => true,
                ],
                [
                    'first_name' => $validated['address']['first_name'] ?? $user->username,
                    'last_name' => $validated['address']['last_name'] ?? '',
                    'street' => $validated['address']['street'] ?? '',
                    'postal_code' => $validated['address']['postal_code'] ?? '',
                    'city' => $validated['address']['city'] ?? '',
                    'country' => $validated['address']['country'] ?? 'FR',
                ]
            );

            // Mettre à jour l'adresse
            $address->update([
                'first_name' => $validated['address']['first_name'] ?? $address->first_name,
                'last_name' => $validated['address']['last_name'] ?? $address->last_name,
                'street' => $validated['address']['street'] ?? $address->street,
                'postal_code' => $validated['address']['postal_code'] ?? $address->postal_code,
                'city' => $validated['address']['city'] ?? $address->city,
                'country' => $validated['address']['country'] ?? $address->country,
            ]);
        }

        return back()->with('success', 'Informations modifiées avec succès !');
    }
}