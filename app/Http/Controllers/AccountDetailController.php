<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserAddress;

class AccountDetailController extends Controller
{
    public function edit()
{
    $user = \App\Models\User::with(['addresses' => function ($query) {
        $query->where('type', 'billing')->where('is_default', true);
    }])->find(Auth::id());

    // Récupérer l’adresse de facturation si elle existe
    $defaultAddress = $user->addresses->first();

    // Fusionner les données utilisateur + adresse
    $userData = [
        'id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
        'birth_date' => $user->birth_date,
        'gender' => $user->gender,
        'first_name' => $defaultAddress->first_name ?? '',
        'last_name' => $defaultAddress->last_name ?? '',
        'phone' => $defaultAddress->phone ?? '',
    ];

    return Inertia::render('AccountDetails', [
        'user' => $userData,
    ]);
}

    public function updatePersonalInfo(Request $request)
    {
        $user = User::find(Auth::id());

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
        ]);

        foreach ($validated as $key => $value) {
            $user->$key = $value;
        }
        $user->save();

        return redirect()->back()->with('success', 'Informations mises à jour.');
    }

    public function updatePassword(Request $request)
    {
        $user = User::find(Auth::id());

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est incorrect.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Mot de passe mis à jour avec succès.');
    }
}
