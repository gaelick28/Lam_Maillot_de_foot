<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;


class AuthController extends Controller
{
   
    //  * Affiche la vue d'inscription
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

 
    //  * Affiche la vue de connexion
     public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

 
    //  * Inscription de l'utilisateur
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username'     => 'required|string|max:50|unique:users',
            'email'        => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)
                ->mixedCase()    // majuscule + minuscule
                ->numbers()      // au moins un chiffre
                ->symbols()      // au moins un caractère spécial
            ],
            'first_name'   => 'nullable|string|max:100',
            'last_name'    => 'nullable|string|max:100',
            'phone'        => 'nullable|string|max:20',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female,other',
        ]);

        $user = User::create([
            'username'   => $validated['username'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'first_name' => $validated['first_name'] ?? null,
            'last_name'  => $validated['last_name'] ?? null,
            'phone'      => $validated['phone'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender'     => $validated['gender'] ?? null,
            'is_active'  => true,
        ]);

        Auth::login($user);

        // 🔥 SYNCHRONISER LA WISHLIST APRÈS INSCRIPTION
        Log::info('📝 Registration - Données reçues:', [
            'user_id' => Auth::id(),
            'has_wishlist_ids' => $request->has('wishlist_ids'),
            'wishlist_ids' => $request->input('wishlist_ids', []),
        ]);

        if ($request->has('wishlist_ids')) {
            $wishlistIds = $request->input('wishlist_ids', []);
            
            Log::info('📤 Synchronisation wishlist après inscription:', [
                'user_id' => Auth::id(),
                'wishlist_ids' => $wishlistIds,
                'count' => count($wishlistIds)
            ]);
            
            $syncedCount = 0;
            foreach ($wishlistIds as $maillotId) {
                try {
                    $wishlist = Wishlist::firstOrCreate([
                        'user_id' => Auth::id(),
                        'maillot_id' => $maillotId,
                    ]);
                    
                    if ($wishlist->wasRecentlyCreated) {
                        $syncedCount++;
                    }
                    
                    Log::info('✅ Maillot ajouté:', [
                        'maillot_id' => $maillotId,
                        'was_new' => $wishlist->wasRecentlyCreated
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ Erreur ajout maillot:', [
                        'maillot_id' => $maillotId,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            
            Log::info('🎉 Synchronisation terminée après inscription:', [
                'user_id' => Auth::id(),
                'synced_count' => $syncedCount,
                'total' => count($wishlistIds)
            ]);
        } else {
            Log::warning('⚠️ Pas de wishlist_ids dans la requête d\'inscription');
        }

        return redirect()->route('dashboard')->with('success', 'Inscription réussie');
    }

   
    //  Connexion
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required|string',
           'password' => ['required', 'string'],
        ]);

        $loginField = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Vérifie la case "remember"
        $remember = $request->boolean('remember');

        if (Auth::attempt(
                [$loginField => $credentials['login'], 'password' => $credentials['password'], 'is_active' => true],
                $remember
            )) {
            $request->session()->regenerate();

            // 🔥 DEBUG + Synchroniser la wishlist du localStorage
            Log::info('🔑 Login - Données reçues:', [
                'user_id' => Auth::id(),
                'has_wishlist_ids' => $request->has('wishlist_ids'),
                'wishlist_ids' => $request->input('wishlist_ids', []),
                'all_request' => $request->all()
            ]);

            if ($request->has('wishlist_ids')) {
                $wishlistIds = $request->input('wishlist_ids', []);
                
                Log::info('📤 Tentative synchronisation wishlist:', [
                    'user_id' => Auth::id(),
                    'wishlist_ids' => $wishlistIds,
                    'count' => count($wishlistIds)
                ]);
                
                $syncedCount = 0;
                foreach ($wishlistIds as $maillotId) {
                    try {
                        $wishlist = Wishlist::firstOrCreate([
                            'user_id' => Auth::id(),
                            'maillot_id' => $maillotId,
                        ]);
                        
                        if ($wishlist->wasRecentlyCreated) {
                            $syncedCount++;
                        }
                        
                        Log::info('✅ Maillot ajouté:', [
                            'maillot_id' => $maillotId,
                            'was_new' => $wishlist->wasRecentlyCreated
                        ]);
                    } catch (\Exception $e) {
                        Log::error('❌ Erreur ajout maillot:', [
                            'maillot_id' => $maillotId,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
                
                Log::info('🎉 Synchronisation terminée:', [
                    'user_id' => Auth::id(),
                    'synced_count' => $syncedCount,
                    'total' => count($wishlistIds)
                ]);
            } else {
                Log::warning('⚠️ Pas de wishlist_ids dans la requête');
            }

            return redirect()->route('dashboard')->with('success', 'Connexion réussie');
        }

        throw ValidationException::withMessages([
            'login' => ['Identifiants incorrects ou compte inactif.'],
        ]);
    }

    //  * Déconnexion
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Déconnexion réussie');
    }
    

    //  * Mot de passe oublié
    public function forgotPassword(Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();

        $newPass = Str::random(10);
        $user->password = Hash::make($newPass);
        $user->save();

        // Envoi mail basique
        Mail::raw("Votre nouveau mot de passe est : $newPass", function($message) use ($user) {
            $message->to($user->email)
                    ->subject("Votre nouveau mot de passe");
        });
     
        return back()->with('success', "Un nouveau mot de passe a été envoyé à votre email.");
    }
}