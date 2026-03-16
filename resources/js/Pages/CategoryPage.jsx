// resources/js/Pages/CategoryPage.jsx

import React from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import WishlistButton from "@/Components/WishlistButton";
import MaillotCardCarousel from "@/Components/MaillotCardCarousel";

export default function CategoryPage({ featuredMaillots, title, description, categorySlug }) {
  const formatPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  // Couleur du badge selon la catégorie
  const getBadgeColor = () => {
    const colors = {
      'selections-nationales': 'bg-blue-600',
      'ligue-1': 'bg-indigo-600',
      'premier-league': 'bg-purple-600',
      'bundesliga': 'bg-red-600',
      'liga': 'bg-yellow-600',
      'serie-a': 'bg-green-600',
      'autres-clubs': 'bg-gray-600'
    };
    return colors[categorySlug] || 'bg-blue-600';
  };

  return (
    <>
      <Head title={title} />
      <Header />

      <main 
        className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen py-6 sm:py-8 md:py-12"
        role="main"
        aria-labelledby="page-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* En-tête de la page */}
          <header className="mb-6 sm:mb-8 md:mb-10 text-center">
            <h1 
              id="page-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 px-2"
            >
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {description}
            </p>
            <p 
              className="text-xs sm:text-sm text-gray-500 mt-2"
              aria-live="polite"
            >
              {featuredMaillots.length} équipe{featuredMaillots.length > 1 ? 's' : ''} disponible{featuredMaillots.length > 1 ? 's' : ''}
            </p>
          </header>

          {/* Grille de maillots */}
          {featuredMaillots.length > 0 ? (
            <section aria-labelledby="maillots-heading">
              <h2 id="maillots-heading" className="sr-only">
                Liste des maillots {title}
              </h2>
              
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                role="list"
              >
                {featuredMaillots.map((maillot) => (
                 <MaillotCardCarousel
    key={maillot.id}
    maillot={maillot}
    href={maillot.href}
    clubName={maillot.club_name}
    maillotName={maillot.maillot_name}
/>
                ))}
              </div>
            </section>
          ) : (
            <div 
              className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md mx-4"
              role="status"
              aria-live="polite"
            >
              <svg 
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600 text-base sm:text-lg mb-4 px-4">
                Aucun maillot disponible pour le moment
              </p>
              <Link 
                href="/" 
                className="inline-block text-sm sm:text-base text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Retourner à la page d'accueil"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Lien retour */}
          <nav className="mt-6 sm:mt-8 text-center" aria-label="Navigation de page">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2"
              aria-label="Retourner à la page d'accueil"
            >
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
}