"use client";

import { usePage, router, Link } from "@inertiajs/react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Panier() {
  const { auth, cartItems: initialCartItems = [] } = usePage().props;
  const user = auth?.user;

  // Prix fixes pour les suppléments
  const nomPrix = 3;
  const numeroPrix = 2;

  // Etat local
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [loadingId, setLoadingId] = useState(null);
  const [dirtyMap, setDirtyMap] = useState({});

  // --- Adresse de livraison par défaut (UNE source de vérité) ---
  const shippingAddress = useMemo(
    () => user?.addresses?.find(a => a.type === "shipping" && a.is_default) || null,
    [user]
  );

  // --- Validation utilitaires ---
  const validateNom = useCallback((val) => /^[A-Z'ÇÉÈÊËÏÄÜÖÔ\s-]*$/.test(val), []);
  const validateNumero = useCallback((val) => {
    if (val === "") return true;
    if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 99;
    }
    return false;
  }, []);

  // --- Calcul des totaux d'une ligne ---
  const computeItemTotals = useCallback(
    (item) => {
      const base = parseFloat(item.price) || 0;
      const qte = parseInt(item.quantity) || 1;
      let supplement = 0;
      if (item.nom) supplement += nomPrix;
      if (item.numero) supplement += numeroPrix;
      return {
        ...item,
        priceNum: base,
        supplement,
        total: (base + supplement) * qte,
      };
    },
    [nomPrix, numeroPrix]
  );

  // Initialisation : normaliser les items 
 useEffect(() => {
  setCartItems(initialCartItems.map(computeItemTotals));
}, [initialCartItems, computeItemTotals]);

  //  Total panier + format monétaire 
  const prixTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.total || 0), 0),
    [cartItems]
  );

  const formatPrice = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }),
    []
  );

  //  Handlers 
  const handleEdit = useCallback(
    (id, field, value) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? computeItemTotals({ ...item, [field]: value }) : item
        )
      );
      setDirtyMap((prev) => ({ ...prev, [id]: true }));
    },
    [computeItemTotals]
  );

  const handleRemove = useCallback((itemId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?")) {
      router.delete(`/panier/item/${itemId}`, {
        onSuccess: () => {
          setCartItems((items) => items.filter((i) => i.id !== itemId));
        },
      });
    }
  }, []);

  const handleSave = useCallback((item) => {
    setLoadingId(item.id);
    router.put(
      `/panier/item/${item.id}`,
      {
        size: item.size,
        quantity: item.quantity,
        nom: item.nom,
        numero: item.numero,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setDirtyMap((prev) => ({ ...prev, [item.id]: false }));
          setLoadingId(null);
         
           // Retirer le focus du champ actif (enlève le curseur des champs après sauvegarde)
          if (document.activeElement) {
          document.activeElement.blur();
        }
          alert("Modifications enregistrées !");
        },
        onError: () => setLoadingId(null),
      }
    );
  }, []);

const handleKeyDown = useCallback((e, item) => {
  if (e.key === "Enter" && dirtyMap[item.id]) {
    e.preventDefault(); // Empêche le comportement par défaut
    handleSave(item);
  }
}, [dirtyMap, handleSave]);

  const handleClearCart = useCallback(() => {
    if (confirm("Êtes-vous sûr de vouloir vider complètement votre panier ?")) {
      router.post("/panier/clear");
      setCartItems([]);
    }
  }, []);

  const goToCheckout = useCallback(() => {
    if (!shippingAddress) {
      alert("Veuillez d'abord renseigner votre adresse de livraison.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Votre panier est vide !");
      return;
    }
    router.visit("/checkout");
  }, [shippingAddress, cartItems]);

  
  // Ajouter après les autres useEffect pour retirer curseur des champs après sauvegarde
