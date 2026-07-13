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
use App\Http\Controllers\Backoffice\AdminProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Backoffice\AdminImportMaillotController;

// ─── Routes publiques ────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, '__invoke'])->name('home');
Route::get('/login', [PageController::class, 'loginRegister'])->name('login.page');
Route::get('/register', [PageController::class, 'loginRegister'])->name('register.page');

// Pages légales & statiques (contrôleurs dédiés)
Route::get('/legal',    [LegalController::class, 'index'])->name('legal');
Route::get('/contact',  [ContactController::class, 'index'])->name('contact');
Route::get('/privacy',  fn() => Inertia::render('Privacy'))->name('privacy');
Route::get('/terms',    fn() => Inertia::render('Terms'))->name('terms');
Route::get('/delivery', fn() => Inertia::render('Delivery'))->name('delivery');
Route::get('/returns',  fn() => Inertia::render('Returns'))->name('returns');

// Contact (envoi)
Route::post('/contact/send', [ContactController::class, 'send'])
    ->middleware('throttle:3,1')
    ->name('contact.send');

// Auth
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('login');
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:10,1')
    ->name('register');
Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->middleware('throttle:5,1')
    ->name('forgotPassword');

// ─── Recherche ───────────────────────────────────────────────────────────────
Route::get('/search/autocomplete', [SearchController::class, 'autocomplete'])->name('search.autocomplete');
Route::get('/search',              [SearchController::class, 'search'])->name('search.results');
Route::get('/club-slug',           [SearchController::class, 'getClubSlug'])->name('club.slug');

// ─── Wishlist (publique) ──────────────────────────────────────────────────────
Route::prefix('api/wishlist')->group(function () {
    Route::get('/ids',                  [WishlistController::class, 'getIds'])->name('wishlist.ids');
    Route::post('/add',                 [WishlistController::class, 'add'])->name('wishlist.add');
    Route::delete('/remove/{maillotId}',[WishlistController::class, 'remove'])->name('wishlist.remove');
    Route::post('/sync',                [WishlistController::class, 'sync'])->name('wishlist.sync');
});

// ─── Clubs & Maillots ────────────────────────────────────────────────────────
Route::get('/clubs/{slug}/maillots', [ClubController::class, 'maillots'])->name('clubs.maillots');
Route::get('/clubs/{slug}',          [ClubController::class, 'show'])->name('clubs.show');
Route::get('/maillots/{id}',         [MaillotController::class, 'show'])->name('maillots.show'); // ✅ ClubController::maillotDetail supprimé

// ─── Catégories ──────────────────────────────────────────────────────────────
Route::get('/category/{categorySlug}', [CategoryController::class, 'show'])
    ->name('category.show')
    ->where('categorySlug', 'selections-nationales|ligue-1|premier-league|bundesliga|liga|serie-a|autres-clubs');

Route::get('/selections-nationales', [CategoryController::class, 'selectionsNationales'])->name('category.selections');
Route::get('/ligue-1',               [CategoryController::class, 'ligue1'])->name('category.ligue1');
Route::get('/premier-league',        [CategoryController::class, 'premierLeague'])->name('category.premier-league');
Route::get('/bundesliga',            [CategoryController::class, 'bundesliga'])->name('category.bundesliga');
Route::get('/liga',                  [CategoryController::class, 'liga'])->name('category.liga');
Route::get('/serie-a',               [CategoryController::class, 'serieA'])->name('category.serie-a');
Route::get('/autres-clubs',          [CategoryController::class, 'autresClubs'])->name('category.autres');

// ─── Panier ──────────────────────────────────────────────────────────────────
Route::get('/panier',              [CartController::class, 'show'])->name('cart.show');
// Route::post('/cart/add',           [CartController::class, 'add']); // compatibilité frontend MaillotDetail.jsx
Route::post('/panier/add',         [CartController::class, 'add'])->name('cart.add');
Route::get('/panier/count',        [CartController::class, 'getCount'])->name('cart.count');
Route::post('/panier/clear',       [CartController::class, 'clear'])->name('cart.clear');
Route::post('/panier/checkout',    [CartController::class, 'checkout'])->name('cart.checkout');
Route::put('/panier/item/{item}',  [CartController::class, 'update'])->name('cart.update');
Route::delete('/panier/item/{item}',[CartController::class, 'remove'])->name('cart.remove'); // ✅ un seul nom

