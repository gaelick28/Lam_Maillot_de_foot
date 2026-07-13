<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\CountryHelper;

class AdminUserController extends Controller
{
    /**
     * Afficher la liste des utilisateurs
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->withCount('orders') // Compte le nombre de commandes par user
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('AdminUsersIndex', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
            'auth' => [
                'user' => auth('web')->user()
            ]
        ]);
    }

    /**
     * Afficher les détails d'un utilisateur
     */
    public function show(User $user)
{
    $user->load([
        'orders' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        },
        'addresses' // ← AJOUTEZ cette ligne
    ]);

 // Formater les noms de pays pour toutes les adresses
    foreach ($user->addresses as $address) {
        $address->country_name = CountryHelper::name($address->country);
    }

    // Récupérer la liste des pays : si la méthode getCountries existe, l'utiliser,
    // sinon construire une liste à partir des adresses de l'utilisateur.
    if (method_exists(CountryHelper::class, 'getCountries')) {
        $countries = CountryHelper::getCountries();
    } else {
        $countries = collect($user->addresses)->mapWithKeys(function ($address) {
            return [$address->country => CountryHelper::name($address->country)];
        })->toArray();
    }

    return Inertia::render('AdminUsersShow', [
        'user' => $user,
        'ordersCount' => $user->orders()->count(),
        'totalSpent' => $user->orders()->sum('total_amount'),
        'countries' => $countries,
        'auth' => [
            'user' => auth('web')->user()
        ]
    ]);
}

    /**
     * Basculer le statut actif/inactif d'un utilisateur
     */
    public function toggleActive(User $user)
    {
        // Ne pas permettre de se bloquer soi-même
        if ($user->id === auth('web')->id()) {
            return back()->with('error', 'Vous ne pouvez pas bloquer votre propre compte !');
        }

        // Ne pas bloquer d'autres admins
        if ($user->role === 'admin') {
            return back()->with('error', 'Vous ne pouvez pas bloquer un autre administrateur !');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'activé' : 'bloqué';
        
        return back()->with('success', "Le compte de {$user->username} a été {$status} avec succès.");
    }

    /**
     * Changer le rôle d'un utilisateur (optionnel)
     */
    public function changeRole(User $user, Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,admin'
        ]);

        // Ne pas permettre de changer son propre rôle
        if ($user->id === auth('web')->id()) {
            return back()->with('error', 'Vous ne pouvez pas modifier votre propre rôle !');
        }

        $user->role = $validated['role'];
        $user->save();

        return back()->with('success', "Le rôle de {$user->username} a été modifié avec succès.");
    }
    
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255', 
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validatedData);

        return back()->with('success', 'Les informations de l\'utilisateur ont été mises à jour.');
    }

}