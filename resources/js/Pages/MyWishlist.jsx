"use client"

import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import Sidebar from "@/Components/Sidebar"

// Icônes SVG
const HeartIcon = ({ className, filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

export default function Wishlist({ wishlistItems = [], user }) {
  const [removingItem, setRemovingItem] = useState(null)

  const handleRemoveFromWishlist = async (maillotId) => {
    if (!confirm("Supprimer cet article de votre liste de souhaits ?")) return;

    setRemovingItem(maillotId);

    try {
      const response = await fetch(`/api/wishlist/remove/${maillotId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (response.ok) {
        // Recharger la page pour mettre à jour la liste
        router.reload();
      } else {
        alert('Erreur lors de la suppression');
        setRemovingItem(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
      setRemovingItem(null);
    }
  }

  const handleClearWishlist = async () => {
    if (!confirm("Vider complètement votre liste de souhaits ?")) return;

    try {
      const response = await fetch('/wishlist/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (response.ok) {
        router.reload();
      } else {
        alert('Erreur lors du vidage');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du vidage');
    }
  }

  return (
    <>
      <Head title="Ma liste de souhaits" />
      <Header />

      <div className="min-h-screen bg-gray-300 flex">
        <Sidebar currentRoute="/mywishlist" />

        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            {/* Message de bienvenue */}
            {user && (
              <div className="bg-blue-300 p-4 rounded shadow mb-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user.username} !</h2>
                <p className="text-sm text-gray-600">Votre Email : {user.email}</p>
              </div>
            )}

            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <HeartIcon className="w-8 h-8 text-red-500" filled aria-hidden="true" />
                <h1 className="text-3xl font-bold text-gray-900">Ma liste de souhaits</h1>
              </div>
              <p className="text-gray-600" aria-live="polite">
                {wishlistItems.length > 0
                  ? `${wishlistItems.length} article${wishlistItems.length > 1 ? "s" : ""} dans votre liste de souhaits`
                  : "Votre liste de souhaits est vide"}
              </p>
            </div>

            {wishlistItems.length === 0 ? (
              /* État vide */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre liste de souhaits est vide</h3>
                <p className="text-gray-600 mb-6">
                  Découvrez nos produits et ajoutez vos articles préférés à votre liste de souhaits
                </p>
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              /* Liste des articles */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                      removingItem === item.maillot.id ? "opacity-50 scale-95" : "hover:shadow-md"
                    }`}
                  >
                    {/* Image du produit */}
                    <div className="relative">
                      <Link href={`/maillots/${item.maillot.id}`} aria-label={`Voir le produit ${item.maillot.nom}`}>
                        <img
                          src={`/${item.maillot.image}`}
                          alt={item.maillot.nom}
                          className="w-full h-48 object-cover"
                        />
                      </Link>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.maillot.id)}
                        disabled={removingItem === item.maillot.id}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        aria-label={`Supprimer ${item.maillot.nom} de la liste de souhaits`}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Informations du produit */}
                    <div className="p-4">
                      {/* Nom du produit */}
                      <Link
                        href={`/maillots/${item.maillot.id}`}
                        className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2"
                        aria-label={`Voir les détails de ${item.maillot.nom}`}
                      >
                        {item.maillot.nom}
                      </Link>

                      {/* Club */}
                      <p className="text-sm text-gray-500 mb-2">{item.maillot.club_name}</p>

                      {/* Prix */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {item.maillot.price}€
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Link
                          href={`/maillots/${item.maillot.id}`}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                          aria-label={`Voir les détails de ${item.maillot.nom}`}
                        >
                          Voir le produit
                        </Link>
                      </div>

                      {/* Date d'ajout */}
                      <p className="text-xs text-gray-400 mt-3">
                        Ajouté le {new Date(item.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions en bas */}
            {wishlistItems.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Actions rapides</h3>
                    <p className="text-sm text-gray-600">Gérez votre liste de souhaits</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClearWishlist}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                      aria-label="Vider complètement la liste de souhaits"
                    >
                      Vider la liste
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}