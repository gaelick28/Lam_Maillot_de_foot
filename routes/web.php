<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AccountDetailController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\MaillotController;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Backoffice\DashboardController;
use App\Http\Controllers\Backoffice\AdminUserController;
use App\Http\Controllers\Backoffice\AdminOrderController;
use App\Http\Controllers\Backoffice\AdminClubController;
use App\Http\Controllers\Backoffice\AdminMaillotController;

// Routes publiques
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/login', [PageController::class, 'loginRegister'])->name('login.page');


// Pages légales
Route::get('/legal', function () {
    return Inertia::render('Legal');
})->name('legal');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/delivery', function () {
    return Inertia::render('Delivery');
})->name('delivery');

Route::get('/returns', function () {
    return Inertia::render('Returns');
})->name('returns');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');



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

//mot de passe oublié
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('forgotPassword');


// Routes de recherche
Route::get('/search/autocomplete', [SearchController::class, 'autocomplete'])
    ->name('search.autocomplete');

Route::get('/search', [SearchController::class, 'search'])
    ->name('search.results');

// Garder la compatibilité avec l'ancienne route
Route::get('/club-slug', [SearchController::class, 'getClubSlug'])
    ->name('club.slug');


    // 🔥 Routes API pour la wishlist - HORS DU MIDDLEWARE AUTH
// Ces routes doivent être accessibles même sans connexion
Route::prefix('api/wishlist')->group(function () {
    Route::get('/ids', [WishlistController::class, 'getIds'])->name('wishlist.ids');
    Route::post('/add', [WishlistController::class, 'add'])->name('wishlist.add');
    Route::delete('/remove/{maillotId}', [WishlistController::class, 'remove'])->name('wishlist.remove');
    Route::post('/sync', [WishlistController::class, 'sync'])->name('wishlist.sync');
});


// Routes protégées
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('/compte', [PageController::class, 'account'])->name('account');
   Route::get('/order', [OrderController::class, 'history'])->name('order');
    Route::get('/accountdetails', [PageController::class, 'accountDetails'])->name('account.details');
   
    // 🔥 Route wishlist - UTILISE WishlistController au lieu de PageController
    Route::get('/mywishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::delete('/wishlist/clear', [WishlistController::class, 'clear'])->name('wishlist.clear');
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
        Route::get('/maillots/{id}', [ClubController::class, 'maillotDetail'])->name('maillot.detail');
       Route::get('/club-slug', [ClubController::class, 'findSlugByName']);



// Routes pour les maillots
Route::get('/maillots/{id}', [MaillotController::class, 'show'])->name('maillots.show');


// Routes pour toutes les catégories (utilise la méthode générique)
Route::get('/category/{categorySlug}', [CategoryController::class, 'show'])
    ->name('category.show')
    ->where('categorySlug', 'selections-nationales|ligue-1|premier-league|bundesliga|liga|serie-a|autres-clubs');

// Routes spécifiques (optionnel, pour des URLs plus jolies)
Route::get('/selections-nationales', [CategoryController::class, 'selectionsNationales'])
    ->name('category.selections');
Route::get('/ligue-1', [CategoryController::class, 'ligue1'])
    ->name('category.ligue1');
Route::get('/premier-league', [CategoryController::class, 'premierLeague'])
    ->name('category.premier-league');
Route::get('/bundesliga', [CategoryController::class, 'bundesliga'])
    ->name('category.bundesliga');
Route::get('/liga', [CategoryController::class, 'liga'])
    ->name('category.liga');
Route::get('/serie-a', [CategoryController::class, 'serieA'])
    ->name('category.serie-a');
Route::get('/autres-clubs', [CategoryController::class, 'autresClubs'])
    ->name('category.autres');

    
        
    Route::get('/panier', [CartController::class, 'show'])->name('cart.show');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/panier/add', [CartController::class, 'add'])->name('cart.add');
    Route::get('/panier/count', [CartController::class, 'getCount'])->name('cart.count');
    Route::post('/panier/remove/{item}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/panier/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/panier/checkout', [CartController::class, 'checkout'])->name('cart.checkout'); 
    Route::put('/panier/item/{item}', [CartController::class, 'update'])->name('cart.update');   
    Route::delete('/panier/item/{item}', [CartController::class, 'remove'])->name('cart.remove');


//     //pages checkout  ancienne version avant paiement 
// Route::middleware(['auth'])->group(function () {
//     Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
//     Route::post('/checkout/confirm', [CheckoutController::class, 'confirm'])->name('checkout.confirm');

// Routes Checkout (existantes - à vérifier)
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/proceed', [CheckoutController::class, 'proceedToPayment'])->name('checkout.proceed'); // 🔥 NOUVELLE
    
    // Routes Payment
    Route::get('/payment', [PaymentController::class, 'index'])->name('payment.index'); // 🔥 NOUVELLE
    Route::post('/payment/process', [PaymentController::class, 'process'])->name('payment.process'); // 🔥 NOUVELLE
    
    // Routes Order
    Route::get('/order-confirmation/{orderId}', [OrderController::class, 'confirmation'])->name('order.confirmation'); // 🔥 NOUVELLE
    Route::get('/orders', [OrderController::class, 'history'])->name('orders.index'); // 🔥 NOUVELLE (historique)
    Route::get('/orders/{orderId}', [OrderController::class, 'show'])->name('orders.show'); // 🔥 NOUVELLE (détails)

});


//  ROUTES ADMIN - Backoffice
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard admin
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Routes users
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/toggle', [AdminUserController::class, 'toggleActive'])->name('users.toggle');
    
    // 📦 ROUTES ORDERS 
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');

    // 📦 ROUTES CLUBS
    Route::get('/clubs', [AdminClubController::class, 'index'])->name('clubs.index');
    Route::post('/clubs', [AdminClubController::class, 'store'])->name('clubs.store');
    Route::put('/clubs/{club}', [AdminClubController::class, 'update'])->name('clubs.update');
    Route::delete('/clubs/{club}', [AdminClubController::class, 'destroy'])->name('clubs.destroy');

    // 👕 ROUTES MAILLOTS
    Route::get('/maillots', [AdminMaillotController::class, 'index'])->name('maillots.index');
    Route::post('/maillots', [AdminMaillotController::class, 'store'])->name('maillots.store');
    Route::put('/maillots/{maillot}', [AdminMaillotController::class, 'update'])->name('maillots.update');
    Route::delete('/maillots/{maillot}', [AdminMaillotController::class, 'destroy'])->name('maillots.destroy');

});





