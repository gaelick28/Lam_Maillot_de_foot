"use client"

import { usePage, router, Link } from "@inertiajs/react"
import React, { useState, useEffect } from "react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function Panier() {
  const { auth, cartItems: initialCartItems = [] } = usePage().props
  const user = auth?.user
  const address = user?.billingAddress || user?.adresse || {}

  // Prix fixes pour le supplément :
  const nomPrix = 3
  const numeroPrix = 2
  

  // État local modifiable
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [loadingId, setLoadingId] = useState(null)

  // A l'initialisation, on recalcule tous les suppléments et totaux
  useEffect(() => {
  setCartItems(items =>
    items.map(item => {
      let supplement = 0;
      if(item.nom) supplement += nomPrix;
      if(item.numero) supplement += numeroPrix;
      const prixMaillot = parseFloat(item.price) || 0; // <--- ICI
      const quantity = parseInt(item.quantity) || 1;
      const total = (prixMaillot + supplement) * quantity;
      return { 
        ...item, 
        priceNum: prixMaillot, // << stocke la version numérique !
        supplement, 
        total 
      }
    })
  )
}, [])



  // Total global du panier (somme des totaux lignes)
  const prixTotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0)

  // Gestion commande :
  function handleOrder() {
    router.post(
      "/api/commande",
      {
        items: cartItems,
        user_id: user.id,
        adresse_id: address?.id,
      },
      {
        onSuccess: () => {
          alert("Commande passée ! 🎉")
          router.visit("/order")
        },
      },
    )
  }

  // Suppression d'un article :
  function handleRemove(itemId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?")) {
      router.delete(`/panier/item/${itemId}`, {
        onSuccess: () => {
          setCartItems(items => items.filter(i => i.id !== itemId))
        },
      })
    }
  }

  // Edition dynamique des champs + recalcul du supplément et total
  function handleEdit(itemId, field, value) {
  setCartItems(prev =>
    prev.map(i => {
      if (i.id !== itemId) return i
      const updatedNom = field === "nom" ? value : (i.nom || "");
      const updatedNumero = field === "numero" ? value : (i.numero || "");
      let supplement = 0;
      if(updatedNom) supplement += nomPrix;
      if(updatedNumero) supplement += numeroPrix;
      const quantity = field === "quantity" ? value : i.quantity || 1;
      // SAUVEGARDE numérique:
      const prixMaillot = i.priceNum || parseFloat(i.price) || 0;
      const total = (prixMaillot + supplement) * quantity;
      return {
        ...i,
        [field]: value,
        supplement,
        total,
        priceNum: prixMaillot
      }
    })
  )
}


  // sauvegarde côté serveur)
  function handleSave(item) {
    setLoadingId(item.id)
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
        onSuccess: () => setLoadingId(null),
        onError: () => setLoadingId(null),
      }
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Mon panier</h1>
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 bg-white rounded-lg p-8 shadow-md">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 17a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-lg mb-4">Votre panier est vide</p>
              <Link href="/" className="text-blue-700 underline hover:text-blue-900">
                Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="p-4 text-left font-semibold">Maillot</th>
                      <th className="p-4 text-left font-semibold">Taille</th>
                      <th className="p-4 text-left font-semibold">Quantité</th>
                      <th className="p-4 text-left font-semibold">Nom</th>
                      <th className="p-4 text-left font-semibold">Numéro</th>
                      <th className="p-4 text-left font-semibold">Prix maillot</th>
                      <th className="p-4 text-left font-semibold">Suppléments</th>
                      <th className="p-4 text-left font-semibold">Total ligne</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        {/* Nom du maillot + image */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {item.club_name}, {item.maillot_name}
                              </p>
                            </div>
                            {item.image && (
                              <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-md" />
                            )}
                          </div>
                        </td>
                        {/* Taille éditable */}
                        <td className="p-4">
                          <select
                            value={item.size}
                            onChange={e => handleEdit(item.id, "size", e.target.value)}
                            className="border-none rounded-md px-2 py-1 bg-blue-100 text-blue-800 font-semibold focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
                          >
                            {["S","M","L","XL"].map(sz => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            min={1}
                            className="border-none w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-semibold focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
                            value={item.quantity}
                            onChange={e => handleEdit(item.id, "quantity", Number(e.target.value))}
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            className="border-none w-24 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-semibold focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
                            value={item.nom || ''}
                            onChange={e => handleEdit(item.id, "nom", e.target.value)}
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            min={0}
                            max={99}
                            className="border-none w-16 px-2 py-1 bg-green-100 text-green-800 rounded-md font-semibold focus:ring-2 focus:ring-green-300 shadow-sm transition-all"
                            value={item.numero || ''}
                            onChange={e => handleEdit(item.id, "numero", e.target.value)}
                          />
                        </td>
                        {/* Prix maillot */}
                       <td className="p-4">{Number(item.priceNum).toFixed(0)} €</td>
                        {/* Suppléments */}
                        <td className="p-4">
  {item.supplement > 0
    ? <span className="text-orange-600">{Number(item.supplement).toFixed(2)} €</span>
    : "-"}
</td>
                        {/* Total ligne */}
                     <td className="p-4 font-bold text-blue-600">{Number(item.total).toFixed(2)} €</td>
                        {/* Actions */}
                        <td className="p-4 space-x-2 flex flex-col md:flex-row">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Total & autres actions */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-bold text-gray-900"> Total panier : {Number(prixTotal).toFixed(2)} €</div>
                  <button
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir vider complètement votre panier ?")) {
                        router.post("/panier/clear")
                        setCartItems([])
                      }
                    }}
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Vider le panier
                  </button>
                </div>
                <div className="mb-6">
                  <h2 className="font-semibold mb-3 text-lg">Adresse de livraison/facturation</h2>
                  {address && address.street ? (
                    <div className="bg-white p-4 rounded-md border">
                      <div className="font-medium">
                        {user.firstname} {user.lastname}
                      </div>
                      <div>{address.street}</div>
                      <div>
                        {address.city} {address.postalCode}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-800 mb-2">Aucune adresse de livraison configurée</p>
                      <Link href="/addresses" className="text-blue-600 underline hover:text-blue-800">
                        Ajouter une adresse
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleOrder}
                  disabled={!address || !address.street}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                >
                  Confirmer ma commande ({Number(prixTotal).toFixed(2)} €)
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
