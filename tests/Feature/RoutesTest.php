<?php

use App\Models\User;

// Nettoyage après chaque test qui crée un user
afterEach(function () {
    User::where('email', 'like', '%@example%')
        ->orWhere('email', 'like', '%@faker%')
        ->delete();
});

// -------------------------------------------------------
// 1. Page login accessible sans être connecté
// -------------------------------------------------------
it('affiche la page login', function () {
    $this->get('/login')->assertStatus(200);
});

// -------------------------------------------------------
// 2. Login avec mauvais identifiants → erreur de validation
// -------------------------------------------------------
it('refuse la connexion avec de mauvais identifiants', function () {
    $this->post('/login', [
        'email'    => 'inconnu@test.com',
        'password' => 'mauvais_mot_de_passe',
    ])->assertSessionHasErrors();
});

// -------------------------------------------------------
// 3. Login avec bons identifiants → succès
// -------------------------------------------------------
it('accepte la connexion avec de bons identifiants', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password123'),
    ]);

    $this->post('/login', [
        'login'    => $user->email,  // ← 'login' au lieu de 'email'
        'password' => 'password123',
    ])->assertRedirect();

    $this->assertAuthenticated();
});

// -------------------------------------------------------
// 4. Panier accessible sans être connecté
// -------------------------------------------------------
it('affiche le panier sans être connecté', function () {
    $this->get('/panier')->assertStatus(200);
});

// -------------------------------------------------------
// 5. Checkout redirige vers login si non connecté
// -------------------------------------------------------
it('redirige vers login si on accède au checkout sans être connecté', function () {
    $this->get('/checkout')->assertRedirect('/login');
});

// -------------------------------------------------------
// 6. Compte redirige vers login si non connecté
// -------------------------------------------------------
it('redirige vers login si on accède au compte sans être connecté', function () {
    $this->get('/compte')->assertRedirect('/login');
});

// -------------------------------------------------------
// 7. User connecté peut accéder à son compte
// -------------------------------------------------------
it('un user connecté peut accéder à son compte', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/compte')
        ->assertStatus(200);
});

// -------------------------------------------------------
// 8. Admin dashboard inaccessible sans rôle admin
// -------------------------------------------------------
it('redirige un user normal hors du dashboard admin', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/dashboard')
        ->assertStatus(403);
});

// -------------------------------------------------------
// 9. Pages publiques accessibles
// -------------------------------------------------------
it('affiche la page contact', function () {
    $this->get('/contact')->assertStatus(200);
});

it('affiche la page mentions légales', function () {
    $this->get('/legal')->assertStatus(200);
});

// -------------------------------------------------------
// 10. Rate limiting sur la route login (max 5 tentatives/min)
// -------------------------------------------------------
it('bloque la connexion après trop de tentatives (rate limiting)', function () {
    foreach (range(1, 5) as $i) {
        $this->post('/login', [
            'email'    => 'bot@test.com',
            'password' => 'mauvais_' . $i,
        ]);
    }

    $this->post('/login', [
        'email'    => 'bot@test.com',
        'password' => 'mauvais_6',
    ])->assertStatus(429);
});