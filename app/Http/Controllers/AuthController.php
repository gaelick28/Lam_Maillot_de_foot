<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Password as PasswordBroker;


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

        if ($request->has('wishlist_ids')) {
            $wishlistIds = $request->input('wishlist_ids', []);

            foreach ($wishlistIds as $maillotId) {
                try {
                    $wishlist = Wishlist::firstOrCreate([
                        'user_id' => Auth::id(),
                        'maillot_id' => $maillotId,
                    ]);
                                      
                } catch (\Exception $e) {
                   
                }
            }
        
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

            if ($request->has('wishlist_ids')) {
                $wishlistIds = $request->input('wishlist_ids', []);               
              
                foreach ($wishlistIds as $maillotId) {
                    try {
                        $wishlist = Wishlist::firstOrCreate([
                            'user_id' => Auth::id(),
                            'maillot_id' => $maillotId,
                        ]);
                        
                    } catch (\Exception $e) {
                    }
                }
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
    

        //  * Mot de passe oublié : envoi d'un lien de réinitialisation
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        PasswordBroker::sendResetLink($request->only('email'));

        // Même réponse que l'email existe ou non (anti-énumération)
        return back()->with('success', "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.");
    }

    //  * Affiche le formulaire de nouveau mot de passe
    public function showResetForm(Request $request, string $token)
    {
        return Inertia::render('ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    //  * Enregistre le nouveau mot de passe
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()
            ],
        ]);

        $status = PasswordBroker::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60), // invalide les "se souvenir de moi"
                ])->save();
            }
        );

        if ($status !== PasswordBroker::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => 'Ce lien est invalide ou a expiré. Faites une nouvelle demande.',
            ]);
        }

        return redirect()->route('login.page')->with('success', 'Mot de passe modifié.');
    }
}