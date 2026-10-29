<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsAdmin;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            HandleInertiaRequests::class,
            \App\Http\Middleware\RedirectIfAdmin::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Session expirée (419) : retour sur la page avec un jeton neuf + trace dans les logs
        $exceptions->respond(function (Response $response, \Throwable $e, Request $request) {
            if ($response->getStatusCode() === 419) {
                Log::warning('419 CSRF', [
                    'url'            => $request->path(),
                    'host'           => $request->getHost(),
                    'header_present' => $request->hasHeader('X-XSRF-TOKEN'),
                    'session_cookie' => $request->hasCookie(config('session.cookie')),
                ]);
                return back()->with('error', 'La page a expiré, veuillez réessayer.');
            }
            return $response;
        });
    })->create();