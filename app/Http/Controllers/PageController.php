<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home() {
        return Inertia::render('Home');
    }

    public function loginRegister() {
        return Inertia::render('LoginRegister');
    }

public function dashboard()
{
    return Inertia::render('Dashboard', [
        'user' => request()->user(), // corrected to use request()->user()
    ]);
}
    public function account() {
        return Inertia::render('Account');
    }

    
    public function order() {
        return Inertia::render('Order');
    }    
    // public function addresses() {
    //     return Inertia::render('Addresses', [
    //         'addresses' => request()->user()->addresses()->get(),
    //     ]);
    // }
    
    public function accountDetails() {
        return Inertia::render('AccountDetails');
    }

    public function wishlist() {
        return Inertia::render('MyWishlist');
    }

    public function page404() {
        return Inertia::render('Page404');
    }
}

