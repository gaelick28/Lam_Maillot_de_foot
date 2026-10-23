<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

                ResetPassword::toMailUsing(function ($notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('Réinitialisation de votre mot de passe Fou2Foot')
                ->greeting('Bonjour,')
                ->line('Vous avez demandé à réinitialiser le mot de passe de votre compte Fou2Foot.')
                ->action('Choisir un nouveau mot de passe', $url)
                ->line('Ce lien est valable 60 minutes.')
                ->line("Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe reste inchangé.")
                ->salutation("L'équipe Fou2Foot");
        });
    }
}
