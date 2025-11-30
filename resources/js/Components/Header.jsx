"use client";

import { useState, useEffect, useRef } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import PanierLink from "@/Components/PanierLink";
import SearchBar from "@/Components/SearchBar";

/* Icône ballon foot (SVG inline) */
function BallonFootIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 496"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M248 0C111 0 0 111 0 248s111 248 248 248 248-111 248-248S385 0 248 0zm0 464C123.5 464 32 372.5 32 248S123.5 32 248 32s216 91.5 216 216-91.5 216-216 216z" />
      <path d="M248 104c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144S327.5 104 248 104zm0 256c-61.9 0-112-50.1-112-112S186.1 136 248 136s112 50.1 112 112-50.1 112-112 112z" />
    </svg>
  );
}

export default function Header() {
  const { auth, categories, url } = usePage().props;
  const user = auth?.user;

  //  Les catégories viennent maintenant directement des props Inertia
  const leagues = categories || [];

  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileLeague, setActiveMobileLeague] = useState(null);
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const drawerRef = useRef(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Détection tactile (iPad / tablettes) 
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouchDevice(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  
  

  // Recherche
  async function handleSearch() {
  if (!searchValue.trim()) return false;
  try {
    const res = await fetch(`/club-slug?name=${encodeURIComponent(searchValue)}`);
    const data = await res.json();
    if (data.slug) {
      setSearchError("");
      router.get(`/clubs/${data.slug}/maillots`);
      setSearchValue("");
      return true;   // ← succès
    } else {
      setSearchError("Aucun club correspondant à votre recherche");
      return false;  // ← échec
    }
  } catch {
    setSearchError("Erreur lors de la recherche");
    return false;    // ← échec
  }
}

  // Effets
  useEffect(() => {
    return () => {
      if (hoverTimeoutId) clearTimeout(hoverTimeoutId);
    };
  }, [hoverTimeoutId]);

  // Fermer drawer clic extérieur
  useEffect(() => {
    const onDown = (e) => {
      if (mobileMenuOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mobileMenuOpen]);

  // Fermer drawer en ≥ md (quand on repasse sur desktop non tactile)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Bloquer le scroll quand le drawer est ouvert
  useEffect(() => {
    const root = document.documentElement;
    if (mobileMenuOpen) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ESC pour fermer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveMenu(null);
        setActiveMobileLeague(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Helpers d'affichage : sur appareils tactiles, on force le mobile jusqu'à xl
  const desktopNavClasses = !isTouchDevice ? "md:flex" : "xl:flex";
  const hideDesktopNavClasses = !isTouchDevice ? "md:hidden" : "xl:hidden";

 const handleDoubleClick = (leagueSlug) => {
    if (leagueSlug) {
      router.get(`/${leagueSlug}`);
  }

};

  return (
    <header
      className="sticky top-0 z-50 bg-gradient-to-r from-red-800 to-blue-500 text-white shadow-lg"
      role="banner"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barre supérieure */}
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 text-black" aria-label="Accueil de Fou2Foot">
            <BallonFootIcon className="h-9 w-9" />
            <span className="text-lg sm:text-xl font-bold">FOU2FOOT</span>
          </Link>

          
          {/* Recherche desktop/tablette - ÉLARGIE avec style inline */}
          {/* BARRE DE RECHERCHE PLUS GRANDE MAIS SANS UTILISER CLASSES TAILWIND */}
<div className={`hidden ${desktopNavClasses}`} style={{ width: '300px', maxWidth: '300px', minWidth: '400px' }}>
  <SearchBar 
    key={`search-desktop-${url}`}
    className="w-full"
    placeholder="Rechercher un club..."
  />
</div>

{/* OU  ANCIEN CODE POUR TAILLE DE BARRE DE RECHERCHE PLUS PETITE  */}
 {/* Recherche desktop/tablette (visible uniquement quand la nav desktop est active) */}
          {/*  Key basée sur l'URL pour forcer le remontage */}         
{/* <SearchBar 
  key={`search-desktop-${url}`}
  className={`hidden ${desktopNavClasses} flex-1 max-w-xl`}
  placeholder="Rechercher un club..."
/> */}

          {/* Actions droites */}
          <div className="flex items-center gap-4">
            <div className={`hidden ${desktopNavClasses} items-center gap-4 text-black`}>
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-white transition-colors">Mon compte</Link>
                  <Link href="/logout" method="post" as="button" className="hover:text-red-200 transition-colors">Déconnexion</Link>
                </>
              ) : (
                <Link href="/login" className="hover:text-white transition-colors">Mon compte</Link>
              )}
            </div>

            <PanierLink />

            {/* Burger mobile (visible quand la nav desktop est masquée) */}
            <button
              type="button"
              className={`${hideDesktopNavClasses} inline-flex items-center justify-center rounded-md p-2 bg-white/90 text-blue-900 shadow focus:outline-none focus:ring-2 focus:ring-white/70`}
              aria-label="Ouvrir le menu"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className={`hidden ${desktopNavClasses} items-center gap-6 justify-center pb-2`} aria-label="Navigation principale">
          <Link href="/" className="px-3 py-2 hover:text-blue-100">Accueil</Link>

          {leagues.map((league) => (
            <div
  key={league.name}
  className="relative mx-1 first:ml-0 last:mr-0"
              onMouseEnter={() => {
                if (hoverTimeoutId) { clearTimeout(hoverTimeoutId); setHoverTimeoutId(null); }
                setActiveMenu(league.name);
              }}
              onMouseLeave={() => {
                const id = setTimeout(() => setActiveMenu(null), 220);
                setHoverTimeoutId(id);
              }}
            >
              <button
                type="button"
                className="px-3 py-2 hover:text-blue-100 whitespace-nowrap rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-haspopup="true"
                aria-expanded={activeMenu === league.name}
                onClick={() => setActiveMenu((cur) => (cur === league.name ? null : league.name))}
                 onDoubleClick={() => handleDoubleClick(league.slug)}
              >
                {league.name}
              </button>

              {activeMenu === league.name && (
  <div
  className="absolute left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-lg bg-white text-gray-800 shadow-xl ring-1 ring-black/5 max-h-96 overflow-y-auto"
  role="menu"
    onMouseEnter={() => {
      if (hoverTimeoutId) { clearTimeout(hoverTimeoutId); setHoverTimeoutId(null); }
    }}
  >
    <div className="p-2">
      {league.clubs.map((club) => (
        <Link 
          key={club.name} 
          href={club.href} 
          className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors" 
          role="menuitem"
        >
          {club.name}
        </Link>
      ))}
    </div>
  </div>
)}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay + Drawer Mobile */}
      <div className={`${hideDesktopNavClasses} ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        {/* overlay cliquable */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />
        {/* panneau */}
        <nav
          id="mobile-menu"
          ref={drawerRef}
          className="absolute inset-y-0 left-0 h-full w-4/5 max-w-xs bg-blue-600 text-white shadow-2xl p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-3 right-3 p-2 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label="Fermer le menu">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Link href="/" className="block font-bold text-2xl mb-4 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)} aria-label="Accueil">
            <BallonFootIcon className="h-8 w-8" /> FOU2FOOT
          </Link>

          {/* Recherche mobile */}
          {/* 🔥 Key basée sur l'URL pour forcer le remontage */}
<SearchBar 
  key={`search-mobile-${url}`}
  className="mb-4"
  placeholder="Rechercher un club..."
/>


          <Link href="/" className="block px-3 py-2 rounded hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>

          {/* Ligues + clubs en accordéon */}
          {leagues.map((league) => (
            <div key={league.name} className="mt-1">
              <button
                className="w-full flex justify-between items-center px-3 py-2 font-medium rounded hover:bg-white/10"
                onClick={() => setActiveMobileLeague((cur) => (cur === league.name ? null : league.name))}
                onDoubleClick={() => {
                                  handleDoubleClick(league.league.slug);
                                  setMobileMenuOpen(false);
                                    }}
                aria-expanded={activeMobileLeague === league.name}
                aria-controls={`mobile-league-${league.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <span>{league.name}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${activeMobileLeague === league.name ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeMobileLeague === league.name && (
                <div className="pl-5 py-1" id={`mobile-league-${league.name.replace(/\s+/g, "-").toLowerCase()}`}>
                  {league.clubs.map((club) => (
                    <Link key={club.name} href={club.href} className="block px-2 py-2 text-sm rounded hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                      {club.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Panier */}
          <Link href="/panier" className="mt-3 block px-3 py-2 rounded hover:bg-white/10 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <PanierLink />
            <span>Panier</span>
          </Link>

          {/* Compte */}
          {user ? (
            <>
              <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Mon compte</Link>
              <Link href="/logout" method="post" as="button" className="block px-3 py-2 rounded hover:bg-red-200/30 text-red-100" onClick={() => setMobileMenuOpen(false)}>Déconnexion</Link>
            </>
          ) : (
            <Link href="/login" className="block px-3 py-2 rounded hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Mon compte</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export { BallonFootIcon };