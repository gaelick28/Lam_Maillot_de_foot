<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Afficher la page de contact
     */
    public function index()
    {
        return Inertia::render('Contact');
    }

    /**
     * Envoyer le message de contact
     */
    public function send(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ], [
            'name.required' => 'Le nom est requis.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'subject.required' => 'Le sujet est requis.',
            'message.required' => 'Le message est requis.',
            'message.max' => 'Le message ne peut pas dépasser 5000 caractères.',
        ]);

        // ✅ ENVOI D'EMAIL (NON-BLOQUANT)
        $this->sendContactEmail($validated);

        return back()->with('success', 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
    }

    /**
     * ✅ Envoi d'email de contact (non-bloquant)
     */
    private function sendContactEmail($contactData)
    {
        // Vérifier si l'envoi d'email est activé
        if (!env('MAIL_CONTACT_ENABLED', true)) {
            Log::info('Email de contact désactivé', ['data' => $contactData]);
            return;
        }

        try {
            // Email de destination (admin)
            $adminEmail = env('MAIL_CONTACT_TO', 'admin@fou2foot.com');

            // Envoyer l'email
            Mail::to($adminEmail)->send(new \App\Mail\ContactFormMail($contactData));

            Log::info('Email de contact envoyé avec succès', [
                'from' => $contactData['email'],
                'subject' => $contactData['subject'],
                'to' => $adminEmail,
            ]);

        } catch (\Exception $e) {
            // ⚠️ IMPORTANT : On log l'erreur mais on ne fait PAS échouer l'envoi
            Log::error('Erreur lors de l\'envoi de l\'email de contact : ' . $e->getMessage(), [
                'contact_data' => $contactData,
            ]);

            // Le message est QUAND MÊME considéré comme envoyé pour ne pas perturber l'utilisateur
        }
    }
}