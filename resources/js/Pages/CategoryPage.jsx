// resources/js/Pages/CategoryPage.jsx

import React from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

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

      <main className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* En-tête de la page */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {description}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {featuredMaillots.length} équipe{featuredMaillots.length > 1 ? 's' : ''} disponible{featuredMaillots.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Grille de maillots */}
          {featuredMaillots.length > 0 ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              role="grid"
              aria-label={`Liste des maillots ${title}`}
            >
              {featuredMaillots.map((maillot, index) => (
                <article 
                  key={maillot.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  role="gridcell"
                  aria-rowindex={Math.floor(index / 4) + 1}
                  aria-colindex={(index % 4) + 1}
                >
                  <Link
                    href={maillot.href}
                    className="block group"
                    aria-label={`Voir tous les maillots ${maillot.club_name}`}
                  >
                    {/* Image du maillot */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={`/${maillot.image}`}
                        alt={`Maillot ${maillot.club_name}`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Badge de catégorie */}
                      {/* <div className={`absolute top-2 right-2 ${getBadgeColor()} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                        {title}
                      </div> */}
                    </div>

                    {/* Informations */}
                    <div className="p-4">
                      <h2 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {maillot.club_name}
                      </h2>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                        {maillot.maillot_name}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-700">
                          À partir de {formatPrice.format(maillot.price)}
                        </span>
                        
                        <span className="text-sm text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                          Voir tout
                          <svg 
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-12 bg-white rounded-lg shadow-md"
              role="status"
            >
              <svg 
                className="w-16 h-16 mx-auto mb-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">
                Aucun maillot disponible pour le moment
              </p>
              <Link 
                href="/" 
                className="inline-block text-blue-600 hover:text-blue-800 underline"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Lien retour */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}