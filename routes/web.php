<?php

use App\Http\Controllers\Backoffice\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

Route::get('/', HomeController::class);

/**
 * Dashboard routes
 * You may protect these routes with auth middleware
 */
Route::prefix('backoffice')->group(function() {
    Route::get('/', DashboardController::class)->name('dashboard.index');
});
