<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class AdminProfileController extends Controller
{
    /**
     * Afficher la page de profil admin
     */
    public function edit()
    {
        return Inertia::render('AdminProfile', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Mettre à jour le mot de passe de l'admin
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', Password::min(6), 'confirmed'],

            // Ou  plus strict
// 'new_password' => ['required', 'string', Password::min(12)->letters()->numbers()->symbols()],
        ], [
            'current_password.required' => 'Le mot de passe actuel est requis.',
            'new_password.required' => 'Le nouveau mot de passe est requis.',
            'new_password.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
            'new_password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        $user = User::find(Auth::id());

        // Vérifier que le mot de passe actuel est correct
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Le mot de passe actuel est incorrect.'
            ]);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return back()->with('success', 'Mot de passe mis à jour avec succès !');
    }

    /**
     * Mettre à jour les informations personnelles de l'admin
     */
    public function updateInfo(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . Auth::id()],
            'phone' => ['nullable', 'string', 'max:20'],
        ], [
            'username.required' => 'Le nom d\'utilisateur est requis.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
        ]);

        $user = User::find(Auth::id());
        
        $user->update([
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return back()->with('success', 'Informations mises à jour avec succès !');
    }
}