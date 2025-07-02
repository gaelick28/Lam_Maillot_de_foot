<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        return Inertia::render('Order', [
        'user' => request()->user(),]);
    }    
   

   public function addresses()
{
    return Inertia::render('Addresses', [
        'user' => request()->user(), // corrected to use request()->user()
    ]);
}
   
   
    // public function addresses() {
    //     return Inertia::render('Addresses', [
    //         'user' => request()->user()->addresses()->get(),
    //     ]);
    // }

    // public function addresses() {
//     $addresses = request()->user() ? request()->user()->addresses()->get() : [];
//     return Inertia::render('Addresses', [
//         'addresses' => $addresses,
//         'user' => request()->user() // Nécessaire pour que {user} soit disponible
//     ]);
// }

//  public function accountDetails() {
//         return Inertia::render('AccountDetails');
//     }

    public function accountDetails() {
       return Inertia::render('AccountDetails', [
        // Ajoutez cette ligne pour passer explicitement l'utilisateur
        'user' => Auth::user() ? collect(Auth::user())->only(['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'birth_date', 'gender']) : null
       ]);
    }

    public function wishlist() {
        return Inertia::render('MyWishlist', [
        'user' => request()->user(),]);
    }

    public function page404() {
        return Inertia::render('Page404');
    }
}

