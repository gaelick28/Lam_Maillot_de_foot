<?php



use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/login', function () {
    return Inertia::render('LoginRegister');
})->name('Login');


Route::get('/auth', [AuthController::class, 'showAuthForm'])->name('auth.form');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


Route::middleware('auth.session')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::get('/compte', function () {
        return Inertia::render('Account');
    });
    
    Route::get('/order', function () {
        return Inertia::render('Order');
    });
    
    Route::get('/addresses', function () {
        return Inertia::render('Addresses');
    });
    
    Route::post('/addresses', function () {
        return Inertia::render('Addresses');
    });
    
    Route::put('/addresses', function () {
        return Inertia::render('Addresses');
    });
    
    Route::get('/accountdetails', function () {
        return Inertia::render('AccountDetails');
    });
    
    Route::get('/mywishlist', function () {
        return Inertia::render('MyWishlist');
    });
});

Route::fallback(function () {
    return Inertia::render('Page404');
});
