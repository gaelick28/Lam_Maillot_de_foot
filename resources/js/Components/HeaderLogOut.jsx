import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { GiAbstract039 } from "react-icons/gi";

// logo ballon foot 
function BallonFootIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 496"
      fill="currentColor"
    >
      <path d="M248 0C111 0 0 111 0 248s111 248 248 248 248-111 248-248S385 0 248 0zm0 464C123.5 464 32 372.5 32 248S123.5 32 248 32s216 91.5 216 216-91.5 216-216 216z"/>
      <path d="M248 104c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144S327.5 104 248 104zm0 256c-61.9 0-112-50.1-112-112S186.1 136 248 136s112 50.1 112 112-50.1 112-112 112z"/>
    </svg>
  );
}

export default function HeaderLogOut() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leagues = [
    {
      name: 'Sélections Nationales',
      clubs: [
        { name: 'France', href: '/teams/france' },
        { name: 'Brésil', href: '/teams/bresil' },
        // ...
      ]
    },
    
    { 
      name: 'Ligue 1',
      clubs: [
        { name: 'Olympique Lyonnais', href: '/clubs/ol' },
        { name: 'Girondins de Bordeaux', href: '/clubs/bordeaux' },
        { name: 'Lille', href: '/clubs/losc' },
        
        // Ajouter tous les clubs...enfin presque 
      ]
    },
    {
      name: 'Premier League',
      clubs: [
        { name: 'Liverpool', href: '/clubs/liverpool' },
        { name: 'Manchester City', href: '/clubs/mancity' },
        // ...
      ]
    },
    {
      name: 'Bundesliga',
      clubs: [
      { name: 'Bayern Munich', href: '/clubs/bayern' },
      { name: 'Borussia Dortmund', href: '/clubs/dortmund' },
      // ...
    ]
    },
    {
      name: 'Liga',
      clubs: [
      { name: 'Athletico Madrid', href: '/clubs/athletico' },
      { name: 'Athletico Bilbao', href: '/clubs/bilbao' },
      // ...
    ]
    },
    {
  name: 'Série A',
  clubs: [
    { name: 'Inter Milan', href: '/clubs/inter' },
    { name: 'Naples', href: '/clubs/naples' },
    // ...
  ]
    },
    // Voir ajout autres ligues...
  ];

  return (
    <HeaderLogOut className="bg-gradient-to-r from-red-800 to-blue-500 py-2 text-white shadow-lg relative">
     {/* ou sans gradiant <HeaderLogOut className="bg-blue-800 text-white shadow-lg relative">  */}
      
      <div className="container mx-auto px-4 py-3">
        {/* Structure réorganisée en colonne */}
        <div className="flex flex-col">
          {/* Ligne supérieure avec logo et éléments de droite */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BallonFootIcon className="h-10 w-10 text-black" />
              <span className="text-xl font-bold text-black">Fou2Foot</span>

            </Link>
 {/* Barre de recherche ajoutée ici */}
            <div className="flex-grow max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche de produits..."
                  className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Éléments de droite */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-black">
                <Link href="/account" className="hover:text-blue-200 transition-colors">
                  Mon compte
                </Link>
                </div>
              
              {/* Panier */}
              <Link href="/cart" className="relative hover:text-blue-200  transition-colors text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5">
                  3
                </span>
              </Link>
            </div>
            {/* Déconnexion 1 */}
                {/* <div className="hidden md:flex items-center gap-4 text-black">
                <Link href="/account" className="hover:text-blue-200 transition-colors">
                  Se déconnecter
                </Link>
                </div> */}

            {/* ou déconnexion 2 */}
                {/* <div className="hidden md:flex items-center gap-4 text-black">
              <Link href="/logout" className="text hover:text-blue-200">
                <FaSignOutAlt /> Se déconnecter
              </Link>
            </div> */}

          </div>

          {/* Navigation Desktop - Déplacée en dessous */}
          <nav className="hidden md:flex items-center gap-8 justify-center mt-4 relative z-10">
            {leagues.map((league) => (
              <div 
                key={league.name}
                className="relative group"
                onMouseEnter={() => setActiveMenu(league.name)}
                // onMouseLeave={() => setActiveMenu(null)}
                onClick={() => setActiveMenu(activeMenu === league.name ? null : league.name)}
              >
                <button className="flex items-center gap-1 hover:text-blue-200 transition-colors px-4 py-2">
                  {league.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu déroulant */}
                {activeMenu === league.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white text-gray-800 rounded-lg shadow-xl min-w-[240px] py-2 z-50">
                    {league.clubs.map((club) => (
                      <Link
                        key={club.name}
                        href={club.href}
                        className="block px-6 py-2 hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
                      >
                        {club.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Version Mobile */}
        <div className="md:hidden mt-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex justify-between items-center p-2 bg-blue-700 rounded"
          >
            Menu
            <svg className={`w-5 h-5 transform transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}>
              <path stroke="currentColor" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 space-y-2">
              {leagues.map((league) => (
                <div key={league.name} className="bg-blue-700 rounded p-2">
                  <div className="font-medium">{league.name}</div>
                  <div className="ml-4 mt-1 space-y-1">
                    {league.clubs.map((club) => (
                      <Link
                        key={club.name}
                        href={club.href}
                        className="block p-1 text-sm hover:bg-blue-600 rounded"
                      >
                        {club.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HeaderLogOut>
  );
}