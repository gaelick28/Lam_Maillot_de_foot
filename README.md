# Fou2Foot 🎽

Application e-commerce de maillots de football, développée en autonomie dans le cadre du Titre Professionnel Développeur Web et Web Mobile (DWWM, Niveau 5).

🌐 **Site en production : [https://fou2foot.eu](https://fou2foot.eu)**

---

## Stack technique

- **Back-end :** Laravel 11 (PHP orienté objet), PostgreSQL (Neon), API REST
- **Front-end :** React 18, Inertia.js, Tailwind CSS, Vite
- **Infrastructure :** Docker, Render (déploiement cloud)
- **Services :** Stripe (paiement), Cloudinary (stockage images), Resend (emails SMTP production), Mailtrap (emails SMTP développement)
- **Outils :** Git / GitHub, Composer, npm

---

## Fonctionnalités

### Espace utilisateur
- Authentification (inscription, connexion, gestion de profil)
- Catalogue de maillots avec filtres et recherche
- Gestion du panier et des adresses de livraison
- Paiement sécurisé via Stripe
- Suivi des commandes
- Emails transactionnels via Brevo SMTP

### Panel d'administration
- Gestion des maillots : création, modification, suppression (avec upload d'images recto/verso)
- Gestion des clubs : création, modification, suppression
- Import de maillots en masse à partir des images
- Positionnement éditorial sur la page d'accueil : gestion de l'ordre d'affichage dans les sections "Maillots phares" et "Nouveaux maillots" avec réordonnancement automatique des positions (insertion, déplacement, suppression sans trou)
- Ordre d'affichage des maillots par club avec le même mécanisme de réordonnancement
- Gestion des stocks par taille (S, M, L, XL, XXL) avec filtres avancés (rupture, stock faible, stock partiel)
- Statistiques
- Gestion du profil administrateur

---

## Points techniques notables

- Système de positionnement éditorial en pur PHP côté serveur (sans librairie externe) : insertion à une position précise avec décalage automatique, déplacement avec réajustement des positions intermédiaires, fermeture des trous à la suppression
- Upload et stockage d'images via Cloudinary en production, stockage local en développement (environnement branché via `env('RENDER')`)
- Migration de base de données MySQL → PostgreSQL en production avec script de migration personnalisé
- Déploiement containerisé via Docker sur Render (filesystem éphémère)
- Requêtes SQL compatibles MySQL et PostgreSQL (`ILIKE` / `LIKE`, `COALESCE`, `whereRaw`)
- Configuration multi-environnements (local / production)

---

## Installation locale

```bash
git clone https://github.com/gaelick28/Lam_Maillot_de_foot.git
cd Lam_Maillot_de_foot
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
```

Configurer les variables d'environnement dans `.env` (DB, Stripe, Cloudinary, Mailtrap pour les emails en local), puis lancer dans deux terminaux séparés :

```bash
# Terminal 1 — serveur Laravel
php artisan serve

# Terminal 2 — compilation des assets React
npm run dev
```

L'application est accessible sur `http://localhost:8000`.

---

## Auteur

**Gaëlick Rigoux** — Développeur Web Full Stack  
📧 [gaelick28@gmail.com](mailto:gaelick28@gmail.com)  
🌐 [https://fou2foot.eu](https://fou2foot.eu)