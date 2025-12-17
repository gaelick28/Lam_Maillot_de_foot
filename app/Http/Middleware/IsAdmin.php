<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // ← N'oubliez pas cet import !

class IsAdmin
{
    /**
     * Vérifier si l'utilisateur est admin
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est connecté
        if (!Auth::check()) {
            return redirect()->route('login.page')
                ->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        // Vérifier si l'utilisateur est admin
        if (Auth::user()->role !== 'admin') { // ← Ajoutez ->user()
            abort(403, 'Accès interdit. Cette section est réservée aux administrateurs.');
        }

        return $next($request);
    }
}