"use client"

import { useEffect, useState } from "react"
import { Link, usePage } from "@inertiajs/react"

export default function PanierLink() {
  const [cartCount, setCartCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = usePage().props

  // Fonction pour récupérer le nombre d'articles depuis le serveur
  const fetchCartCount = async () => {
    try {
      setIsLoading(true)

      // Vérifier si l'utilisateur est connecté
      if (!auth?.user) {
        setCartCount(0)
        return
      }

      const response = await fetch("/panier/count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
        credentials: "same-origin",
      })

      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count || 0)
      } else {
        setCartCount(0)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du compteur panier:", error)
      setCartCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCartCount()

    // Écouter les événements personnalisés pour mettre à jour le compteur
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    const handleFocus = () => {
      fetchCartCount()
    }

    window.addEventListener("cart-updated", handleCartUpdate)
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("focus", handleFocus)
    }
  }, [auth?.user?.id])

  return (
    <Link
      href="/panier"
      className="relative hover:text-blue-200 transition-colors text-black flex items-center gap-2"
      aria-label={`Panier (${cartCount} articles)`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {isLoading ? (
        <span className="bg-gray-400 text-white rounded-full px-2 py-1 text-xs animate-pulse">...</span>
      ) : (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors ${
            cartCount > 0 ? "bg-red-500 text-white" : "bg-gray-300 text-gray-600"
          }`}
          aria-hidden="true"
        >
          {cartCount}
        </span>
      )}
    </Link>
  )
}