useEffect(() => {
  const handleGlobalKeyDown = (e) => {
    if (e.key === "Enter") {
      // Trouver le premier item avec des modifications non sauvegardées
      const dirtyItemId = Object.keys(dirtyMap).find(id => dirtyMap[id]);
      
      if (dirtyItemId) {
        e.preventDefault();
        
        // Trouver l'item correspondant dans cartItems
        const itemToSave = cartItems.find(item => item.id === parseInt(dirtyItemId));
        
        if (itemToSave) {
          handleSave(itemToSave);
        }
      }
    }
  };

  // Ajouter l'écouteur
  document.addEventListener('keydown', handleGlobalKeyDown);

  // Nettoyer à la destruction du composant
  return () => {
    document.removeEventListener('keydown', handleGlobalKeyDown);
  };
}, [dirtyMap, cartItems, handleSave]);

  // --- Rendu ---
  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="container max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6">
            Mon panier
          </h1>

          {cartItems.length === 0 ? (
            <div
              className="text-center text-gray-600 bg-white rounded-lg p-6 sm:p-8 shadow-md"
              role="status"
              aria-live="polite"
            >
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 17a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-base sm:text-lg mb-3 sm:mb-4">Votre panier est vide</p>
              <Link
                href="/"
                className="text-blue-700 underline hover:text-blue-900 focus:ring-2 focus:ring-blue-500 rounded"
              >
                Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* --- Vue mobile en cartes --- */}
              <div className="lg:hidden p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 md:p-5 shadow-sm mb-4"
                    role="group"
                    aria-label={`Article ${item.maillot_name}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={`${item.club_name}, ${item.maillot_name}`}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {item.club_name}, {item.maillot_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice.format(item.priceNum)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {/* Taille */}
                      <label htmlFor={`size-${item.id}`} className="text-xs font-medium text-gray-600">
                        Taille
                      </label>
                      <select
                        id={`size-${item.id}`}
                        value={item.size}
                        onChange={(e) => handleEdit(item.id, "size", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        className="col-span-1 border rounded-md px-2 py-1 bg-blue-50 text-blue-800 font-semibold focus:ring-2 focus:ring-blue-300"
                      >
                        {["S", "M", "L", "XL"].map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>

                      {/* Quantité */}
                      <label htmlFor={`quantity-${item.id}`} className="text-xs font-medium text-gray-600">
                        Quantité
                      </label>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min={1}
                        className="col-span-1 border w-full px-2 py-1 bg-blue-50 text-blue-800 rounded-md font-semibold focus:ring-2 focus:ring-blue-300"
                        value={item.quantity}
                          onInput={(e) => {
    // parseInt retire automatiquement les 0 initiaux
    e.target.value = e.target.value.replace(/^0+/, '') || '1';
  }}
                        onChange={(e) => handleEdit(item.id, "quantity", Number(e.target.value))}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                      />

                      {/* Nom */}
                      <label htmlFor={`nom-${item.id}`} className="text-xs font-medium text-gray-600">
                        Nom
                      </label>
                      <input
                        id={`nom-${item.id}`}
                        type="text"
                        value={item.nom || ""}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          if (validateNom(val)) {
                            handleEdit(item.id, "nom", val);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        placeholder="MAJUSCULES, espaces, -"
                        className="col-span-1 border rounded px-2 py-1 bg-blue-50 text-blue-800 font-semibold focus:ring-2 focus:ring-blue-300"
                      />

                      {/* Numéro */}
                      <label htmlFor={`numero-${item.id}`} className="text-xs font-medium text-gray-600">
                        Numéro
                      </label>
                      <input
                        id={`numero-${item.id}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="1"
                        max="99"
                        value={item.numero || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || (Number(val) >= 1 && Number(val) <= 99)) {
                            handleEdit(item.id, "numero", val);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        placeholder="1-99"
                        className="col-span-1 border px-2 py-1 bg-green-50 text-green-800 rounded-md font-semibold focus:ring-2 focus:ring-green-300"
                      />
                    </div>

                    {/* Prix & totaux */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div>
                        Suppléments :{" "}
                        {item.supplement > 0 ? (
                          <span className="text-orange-600 font-medium">
                            {formatPrice.format(item.supplement)}
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <div className="font-bold text-blue-600">
                        Total : {formatPrice.format(item.total)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                 {!dirtyMap[item.id] ? (     <button
                        onClick={() => handleRemove(item.id)}
                        className="w-full sm:w-auto bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 active:scale-[.99] focus:ring-2 focus:ring-red-300"
                      >
                        Supprimer
                      </button>
                       ) : (
                        <button
                          onClick={() => handleSave(item)}
                          
                          className={`w-full sm:w-auto bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition ${
                            loadingId === item.id ? "opacity-50" : ""
                          }`}
                          disabled={loadingId === item.id}
                        >
                          {loadingId === item.id ? "Enregistrement..." : "Sauvegarder"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Vue desktop en tableau --- */}
              <div className="hidden lg:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Maillot</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Taille</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Quantité</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Nom</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Numéro</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Prix maillot</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Suppléments</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Total ligne</th>
                      <th className="p-3 lg:p-4 text-left text-xs lg:text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        {/* Maillot + image */}
                        <td className="p-3 lg:p-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-sm lg:text-base">
                                {item.club_name}, {item.maillot_name}
                              </p>
                            </div>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={`${item.club_name}, ${item.maillot_name}`}
                                className="w-14 h-14 lg:w-16 lg:h-16 object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>

                        {/* Taille */}
                        <td className="p-3 lg:p-4">
                          <label htmlFor={`size-d-${item.id}`} className="sr-only">Taille</label>
                          <select
                            id={`size-d-${item.id}`}
                            value={item.size}
                            onChange={(e) => handleEdit(item.id, "size", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                            className="border-none rounded-md px-2 py-1 bg-blue-100 text-blue-800 font-semibold focus:ring-2 focus:ring-blue-300"
                          >
                            {["S", "M", "L", "XL"].map((sz) => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </td>

                        {/* Quantité */}
                        <td className="p-3 lg:p-4">
                          <label htmlFor={`qty-d-${item.id}`} className="sr-only">Quantité</label>
                          <input
                            id={`qty-d-${item.id}`}
                            type="number"
                            min={1}
                            className="border-none w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-semibold focus:ring-2 focus:ring-blue-300"
                            value={item.quantity}
                              onInput={(e) => {
    // parseInt retire automatiquement les 0 initiaux
    e.target.value = e.target.value.replace(/^0+/, '') || '1';
  }}
                            onChange={(e) => handleEdit(item.id, "quantity", Number(e.target.value))}
                              onKeyDown={(e) => handleKeyDown(e, item)}
                          />
                        </td>

                        {/* Nom */}
                        <td className="p-3 lg:p-4">
                          <label htmlFor={`nom-d-${item.id}`} className="sr-only">Nom</label>
                          <input
                            id={`nom-d-${item.id}`}
                            type="text"
                            value={item.nom || ""}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase();
                              if (validateNom(val)) handleEdit(item.id, "nom", val);
                            }}  
                            onKeyDown={(e) => handleKeyDown(e, item)}
                            placeholder="NOM"
                            className="ml-0 lg:ml-2 border rounded px-2 py-1 w-28 lg:w-32 bg-blue-100 text-blue-800 font-semibold focus:ring-2 focus:ring-blue-300"
                          />
                        </td>

                        {/* Numéro */}
                        <td className="p-3 lg:p-4">
                          <label htmlFor={`num-d-${item.id}`} className="sr-only">Numéro</label>
                          <input
                            id={`num-d-${item.id}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="1"
                            max="99"
                            value={item.numero || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || (Number(val) >= 1 && Number(val) <= 99)) {
                                handleEdit(item.id, "numero", val);
                              }
                            }} 
                             onKeyDown={(e) => handleKeyDown(e, item)}
                            placeholder="Numéro"
                            className="border-none w-16 px-2 py-1 bg-green-100 text-green-800 rounded-md font-semibold focus:ring-2 focus:ring-green-300"
                          />
                        </td>

                        {/* Prix, supplément, total */}
                        <td className="p-3 lg:p-4 text-sm lg:text-base">
                          {formatPrice.format(item.priceNum)}
                        </td>
                        <td className="p-3 lg:p-4 text-sm lg:text-base">
                          {item.supplement > 0 ? (
                            <span className="text-orange-600">{formatPrice.format(item.supplement)}</span>
                          ) : ("-")}
                        </td>
                        <td className="p-3 lg:p-4 font-bold text-blue-600 text-sm lg:text-base">
                          {formatPrice.format(item.total)}
                        </td>

                        {/* Actions */}
                        <td className="p-3 lg:p-4">
                          <div className="flex flex-col xl:flex-row gap-2">
                {!dirtyMap[item.id] ? ( 
                              <button
                              onClick={() => handleRemove(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-300"
                            >
                              Supprimer
                            </button>
                             ) : (
                              <button
                                onClick={() => handleSave(item)}
                                  onKeyDown={(e) => handleKeyDown(e, item)}
                                className={`bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800 transition ${
                                  loadingId === item.id ? "opacity-50" : ""
                                }`}
                                disabled={loadingId === item.id}
                              >
                                {loadingId === item.id ? "Enregistrement..." : "Sauvegarder"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total & adresse */}
              <div className="p-4 sm:p-5 lg:p-6 bg-gray-50 border-t">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mb-4 md:mb-6">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    Total panier : {formatPrice.format(prixTotal)}
                  </div>
                  <button
                    onClick={handleClearCart}
                    className="self-start md:self-auto text-red-600 hover:text-red-800 underline focus:ring-2 focus:ring-red-400 rounded"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="mb-5 md:mb-6">
                  <h2 className="font-semibold mb-2 md:mb-3 text-base md:text-lg">Adresse de livraison</h2>

                  {shippingAddress ? (
                    <div
                      className="bg-yellow-50 border border-yellow-200 p-3 md:p-4 rounded-md"
                      role="region"
                      aria-label="Adresse par défaut"
                    >
                      <div className="font-medium">
                        {shippingAddress.first_name} {shippingAddress.last_name}
                      </div>
                      <div className="text-sm md:text-base">{shippingAddress.street}</div>
                      <div className="text-sm md:text-base">
                        {shippingAddress.postal_code} {shippingAddress.city}
                      </div>
                      <Link
                        href="/addresses"
                        className="text-blue-600 underline hover:text-blue-800 text-xs md:text-sm mt-2 inline-block"
                      >
                        Changer d'adresse
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 md:p-4">
                      <p className="text-yellow-800 mb-2 text-sm md:text-base">
                        Aucune adresse de livraison configurée
                      </p>
                      <Link href="/addresses" className="text-blue-600 underline hover:text-blue-800">
                        Ajouter une adresse
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={goToCheckout}
                  className="w-full block bg-gradient-to-r from-red-800 to-blue-500 text-white py-3 px-4 sm:px-6 rounded-md hover:opacity-95 focus:ring-2 focus:ring-blue-300 font-semibold text-base sm:text-lg transition-colors"
                >
                  Confirmer ma commande ({formatPrice.format(prixTotal)})
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
