<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

// -------------------------------------------------------
// 1. Page login accessible sans être connecté
// -------------------------------------------------------
it('affiche la page login', function () {
    $response = $this->get('/login');
    $response->assertStatus(200);
});

// -------------------------------------------------------
// 2. Login avec mauvais identifiants → erreur de validation
// -------------------------------------------------------
it('refuse la connexion avec de mauvais identifiants', function () {
    $response = $this->post('/login', [
        'email'    => 'inconnu@test.com',
        'password' => 'mauvais_mot_de_passe',
    ]);
    $response->assertSessionHasErrors();
});

// -------------------------------------------------------
// 3. Panier accessible sans être connecté
// -------------------------------------------------------
it('affiche le panier sans être connecté', function () {
    $response = $this->get('/panier');
    $response->assertStatus(200);
});

// -------------------------------------------------------
// 4. Checkout redirige vers login si non connecté
// -------------------------------------------------------
it('redirige vers login si on accède au checkout sans être connecté', function () {
    $response = $this->get('/checkout');
    $response->assertRedirect('/login');
});

// -------------------------------------------------------
// 5. Rate limiting sur la route login (max 5 tentatives/min)
// -------------------------------------------------------
it('bloque la connexion après trop de tentatives (rate limiting)', function () {
    // 5 tentatives échouées
    foreach (range(1, 5) as $i) {
        $this->post('/login', [
            'email'    => 'bot@test.com',
            'password' => 'mauvais_' . $i,
        ]);
    }

    // La 6ème doit être bloquée par le throttle
    $response = $this->post('/login', [
        'email'    => 'bot@test.com',
        'password' => 'mauvais_6',
    ]);

    $response->assertStatus(429);
});