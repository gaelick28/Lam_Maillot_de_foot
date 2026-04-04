import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Composant bouton Wishlist
 * Gère l'ajout/suppression en BDD (si connecté) ou localStorage (si non connecté)
 */
export default function WishlistButton({ maillotId, className = "" }) {
  const { auth } = usePage().props;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'état initial
  useEffect(() => {
    checkInitialState();
  }, [maillotId, auth?.user]);

  const checkInitialState = async () => {
    if (auth?.user) {
      // Utilisateur connecté : vérifier via API
      await checkWishlistStatus();
    } else {
      // Utilisateur non connecté : vérifier localStorage
      const localWishlist = getLocalWishlist();
      setIsInWishlist(localWishlist.includes(maillotId));
    }
  };

  // Vérifier si le maillot est dans la wishlist (pour utilisateurs connectés)
  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist/ids', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Erreur API wishlist/ids:', response.status);
        return;
      }
      
      const data = await response.json();
      const isIn = Array.isArray(data.wishlist_ids) && data.wishlist_ids.includes(maillotId);
      setIsInWishlist(isIn);
  
    } catch (error) {
     
    }
  };

  // Récupérer la wishlist du localStorage
  const getLocalWishlist = () => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
     
      return [];
    }
  };

  // Sauvegarder la wishlist dans localStorage
  const saveLocalWishlist = (wishlist) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      if (auth?.user) {
        // Utilisateur connecté : API
        await toggleWishlistAPI();
      } else {
        // Utilisateur non connecté : localStorage
        toggleWishlistLocal();
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  // Toggle pour utilisateurs connectés (API)
  const toggleWishlistAPI = async () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    if (!csrfToken) {

      alert('Erreur: CSRF token manquant. Rechargez la page.');
      return;
    }

    try {
      if (isInWishlist) {
        // Retirer
       
        const response = await fetch(`/api/wishlist/remove/${maillotId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });

        if (response.ok) {
          setIsInWishlist(false);
        
        } else {
          const error = await response.json();
         
          alert('Erreur lors de la suppression');
        }
      } else {
        // Ajouter

        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({ maillot_id: maillotId }),
        });


        if (response.ok) {
          setIsInWishlist(true);
  
        } else {
          const error = await response.json();
     
          alert('Erreur lors de l\'ajout');
        }
      }
    } catch (error) {

      alert('Erreur de connexion');
    }
  };

  // Toggle pour utilisateurs non connectés (localStorage)
  const toggleWishlistLocal = () => {
    const localWishlist = getLocalWishlist();
    
    if (isInWishlist) {
      // Retirer
      const newWishlist = localWishlist.filter(id => id !== maillotId);
      saveLocalWishlist(newWishlist);
      setIsInWishlist(false);

    } else {
      // Ajouter
      const newWishlist = [...localWishlist, maillotId];
      saveLocalWishlist(newWishlist);
      setIsInWishlist(true);
   
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isInWishlist 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isInWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
      title={isInWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
    >
      <svg
        className="w-5 h-5"
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

/**
 * Hook pour synchroniser localStorage → BDD lors de la connexion
 * À appeler côté client après une connexion réussie
 */
export const syncWishlistOnLogin = async () => {
  
  
  const localWishlist = localStorage.getItem('wishlist');
  
  if (!localWishlist) {
 
    return;
  }

  try {
    const maillotIds = JSON.parse(localWishlist);
    
    if (!Array.isArray(maillotIds) || maillotIds.length === 0) {
   
      return;
    }

    

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    if (!csrfToken) {
     
      return;
    }

    const response = await fetch('/api/wishlist/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ maillot_ids: maillotIds }),
    });

    if (response.ok) {
      const data = await response.json();

      
      // Vider le localStorage après synchronisation
      localStorage.removeItem('wishlist');

    } else {
      
    }
  } catch (error) {
  
  }
};