// ─── Routes protégées (auth) ──────────────────────────────────────────────────
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard',   [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('/compte',      [PageController::class, 'account'])->name('account');
    Route::get('/order',       [OrderController::class, 'history'])->name('order');
    Route::get('/mywishlist',  [WishlistController::class, 'index'])->name('wishlist.index');
    Route::delete('/wishlist/clear', [WishlistController::class, 'clear'])->name('wishlist.clear');

    // Adresses
    Route::get('/addresses',                              [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses',                             [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}',                    [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}',                 [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/addresses/copy-billing-to-shipping',    [AddressController::class, 'copyBillingToShipping'])->name('addresses.copyBillingToShipping');

    // Compte utilisateur
    Route::get('/accountdetails',         [AccountDetailController::class, 'edit'])->name('account.details'); // ✅ un seul
    Route::put('/account-details',        [AccountDetailController::class, 'update'])->name('account.update');
    Route::put('/account/personal-info',  [AccountDetailController::class, 'updatePersonalInfo'])->name('account.update.info');
    Route::put('/account/password',       [AccountDetailController::class, 'updatePassword'])->name('account.update.password');

    // Checkout & Paiement
    Route::get('/checkout',                    [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/proceed',           [CheckoutController::class, 'proceedToPayment'])->name('checkout.proceed');
    Route::get('/payment',                     [PaymentController::class, 'index'])->name('payment.index');
    Route::post('/payment/process',            [PaymentController::class, 'process'])
        ->middleware('throttle:10,1')
        ->name('payment.process');

    // Commandes
    Route::get('/order-confirmation/{orderId}', [OrderController::class, 'confirmation'])->name('order.confirmation');
    Route::get('/orders',                       [OrderController::class, 'history'])->name('orders.index');
    Route::get('/orders/{orderId}',             [OrderController::class, 'show'])->name('orders.show');
});

// ─── Backoffice Admin ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',   [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/statistics',  [DashboardController::class, 'statistics'])->name('statistics');

    Route::get('/users',                   [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}',            [AdminUserController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/toggle',    [AdminUserController::class, 'toggleActive'])->name('users.toggle');
    Route::put('/users/{user}',            [AdminUserController::class, 'update'])->name('users.update');

    Route::get('/orders',                  [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}',          [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/status',  [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::put('/orders/{order}/items', [AdminOrderController::class, 'updateItem'])->name('orders.item.update');

    Route::get('/clubs',                   [AdminClubController::class, 'index'])->name('clubs.index');
    Route::post('/clubs',                  [AdminClubController::class, 'store'])->name('clubs.store');
    Route::put('/clubs/{club}',            [AdminClubController::class, 'update'])->name('clubs.update');
    Route::delete('/clubs/{club}',         [AdminClubController::class, 'destroy'])->name('clubs.destroy');

    Route::get('/maillots',                [AdminMaillotController::class, 'index'])->name('maillots.index');
    Route::post('/maillots',               [AdminMaillotController::class, 'store'])->name('maillots.store');
    Route::put('/maillots/{maillot}',      [AdminMaillotController::class, 'update'])->name('maillots.update');
    Route::delete('/maillots/{maillot}',   [AdminMaillotController::class, 'destroy'])->name('maillots.destroy');

    Route::get('/profile',                 [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/password',        [AdminProfileController::class, 'updatePassword'])->name('profile.password');
    Route::put('/profile/info',            [AdminProfileController::class, 'updateInfo'])->name('profile.info');

    Route::get('/import-maillots',  [AdminImportMaillotController::class, 'index'])->name('import-maillots.index');
    Route::post('/import-maillots', [AdminImportMaillotController::class, 'import'])->name('import-maillots.store');
});

// ─── Sitemap ──────────────────────────────────────────────────────────────────
Route::get('/sitemap.xml', function () {
    return response(file_get_contents(public_path('sitemap.xml')), 200)
        ->header('Content-Type', 'application/xml');
});

// ─── Fallback ─────────────────────────────────────────────────────────────────
Route::fallback([PageController::class, 'page404']);

