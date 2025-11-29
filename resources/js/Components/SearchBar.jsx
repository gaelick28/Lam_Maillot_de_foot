import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";

export default function SearchBar({ className = "", placeholder = "Rechercher un club..." }) {
  const { url } = usePage();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showNoResults, setShowNoResults] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Réinitialisation complète quand l'URL change
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsLoading(false);
    setShowNoResults(false);
  }, [url]);

  // Fermer les suggestions si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowNoResults(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setShowNoResults(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowNoResults(false);
    
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/search/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSuggestions(data);
          if (data.length > 0) {
            setIsOpen(true);
            setShowNoResults(false);
          } else {
            // Aucun résultat trouvé
            setIsOpen(false);
            setShowNoResults(true);
          }
        } else {
          setSuggestions([]);
          setIsOpen(false);
          setShowNoResults(true);
        }
      } catch (error) {
        console.error("Erreur de recherche:", error);
        setSuggestions([]);
        setIsOpen(false);
        setShowNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigation au clavier
  const handleKeyDown = (e) => {
    if (!isOpen) {
      // Si on appuie sur Entrée sans suggestions ouvertes
      if (e.key === "Enter" && query.length >= 2) {
        e.preventDefault();
        router.get(`/search?q=${encodeURIComponent(query)}`);
        return;
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query.length >= 2) {
          router.get(`/search?q=${encodeURIComponent(query)}`);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setShowNoResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (club) => {
    if (!club || !club.url) return;
    router.get(club.url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length >= 2) {
      router.get(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full h-10 rounded-full text-white px-5 text-base md:text-lg pr-12 focus:outline-none bg-white/20 placeholder-white/60 focus:ring-2 focus:ring-white/70"
          autoComplete="off"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          aria-label="Rechercher"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
         <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto z-[100]">
          {suggestions.map((club, index) => (
            <button
              key={club.id}
              onClick={() => handleSelect(club)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
            >
              {club.image ? (
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                  loading="eager"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0"
                style={{ display: club.image ? 'none' : 'flex' }}
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-gray-900 truncate">{club.name}</div>
                <div className="text-sm text-gray-500">
                  {club.maillots_count || 0} maillot{(club.maillots_count || 0) > 1 ? "s" : ""} disponible{(club.maillots_count || 0) > 1 ? "s" : ""}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Message "Aucun résultat" */}
      {showNoResults && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl p-4">
          <div className="flex items-center gap-3 text-gray-600">
            <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Aucun club trouvé</p>
              <p className="text-sm text-gray-500">Aucun résultat pour "{query}"</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tous les résultats →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}