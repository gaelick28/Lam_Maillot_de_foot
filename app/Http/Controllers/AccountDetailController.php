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

    $billingAddress = $user->addresses()
    ->where('type', 'billing')
    ->where('is_default', true)
    ->first();


return Inertia::render('AccountDetails', [
    'user' => [
        'id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
        'birth_date' => $user->birth_date,
        'gender' => $user->gender,
        'first_name' => $user->first_name ?? $billingAddress->first_name ?? '',
        'last_name' => $user->last_name ?? $billingAddress->last_name ?? '',
        'phone' => $user->phone ?? $billingAddress->phone ?? '',
    ],
]);
}

    public function updatePersonalInfo(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'username'   => 'required|string|max:50|unique:users,username,' . $user->id,
        'first_name' => 'nullable|string|max:100',
        'last_name'  => 'nullable|string|max:100',
        'email'      => 'required|email|unique:users,email,' . $user->id,
        'phone'      => 'nullable|string|max:20',
        'birth_date' => 'nullable|date',
        'gender'     => 'nullable|in:male,female,other',
    ]);

    $user->update($validated);

    // 🔄 Synchroniser les données avec l'adresse de facturation
    $billingAddress = $user->addresses()->where('type', 'billing')->first();

    if ($billingAddress) {
        $billingAddress->update([
            'first_name' => $validated['first_name'] ?? $billingAddress->first_name,
            'last_name'  => $validated['last_name'] ?? $billingAddress->last_name,
            'phone'      => $validated['phone'] ?? $billingAddress->phone,
        ]);
    }

    return back()->with('success', 'Informations mises à jour avec succès.');
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
