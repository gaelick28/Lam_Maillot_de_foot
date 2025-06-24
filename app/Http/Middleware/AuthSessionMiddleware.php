<?php

// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;
// use Symfony\Component\HttpFoundation\Response;

// class AuthSessionMiddleware
// {
//     /**
//      * Handle an incoming request.
//      *
//      * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
//      */
//     public function handle(Request $request, Closure $next): Response
//     {
//         return $next($request);
//     }
// }


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthSessionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sessionId = $request->cookie('session-id');

        if (!$sessionId) {
            return redirect()->route('Login');
        }

        $session = \App\Models\UserSession::with('user')
            ->where('id', $sessionId)
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return redirect()->route('Login')->withoutCookie('session-id');
        }

        // Mettre à jour l'activité de la session
        $session->updateActivity();

        // Ajouter l'utilisateur à la requête
        $request->merge(['auth_user' => $session->user]);

        return $next($request);
    }
}
