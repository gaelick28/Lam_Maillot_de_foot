import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Head, Link } from "@inertiajs/react";
// import WishlistButton from "@/Components/WishlistButton";
import MaillotCardCarousel from "@/Components/MaillotCardCarousel";

export default function MaillotsList({ club, maillots }) {
  return (
    <>
      <Head title={`Maillots ${club.name} - FOU2FOOT`} />
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8">
          
          {/* En-tête de la page */}
          {/* Logo du club */}
          
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              {/* // Version avec fond blanc// */}
              {club.logo && (
  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
    <img
      src={`/${club.logo}`}
      alt={`Logo ${club.name}`}
      className="w-full h-full object-contain"
    />
  </div>
)}
       {/* // ou autre version en transparence avec le mix-blend-multiply// */}
              {/* {club.logo && (
                <img
                  src={`/${club.logo}`}
                  alt={`Logo ${club.name}`}
                  className="w-16 h-16 object-contain mix-blend-multiply"
                />
              )} */}   
                   
              <h1 className="text-3xl font-bold text-gray-900">
                Maillots de {club.name}
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg">
              Découvrez notre collection de maillots {club.name} 
              {maillots.length > 0 && (
                <span> - {maillots.length} maillot{maillots.length > 1 ? 's' : ''} disponible{maillots.length > 1 ? 's' : ''}</span>
              )}
            </p>
          </div>

          {/* Grille des maillots */}
          {maillots.length > 0 ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {maillots.map((maillot, index) => (
                <MaillotCardCarousel
                  key={maillot.id}
                  maillot={maillot}
                  href={`/maillots/${maillot.id}`}
                  maillotName={maillot.nom}
                  
                />
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <svg 
                  className="w-16 h-16 mx-auto mb-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun maillot disponible
                </h2>
                <p className="text-gray-600 mb-6">
                  Désolé, aucun maillot n'est actuellement disponible pour {club.name}.
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Retourner à la page d'accueil"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}