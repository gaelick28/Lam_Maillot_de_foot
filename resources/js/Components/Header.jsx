"use client"

import { useState, useEffect } from "react"
import { Link } from "@inertiajs/react"

// Logo ballon foot
function BallonFootIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 496"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M248 0C111 0 0 111 0 248s111 248 248 248 248-111 248-248S385 0 248 0zm0 464C123.5 464 32 372.5 32 248S123.5 32 248 32s216 91.5 216 216-91.5 216-216 216z" />
      <path d="M248 104c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144S327.5 104 248 104zm0 256c-61.9 0-112-50.1-112-112S186.1 136 248 136s112 50.1 112 112-50.1 112-112 112z" />
    </svg>
  )
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMobileLeague, setActiveMobileLeague] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const leagues = [
    {
      name: "Sélections Nationales",
      clubs: [
        { name: "France", href: "/teams/france" },
        { name: "Brésil", href: "/teams/bresil" },
        { name: "Espagne", href: "/teams/espagne" },
        { name: "Pays-Bas", href: "/teams/pays-bas" },
        { name: "Belgique", href: "/teams/belgique" },
        { name: "Sénégal", href: "/teams/senegal" },
        { name: "Côte d'Ivoire", href: "/teams/cote-d-ivoire" },
        { name: "Maroc", href: "/teams/maroc" },
        { name: "Suisse", href: "/teams/suisse" },
        { name: "Pologne", href: "/teams/pologne" },
        { name: "Croatie", href: "/teams/croatie" },
        { name: "Suède", href: "/teams/suede" },
        { name: "Danemark", href: "/teams/danemark" },
        { name: "Ukraine", href: "/teams/ukraine" },
        { name: "Pays-Bas", href: "/teams/pays-bas" },
      ],
    },
    {
      name: "Ligue 1",
      clubs: [
        { name: "Olympique Lyonnais", href: "/clubs/ol" },
        { name: "Girondins de Bordeaux", href: "/clubs/bordeaux" },
        { name: "Lille", href: "/clubs/losc" },
        { name: "Monaco", href: "/clubs/monaco" },
        { name: "Nice", href: "/clubs/nice" },
        { name: "Rennes", href: "/clubs/rennes" },
        { name: "Strasbourg", href: "/clubs/strasbourg" },
        { name: "Toulouse", href: "/clubs/toulouse" },
        { name: "Nantes", href: "/clubs/nantes" },
        { name: "Montpellier", href: "/clubs/montpellier" },
        { name: "Lens", href: "/clubs/lens" },
        { name: "Reims", href: "/clubs/reims" },
        { name: "Angers", href: "/clubs/angers" },
        { name: "Auxerre", href: "/clubs/auxerre" },
      ],
    },
    {
      name: "Premier League",
      clubs: [
        { name: "Liverpool", href: "/clubs/liverpool" },
        { name: "Manchester City", href: "/clubs/mancity" },
        { name: "Arsenal", href: "/clubs/arsenal" },
        { name: "Chelsea", href: "/clubs/chelsea" },
        { name: "Tottenham Hotspur", href: "/clubs/tottenham" },
        { name: "Leicester City", href: "/clubs/leicester" },
        { name: "Aston Villa", href: "/clubs/astonvilla" },
        { name: "Newcastle United", href: "/clubs/newcastle" },
        { name: "Everton", href: "/clubs/everton" },
        { name: "Wolverhampton Wanderers", href: "/clubs/wolves" },
        { name: "Brighton & Hove Albion", href: "/clubs/brighton" },
        { name: "Crystal Palace", href: "/clubs/crystalpalace" },
        { name: "Brentford", href: "/clubs/brentford" },
        { name: "Fulham", href: "/clubs/fulham" },
      ],
    },
    {
      name: "Bundesliga",
      clubs: [
        { name: "Bayern Munich", href: "/clubs/bayern" },
        { name: "Borussia Dortmund", href: "/clubs/dortmund" },
        { name: "RB Leipzig", href: "/clubs/leipzig" },
        { name: "Bayer Leverkusen", href: "/clubs/leverkusen" },
        { name: "Borussia Mönchengladbach", href: "/clubs/monchengladbach" },
        { name: "VfL Wolfsburg", href: "/clubs/wolfsburg" },
        { name: "Eintracht Francfort", href: "/clubs/francfort" },
        { name: "Hoffenheim", href: "/clubs/hoffenheim" },
        { name: "Hertha Berlin", href: "/clubs/hertha" },
        { name: "VfB Stuttgart", href: "/clubs/stuttgart" },
        { name: "FC Cologne", href: "/clubs/cologne" },
        { name: "Schalke 04", href: "/clubs/schalke" },
      ],
    },
    {
      name: "Liga",
      clubs: [
        { name: "Atletico Madrid", href: "/clubs/atletico" },
        { name: "Athletic Bilbao", href: "/clubs/bilbao" },
        { name: "Real Madrid", href: "/clubs/real" },
        { name: "FC Barcelone", href: "/clubs/barca" },
        { name: "Real Sociedad", href: "/clubs/sociedad" },
        { name: "Valence CF", href: "/clubs/valence" },
        { name: "Villarreal", href: "/clubs/villarreal" },
        { name: "Sevilla FC", href: "/clubs/sevilla" },
        { name: "Real Betis", href: "/clubs/betis" },
        { name: "Celta Vigo", href: "/clubs/celta" },
        { name: "Espanyol", href: "/clubs/espanyol" },
        
      ],
    },
    {
      name: "Série A",
      clubs: [
        { name: "Inter Milan", href: "/clubs/inter" },
        { name: "Naples", href: "/clubs/naples" },
        { name: "Juventus", href: "/clubs/juventus" },
        { name: "AC Milan", href: "/clubs/milan" },
        { name: "AS Roma", href: "/clubs/roma" },
        { name: "Lazio Rome", href: "/clubs/lazio" },
        { name: "Atalanta", href: "/clubs/atalanta" },
        { name: "Fiorentina", href: "/clubs/fiorentina" },
        { name: "Torino", href: "/clubs/torino" },
        { name: "Bologne", href: "/clubs/bologne" },

      ],
    },
  ]

  const toggleMobileLeague = (leagueName) => {
    setActiveMobileLeague(activeMobileLeague === leagueName ? null : leagueName)
  }

  return (
    <header className="bg-gradient-to-r from-red-800 to-blue-500 py-2 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-3">
        {/* Structure réorganisée en colonne */}
        <div className="flex flex-col">
          {/* Ligne supérieure avec logo et éléments de droite */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-black" aria-label="Accueil de Fou2Foot">
              <BallonFootIcon className="h-10 w-10" />
              <span className="text-xl font-bold">Fou2Foot</span>
            </Link>

            {/* Barre de recherche */}
            <div className="flex-grow max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche de produits..."
                  className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Rechercher des produits"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <Link
                  href="/account"
                  className="hover:text-blue-200 transition-colors "
                  aria-label="Mon compte"
                >
                  Mon compte
                </Link>
              </div>

              {/* Panier */}
              <Link
                href="/cart"
                className="relative hover:text-blue-200 transition-colors text-black "
                aria-label="Panier (3 articles)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span
                  className="absolute -top-1 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5"
                  aria-hidden="true"
                >
                  3
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex items-center gap-8 justify-center mt-4 relative z-10"
            aria-label="Navigation principale"
          >
            {/* Élément Accueil */}
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-colors px-4 py-2 "
              aria-current="page"
            >
              Accueil
            </Link>

            {leagues.map((league) => (
              <div
                key={league.name}
                className="relative group"
                onMouseEnter={() => {
                  // Annuler le timeout s'il existe
                  if (timeoutId) {
                    clearTimeout(timeoutId)
                    setTimeoutId(null)
                  }
                  setActiveMenu(league.name)
                }}
                onMouseLeave={() => {
                  // Ajouter un délai avant de fermer le menu
                  const id = setTimeout(() => {
                    setActiveMenu(null)
                  }, 300) // 300ms de délai
                  setTimeoutId(id)
                }}
              >
                <button
                  className="flex items-center gap-1 hover:text-blue-200 transition-colors px-4 py-2"
                  aria-expanded={activeMenu === league.name}
                  aria-haspopup="true"
                  aria-label={`Menu ${league.name}`}
                  onClick={() => setActiveMenu(activeMenu === league.name ? null : league.name)}
                >
                  {league.name}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeMenu === league.name ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu déroulant */}
                {activeMenu === league.name && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-blue-50 text-gray-800 rounded-lg shadow-xl min-w-[240px] py-2 z-50"
                    role="menu"
                    onMouseEnter={() => {
                      // Annuler le timeout quand on entre dans le menu
                      if (timeoutId) {
                        clearTimeout(timeoutId)
                        setTimeoutId(null)
                      }
                    }}
                    onMouseLeave={() => {
                      // Fermer immédiatement quand on quitte le menu
                      setActiveMenu(null)
                    }}
                  >
                    {league.clubs.map((club) => (
                      <Link
                        key={club.name}
                        href={club.href}
                        className="block px-6 py-2 hover:bg-blue-100 transition-colors text-sm whitespace-nowrap focus:outline-none focus:bg-blue-50"
                        role="menuitem"
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

        {/* Version Mobile - AMÉLIORÉE */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex justify-between items-center p-3 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu mobile"
            aria-controls="mobile-menu"
          >
            <span className="font-medium">Menu</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="mt-2 space-y-2 bg-blue-800/50 rounded-lg p-2"
              aria-label="Navigation mobile"
            >
              <Link
                href="/"
                className="block bg-blue-700 rounded-lg p-3 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-current="page"
              >
                <span className="font-medium">Accueil</span>
              </Link>

              {leagues.map((league) => (
                <div key={league.name} className="bg-blue-700 rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-3 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => toggleMobileLeague(league.name)}
                    aria-expanded={activeMobileLeague === league.name}
                    aria-controls={`mobile-${league.name.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <span className="font-medium">{league.name}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${activeMobileLeague === league.name ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* FIX: Les clubs n'apparaissent que si la ligue est sélectionnée */}
                  {activeMobileLeague === league.name && (
                    <div
                      id={`mobile-${league.name.replace(/\s+/g, "-").toLowerCase()}`}
                      className="bg-blue-800 px-3 pb-2"
                    >
                      {league.clubs.map((club) => (
                        <Link
                          key={club.name}
                          href={club.href}
                          className="block p-2 text-sm hover:bg-blue-600 rounded transition-colors focus:outline-none focus:bg-blue-600"
                        >
                          {club.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export { BallonFootIcon }
