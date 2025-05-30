<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::get('/', function () {
    return Inertia::render('Home');
});

Route::fallback(function () {
    return Inertia::render('Page404');
});


Route::get('/compte', function () {
    return Inertia::render('Account');
});

Route::get('/connexion', function () {
    return Inertia::render('Auth/LoginRegister');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');  
});


Route::get('/order', function () {
    return Inertia::render('Order');  
});


Route::post('/addresses', function () {
    return Inertia::render('Addresses');  
});
// Route::resource('addresses', AddressController::class)
//    ->only(['index', 'store', 'update', 'destroy']);



// Route::get('/inscription', function () {
//     return Inertia::render('Auth/LoginRegister');
// })->name('register');
// Route::get('/mot-de-passe-oublie', function () {
//     return Inertia::render('Auth/ForgotPassword');
// })->name('password.request');
// Route::get('/mot-de-passe-reinitialiser', function () {
//     return Inertia::render('Auth/ResetPassword');
// })->name('password.reset');
// Route::get('/confirmation', function () {
//     return Inertia::render('Auth/ConfirmEmail');
// })->name('verification.notice');
// Route::get('/confirmation/{id}/{hash}', function ($id, $hash) {
//     return Inertia::render('Auth/ConfirmEmail');
// })->name('verification.verify');
// Route::get('/confirmation/renvoyer', function () {
//     return Inertia::render('Auth/ConfirmEmail');
// })->name('verification.resend');