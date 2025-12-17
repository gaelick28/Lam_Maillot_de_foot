<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RedirectIfAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Si l'utilisateur est admin et tente d'accéder au dashboard user
        if (Auth::check() && Auth::user()->role === 'admin' && $request->is('dashboard')) {
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}