"use client"

import { useState, useEffect } from "react"
import { usePage, Link, router } from "@inertiajs/react"
import PanierLink from "@/Components/PanierLink";

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


  const [searchValue, setSearchValue] = useState('');

  const [searchError, setSearchError] = useState('');
function handleSearch() {
  if (searchValue.trim()) {
    fetch(`/club-slug?name=${encodeURIComponent(searchValue)}`)
      .then(res => res.json())
      .then(data => {
        if (data.slug) {
          setSearchError('')
          router.get(`/clubs/${data.slug}/maillots`);
          setSearchValue('');
        } else {
          setSearchError('Aucun club correspondant à votre recherche');
        }
      })
      .catch(() => setSearchError('Erreur lors de la recherche'));
  }
}

const [isFocused, setIsFocused] = useState(false);

function handlePanierClick() {
  const { auth } = usePage().props;
  if (auth?.user) {
    router.get('/panier');
  } else {
    localStorage.setItem('postLoginRedirect', '/panier');
    router.get('/login');
  }
}


  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const { auth } = usePage().props; 
const user = auth?.user;               // ou juste "auth" selon la structure, à vérifier 

  const leagues = [
    {
      name: "Sélections Nationales",
      clubs: [
        { name: "France", href: "/clubs/france/maillots" },
        { name: "Brésil", href: "/clubs/bresil/maillots" },
        { name: "Espagne", href: "/clubs/espagne/maillots" },
        { name: "Pays-Bas", href: "/clubs/pays-bas/maillots" },
        { name: "Belgique", href: "/clubs/belgique/maillots" },
        { name: "Sénégal", href: "/clubs/senegal/maillots" },
        { name: "Côte d'Ivoire", href: "/clubs/cote-divoire/maillots" },
        { name: "Maroc", href: "/clubs/maroc/maillots" },
        { name: "Suisse", href: "/clubs/suisse/maillots" },
        { name: "Pologne", href: "/clubs/pologne/maillots" },
        { name: "Croatie", href: "/clubs/croatie/maillots" },
        { name: "Suède", href: "/clubs/suede/maillots" },
        { name: "Danemark", href: "/clubs/danemark/maillots" },
        { name: "Ukraine", href: "/clubs/ukraine/maillots" },
        { name: "Japon", href: "/clubs/japon/maillots" },
        { name: "Corée du Sud", href: "/clubs/corée-du-sud/maillots" },
        { name: "Mexique", href: "/clubs/mexique/maillots" },
         { name: "Inde",   href: "/clubs/inde/maillots" },
      ],
    },
    {
      name: "Ligue 1",
      clubs: [
        { name: "Olympique Lyonnais", href: "/clubs/olympique-lyonnais/maillots" },
        { name: "Girondins de Bordeaux", href: "/clubs/girondins-de-bordeaux/maillots" },
        { name: "Lille", href: "/clubs/lille/maillots" },
        { name: "Monaco", href: "/clubs/monaco/maillots" },
        { name: "Nice", href: "/clubs/nice/maillots" },
        { name: "Rennes", href: "/clubs/rennes/maillots" },
        { name: "Strasbourg", href: "/clubs/strasbourg/maillots" },
        { name: "Toulouse", href: "/clubs/toulouse/maillots" },
        { name: "Nantes", href: "/clubs/nantes/maillots" },
        { name: "Montpellier", href: "/clubs/montpellier/maillots" },
        { name: "Lens", href: "/clubs/lens/maillots" },
        { name: "Reims", href: "/clubs/reims/maillots" },
        { name: "Angers", href: "/clubs/angers/maillots" },
        { name: "Auxerre", href: "/clubs/auxerre/maillots" },
        { name: "AS Cannes",          href: "/clubs/cannes/maillots" },    
      ],
    },
    {
      name: "Premier League",
      clubs: [
        { name: "Liverpool", href: "/clubs/liverpool/maillots" },
        { name: "Manchester City", href: "/clubs/manchester-city/maillots" },
        { name: "Arsenal", href: "/clubs/arsenal/maillots" },
        { name: "Chelsea", href: "/clubs/chelsea/maillots" },
        { name: "Tottenham Hotspur", href: "/clubs/tottenham-hotspur/maillots" },
        { name: "Leicester City", href: "/clubs/leicester-city/maillots" },
        { name: "Aston Villa", href: "/clubs/aston-villa/maillots" },
        { name: "Newcastle United", href: "/clubs/newcastle-united/maillots" },
        { name: "Everton", href: "/clubs/everton/maillots" },
        { name: "Wolverhampton Wanderers", href: "/clubs/wolverhampton-wanderers/maillots" },
        { name: "Brighton", href: "/clubs/brighton/maillots" },
        { name: "Crystal Palace", href: "/clubs/crystal-palace/maillots" },
        { name: "Brentford", href: "/clubs/brentford/maillots" },
        { name: "Fulham", href: "/clubs/fulham/maillots" },
      ],
    },
    {
      name: "Bundesliga",
      clubs: [
        { name: "Bayern Munich", href: "/clubs/bayern-munich/maillots" },
        { name: "Borussia Dortmund", href: "/clubs/borussia-dortmund/maillots" },
        { name: "RB Leipzig", href: "/clubs/rb-leipzig/maillots" },
        { name: "Bayer Leverkusen", href: "/clubs/bayer-leverkusen/maillots" },
        { name: "Borussia Mönchengladbach", href: "/clubs/borussia-monchengladbach/maillots" },
        { name: "Wolfsburg", href: "/clubs/wolfsburg/maillots" },
        { name: "Eintracht Francfort", href: "/clubs/eintracht-francfort/maillots" },
        { name: "Hoffenheim", href: "/clubs/hoffenheim/maillots" },
        { name: "Hertha Berlin", href: "/clubs/hertha-berlin/maillots" },
        { name: "Stuttgart", href: "/clubs/stuttgart/maillots" },
        { name: "Cologne", href: "/clubs/cologne/maillots" },
        { name: "Schalke", href: "/clubs/schalke/maillots" },
      ],
    },
    {
      name: "Liga",
      clubs: [
        { name: "Atletico Madrid", href: "/clubs/atletico-madrid/maillots" },
        { name: "Athletic Bilbao", href: "/clubs/athletic-bilbao/maillots" },
        { name: "Real Madrid", href: "/clubs/real-madrid/maillots" },
        { name: "FC Barcelone", href: "/clubs/fc-barcelone/maillots" },
        { name: "Real Sociedad", href: "/clubs/real-sociedad/maillots" },
        { name: "Valence CF", href: "/clubs/valence-cf/maillots" },
        { name: "Villarreal", href: "/clubs/villarreal/maillots" },
        { name: "Sevilla FC", href: "/clubs/sevilla-fc/maillots" },
        { name: "Real Betis", href: "/clubs/real-betis/maillots" },
        { name: "Celta Vigo", href: "/clubs/celta-vigo/maillots" },
        { name: "Espanyol", href: "/clubs/espanyol/maillots" },
      ],
    },
    {
      name: "Série A",
      clubs: [
        { name: "Inter Milan", href: "/clubs/inter-milan/maillots" },
        { name: "Naples", href: "/clubs/naples/maillots" },
        { name: "Juventus", href: "/clubs/juventus/maillots" },
        { name: "AC Milan", href: "/clubs/ac-milan/maillots" },
        { name: "AS Roma", href: "/clubs/as-roma/maillots" },
        { name: "Lazio Rome", href: "/clubs/lazio-rome/maillots" },
        { name: "Atalanta", href: "/clubs/atalanta/maillots" },
        { name: "Fiorentina", href: "/clubs/fiorentina/maillots" },
        { name: "Torino", href: "/clubs/torino/maillots" },
        { name: "Bologne", href: "/clubs/bologne/maillots" },
      ],
    },

    {
      name: "Autres",
      clubs: [
        { name: "Porto", href: "/clubs/porto/maillots" },
        { name: "Benfica", href: "/clubs/benfica/maillots" },
        { name: "Sporting CP", href: "/clubs/sporting-cp/maillots" },
        { name: "Galatasaray", href: "/clubs/galatasaray/maillots" },
        { name: "Fenerbahçe", href: "/clubs/fenerbahce/maillots" },
        { name: "Celtic FC", href: "/clubs/celtic-fc/maillots" },
        { name: "Rangers FC", href: "/clubs/rangers-fc/maillots" },
        { name: "Ajax Amsterdam", href: "/clubs/ajax-amsterdam/maillots" },
        { name: "PSV Eindhoven", href: "/clubs/psv-eindhoven/maillots" },
        { name: "Grêmio", href: "/clubs/gremio/maillots" }, 
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
              <span className="text-xl font-bold">FOU2FOOT</span>
            </Link>

            {/* Barre de recherche */}
<div className="relative w-full max-w-xl mx-auto">
  <form
    onSubmit={(e) => {
      e.preventDefault(); // Empêche le rechargement de la page
      handleSearch(); // Appelle la même fonction que le bouton
    }}
    className="w-full"
  >
    <input
      type="text"
      value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      placeholder="Rechercher un club..."
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="block w-full pl-4 pr-12 py-2 rounded-full bg-white/20 border border-blue-300
                 text-white placeholder-white/60 transition-shadow focus:shadow-xl focus:ring-2 focus:ring-blue-400"
    />
    <button
      type="submit" // Changé de "button" à "submit" pour déclencher le formulaire
      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-150 active:scale-110"
    >
      {searchError && (
              <p className="text-red-900 text-lm mt-1">{searchError}</p>
            )}
      <svg
        className={`h-6 w-6 transition-colors duration-300 ${isFocused ? "text-white/60" : "text-blue-900"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg> 
      
    </button>
  </form>
</div>
           


            {/* Éléments de droite */}
            <div className="flex items-center gap-6">
              
<div className="hidden md:flex items-center gap-4 text-black">
  {user ? (
  <>
    <Link href="/dashboard" className="hover:text-blue-200 transition-colors" aria-label="Mon compte">
      Mon compte
    </Link>
    <Link
      href="/logout"
      method="post"
      as="button"
      className="hover:text-red-500 transition-colors ml-4"
      aria-label="Déconnexion"
    >
      Déconnexion
    </Link>
  </>
) : (
  <Link href="/login" className="hover:text-blue-200 transition-colors" aria-label="Mon compte">
    Mon compte
  </Link>
)}
     </div>
     

<PanierLink />

            </div>
          </div>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex items-center gap-8 justify-center mt-4 relative z-10"
            aria-label="Navigation principale"
          >
            {/* Élément Accueil */}
            <Link href="/" className="text-white hover:text-blue-200 transition-colors px-4 py-2 " aria-current="page">
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

       
       
        {/* Version Mobile /}
     
     {/* BOUTON BURGER  */}
<button
  onClick={() => setMobileMenuOpen(true)}
  className="md:hidden absolute top-4 right-4 z-50 flex items-center justify-center p-2 rounded-full bg-white/90 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
  aria-label="Ouvrir le menu mobile"
>
  <svg className="h-7 w-7 text-blue-900" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

{/* MENU MOBILE DRAWER  */}
{mobileMenuOpen && (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-30"
    onClick={() => setMobileMenuOpen(false)}
    aria-modal="true"
    tabIndex={-1}
  >
    <nav
      className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-blue-500 text-white shadow-lg p-6 flex flex-col gap-6 overflow-y-auto"
      onClick={e => e.stopPropagation()} // évite la fermeture quand on clique à l'intérieur
      aria-label="Menu mobile"
    >
      {/* BOUTON FERMER */}
      <button
        onClick={() => setMobileMenuOpen(false)}
        className="absolute top-3 right-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Fermer le menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* LOGO + ACCUEIL */}
      <Link
        href="/"
        className="block font-bold text-2xl text-white mb-4 flex items-center gap-2"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Accueil"
      >
        <BallonFootIcon className="h-8 w-8" />
        FOU2FOOT
      </Link>

      {/* BARRE RECHERCHE MOBILE */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSearch();
          setMobileMenuOpen(false);
        }}
        className="w-full mb-4"
      >
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Rechercher un club..."
          className="block w-full pl-4 pr-10 py-2 rounded bg-white/90 border border-blue-300 text-blue-900 placeholder-blue-400"
          aria-label="Rechercher un club"
        />
      </form>

      {/* LIEN ACCUEIL */}
      <Link
        href="/"
        className="block px-3 py-2 rounded hover:bg-blue-400/30 text-white font-medium"
        onClick={() => setMobileMenuOpen(false)}
      >
        Accueil
      </Link>

      {/* LIGUES + CLUBS dépliables */}
      {leagues.map((league) => (
        <div key={league.name} className="mb-1">
          <button
            className="w-full flex justify-between items-center px-3 py-2 font-medium rounded hover:bg-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => toggleMobileLeague(league.name)}
            aria-expanded={activeMobileLeague === league.name}
            aria-controls={`mobile-league-${league.name.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <span>{league.name}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${activeMobileLeague === league.name ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeMobileLeague === league.name && (
            <div className="pl-5 py-1" id={`mobile-league-${league.name.replace(/\s+/g, "-").toLowerCase()}`}>
              {league.clubs.map((club) => (
                <Link
                  key={club.name}
                  href={club.href}
                  className="block px-2 py-2 text-sm rounded hover:bg-blue-400/30 transition focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {club.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* PANIER */}
      <Link
        href="/panier"
        className="block px-3 py-2 rounded hover:bg-blue-400/30 text-white font-medium flex items-center gap-2"
        onClick={() => setMobileMenuOpen(false)}
      >
        <PanierLink />
        <span>Panier</span>
      </Link>

      {/* COMPTE / CONNEXION / DECONNEXION */}
      {user ? (
        <>
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded hover:bg-blue-400/30 text-white font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Mon compte
          </Link>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="block px-3 py-2 rounded hover:bg-red-200/40 text-red-100 font-medium"
            aria-label="Déconnexion"
            onClick={() => setMobileMenuOpen(false)}
          >
            Déconnexion
          </Link>
        </>
      ) : (
        <Link
          href="/login"
          className="block px-3 py-2 rounded hover:bg-blue-400/30 text-white font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          Mon compte
        </Link>
      )}
    </nav>
  </div>
)}

      </div>
    </header>
  )
}

export { BallonFootIcon }
