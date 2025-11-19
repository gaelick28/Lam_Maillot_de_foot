"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import PanierLink from "@/Components/PanierLink";

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
  const { auth } = usePage().props;
  const user = auth?.user;

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

  // Tri FR (accents/casse gérés)
  const collator = useMemo(
    () => new Intl.Collator("fr", { sensitivity: "base", numeric: true }),
    []
  );

  //  CLUBS ( triés A→Z)
  const leagues = useMemo(
    () =>
      [
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
            { name: "Inde", href: "/clubs/inde/maillots" },
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
            { name: "AS Cannes", href: "/clubs/cannes/maillots" },
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
            { name: "Flamengo", href: "/clubs/flamengo/maillots" },
          ],
        },
      ].map((l) => ({
        ...l,
        clubs: [...l.clubs].sort((a, b) => collator.compare(a.name, b.name)),
      })),
    [collator]
  );
  

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

  // Helpers d’affichage : sur appareils tactiles, on force le mobile jusqu’à xl
  const desktopNavClasses = !isTouchDevice ? "md:flex" : "xl:flex";
  const hideDesktopNavClasses = !isTouchDevice ? "md:hidden" : "xl:hidden";

  // Mapping entre les noms affichés et les slugs d'URL
const categoryMapping = {
  "Sélections Nationales": "selections-nationales",
  "Ligue 1": "ligue-1",
  "Premier League": "premier-league",
  "Bundesliga": "bundesliga",
  "Liga": "liga",
  "Série A": "serie-a",
  "Autres": "autres-clubs"
};

const handleDoubleClick = (leagueName) => {
  const slug = categoryMapping[leagueName];
  if (slug) {
    router.get(`/${slug}`);
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

          {/* Recherche desktop/tablette (visible uniquement quand la nav desktop est active) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className={`hidden ${desktopNavClasses} flex-1 max-w-xl`}
            role="search"
          >
            <label htmlFor="search" className="sr-only">Rechercher un club</label>
            <div className="relative">
              <input
  id="search"
  type="search"
  value={searchError ? searchError : searchValue}
  onChange={(e) => {
    if (searchError) {
      setSearchError(""); // efface l'erreur dès qu'on retape
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
    }
  }}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  placeholder="Rechercher un club…"
  className={
    "w-full lg:w-[500px] h-10 rounded-full text-white px-5 text-base md:text-lg pr-12 focus:outline-none " +
    (searchError
      ? "bg-red-500/30 text-red-100 placeholder-red-200 focus:ring-2 focus:ring-red-300"
      : "bg-white/20 placeholder-white/60 focus:ring-2 focus:ring-white/70")
  }
  autoComplete="off"
/>
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label="Lancer la recherche">
                <svg className={`h-5 w-5 ${isFocused ? "text-white/80" : "text-white/70"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

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
                 onDoubleClick={() => handleDoubleClick(league.name)}
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
         <form
  onSubmit={async (e) => {
    e.preventDefault();
    const ok = await handleSearch();
    if (ok) setMobileMenuOpen(false); // ← ne ferme que si succès
  }}
  className="mb-4"
>
  <label htmlFor="m-search" className="sr-only">Rechercher un club</label>

  <div className="relative">
    <input
      id="m-search"
      type="search"
      value={searchError ? searchError : searchValue}
      onChange={(e) => {
        if (searchError) {
          setSearchError(""); // efface l'erreur dès qu'on retape
          setSearchValue(e.target.value);
        } else {
          setSearchValue(e.target.value);
        }
      }}
      placeholder="Rechercher un club…"
      className={
        "block w-full h-12 rounded-lg px-5 pr-12 text-base " +
        (searchError
          ? "bg-red-100 text-red-600 placeholder-red-400 border border-red-400"
          : "bg-white/90 text-blue-900 placeholder-blue-500 border border-blue-300")
      }
      autoComplete="off"
    />

    {/* Icônes à droite dans la bulle (croix + loupe) */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
      {(searchError || searchValue) && (
        <button
          type="button"
          onClick={() => {
            setSearchValue("");
            setSearchError("");
            document.getElementById("m-search")?.focus();
          }}
          aria-label="Effacer la recherche"
          className="p-1"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <button type="submit" aria-label="Lancer la recherche" className="p-1">
        <svg className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </div>

</form>


          <Link href="/" className="block px-3 py-2 rounded hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>

          {/* Ligues + clubs en accordéon */}
          {leagues.map((league) => (
            <div key={league.name} className="mt-1">
              <button
                className="w-full flex justify-between items-center px-3 py-2 font-medium rounded hover:bg-white/10"
                onClick={() => setActiveMobileLeague((cur) => (cur === league.name ? null : league.name))}
                onDoubleClick={() => {
                                  handleDoubleClick(league.name);
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
