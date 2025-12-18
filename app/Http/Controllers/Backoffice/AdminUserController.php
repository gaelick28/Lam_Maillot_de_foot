<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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

    return Inertia::render('AdminUsersShow', [
        'user' => $user,
        'ordersCount' => $user->orders()->count(),
        'totalSpent' => $user->orders()->sum('total_amount'),
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
}