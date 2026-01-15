<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormMail;
use App\Models\User;
use App\Models\UserAddress;
use App\Helpers\CountryHelper;

class ContactController extends Controller
{
    /**
     * Afficher la page de contact avec les infos de l'admin
     */
    public function index()
    {
        // Récupérer l'admin (premier utilisateur avec role 'admin')
        $admin = User::where('role', 'admin')->first();
        
        $contactInfo = [
            'email' => $admin ? $admin->email : 'contact@fou2foot.com',
            'phone' => $admin ? $admin->phone : null,
        ];
        
        // Récupérer l'adresse de l'admin si elle existe
        if ($admin) {
            $address = UserAddress::where('user_id', $admin->id)
                ->where('is_default', true)
                ->first();
            
            if ($address) {
                $contactInfo['address'] = [
                    'street' => $address->street,
                    'postal_code' => $address->postal_code,
                    'city' => $address->city,
                    'country' => CountryHelper::name($address->country),
                ];
            }
        }
        
        return Inertia::render('Contact', [
            'contactInfo' => $contactInfo,
        ]);
    }

    /**
     * Envoyer l'email de contact
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Récupérer l'email de l'admin
        $admin = User::where('role', 'admin')->first();
        $adminEmail = $admin ? $admin->email : env('MAIL_CONTACT_TO', 'admin@fou2foot.com');

        // Variable pour désactiver l'envoi d'email en cas de problème
        $mailEnabled = env('MAIL_CONTACT_ENABLED', true);

        if ($mailEnabled) {
            try {
                Mail::to($adminEmail)->send(new ContactFormMail($validated));
                Log::info('Email de contact envoyé avec succès', [
                    'to' => $adminEmail,
                    'from' => $validated['email']
                ]);
            } catch (\Exception $e) {
                Log::error('Échec envoi email de contact', [
                    'error' => $e->getMessage(),
                    'to' => $adminEmail,
                    'from' => $validated['email']
                ]);
                // On continue quand même pour ne pas frustrer l'utilisateur
            }
        }

        return back()->with('success', 'Message envoyé avec succès !');
    }
}