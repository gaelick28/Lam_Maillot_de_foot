<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthService
{
    public function register(array $data)
    {
        // Validation
        $validator = Validator::make($data, [
            'username' => 'required|string|min:3|max:50|unique:users|regex:/^[a-zA-Z0-9_]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/',
            'password_confirmation' => 'required|same:password',
        ], [
            'username.regex' => 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores',
            'password.regex' => 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->errors(),
                'field' => $validator->errors()->keys()[0] ?? null,
            ];
        }

        try {
            // Créer l'utilisateur
            $user = User::create([
                'username' => $data['username'],
                'email' => strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'phone' => $data['phone'] ?? null,
            ]);

            // Créer une session
            $sessionId = $this->createSession($user->id, $data['remember'] ?? false);

            return [
                'success' => true,
                'user' => $user,
                'session_id' => $sessionId,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'Une erreur est survenue lors de l\'inscription',
            ];
        }
    }

    public function login(array $data)
    {
        // Validation
        $validator = Validator::make($data, [
            'login' => 'required|string|min:3',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->errors(),
                'field' => $validator->errors()->keys()[0] ?? null,
            ];
        }

        try {
            // Rechercher l'utilisateur
            $user = User::active()
                ->where(function ($query) use ($data) {
                    $query->where('email', strtolower($data['login']))
                          ->orWhere('username', strtolower($data['login']));
                })
                ->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                return [
                    'success' => false,
                    'error' => 'Identifiants incorrects',
                    'field' => 'login',
                ];
            }

            // Créer une session
            $sessionId = $this->createSession($user->id, $data['remember'] ?? false);

            // Nettoyer les sessions expirées
            $this->cleanupExpiredSessions();

            return [
                'success' => true,
                'user' => $user,
                'session_id' => $sessionId,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'Une erreur est survenue lors de la connexion',
            ];
        }
    }

    public function createSession(int $userId, bool $remember = false, ?string $ipAddress = null, ?string $userAgent = null)
    {
        $sessionId = Str::random(64);
        $expiresAt = now()->addDays($remember ? 7 : 1);

        UserSession::create([
            'id' => $sessionId,
            'user_id' => $userId,
            'expires_at' => $expiresAt,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'last_activity' => now(),
        ]);

        return $sessionId;
    }

    public function getSession(string $sessionId): ?UserSession
    {
        $session = UserSession::with('user')
            ->active()
            ->find($sessionId);

        if ($session) {
            $session->updateActivity();
        }

        return $session;
    }

    public function deleteSession(string $sessionId): void
    {
        UserSession::where('id', $sessionId)->delete();
    }

    public function cleanupExpiredSessions(): void
    {
        UserSession::where('expires_at', '<', now())->delete();
    }

    public function logout(string $sessionId): void
    {
        $this->deleteSession($sessionId);
    }
}
