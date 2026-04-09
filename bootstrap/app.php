<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsAdmin;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

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

        $middleware->validateCsrfTokens(except: [
            'login',
            'logout',
            'register',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();