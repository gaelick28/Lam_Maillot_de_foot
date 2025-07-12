<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AccountDetailController;
use App\Http\Controllers\ClubController;


// Routes publiques
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/login', [PageController::class, 'loginRegister'])->name('login.page');

// Affiche le formulaire
Route::post('/login', [AuthController::class, 'login'])->name('login');

// inscription

Route::post('/register', [AuthController::class, 'register'])->name('register'); // Ajoutez cette ligne
Route::get('/register', [PageController::class, 'loginRegister'])->name('register.page'); // Affiche le formulaire d'inscription

// Déconnexion
// Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');

// Routes protégées
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('/compte', [PageController::class, 'account'])->name('account');
    Route::get('/order', [PageController::class, 'order'])->name('order');
 
    Route::get('/accountdetails', [PageController::class, 'accountDetails'])->name('account.details');
    Route::get('/mywishlist', [PageController::class, 'wishlist'])->name('wishlist');

});

Route::fallback([PageController::class, 'page404']);

// Routes pour la gestion des adresses
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');

    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Route::get('/account-details', [AccountDetailController::class, 'edit'])->name('account.edit');
    Route::put('/account-details', [AccountDetailController::class, 'update'])->name('account.update');


Route::get('/accountdetails', [AccountDetailController::class, 'edit'])->name('account.details');
Route::put('/account/personal-info', [AccountDetailController::class, 'updatePersonalInfo'])->name('account.update.info');
Route::put('/account/password', [AccountDetailController::class, 'updatePassword'])->name('account.update.password');
});

// Routes pour les clubs
Route::get('/clubs/{slug}/maillots', [ClubController::class, 'maillots'])->name('clubs.maillots');
        Route::get('/clubs/{slug}', [ClubController::class, 'show'])->name('clubs.show');