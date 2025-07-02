// "use client"

import { useState } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import Sidebar from "@/Components/Sidebar"

export default function AddressPage({ addresses = [] }) {
  const { url } = usePage()

  // SÉPARER les états d'édition
  const [editingBilling, setEditingBilling] = useState(null)
  const [editingShipping, setEditingShipping] = useState(null)

  // DEUX useForm SÉPARÉS avec les champs de votre table
  const billingForm = useForm({
    id: null,
    type: "billing", // ← TYPE FIXE
    first_name: "",
    last_name: "",
    street: "",
    city: "",
    postal_code: "",
    country: "FR",
    phone: "",
    is_default: false,
  })

  const shippingForm = useForm({
    id: null,
    type: "shipping", // ← TYPE FIXE
    first_name: "",
    last_name: "",
    street: "",
    city: "",
    postal_code: "",
    country: "FR",
    phone: "",
    is_default: false,
  })

  // FONCTIONS SÉPARÉES pour facturation
  const handleBillingSubmit = (e) => {
    e.preventDefault()

    // S'ASSURER que le type est bien "billing"
    billingForm.setData("type", "billing")

    if (editingBilling && editingBilling !== "new") {
      billingForm.put(`/addresses/${billingForm.data.id}`, {
        onSuccess: () => {
          setEditingBilling(null)
          billingForm.reset()
          billingForm.setData("type", "billing") // Remettre le type après reset
        },
      })
    } else {
      billingForm.post("/addresses", {
        onSuccess: () => {
          setEditingBilling(null)
          billingForm.reset()
          billingForm.setData("type", "billing") // Remettre le type après reset
        },
      })
    }
  }

  const handleBillingEdit = (address) => {
    setEditingBilling(address.id)
    billingForm.setData({ ...address, type: "billing" })
  }

  const handleBillingAddNew = () => {
    setEditingBilling("new")
    billingForm.reset()
    billingForm.setData("type", "billing")
  }

  const handleBillingCancel = () => {
    setEditingBilling(null)
    billingForm.reset()
    billingForm.setData("type", "billing")
  }

  // FONCTIONS SÉPARÉES pour livraison
  const handleShippingSubmit = (e) => {
    e.preventDefault()

    // S'ASSURER que le type est bien "shipping"
    shippingForm.setData("type", "shipping")

    if (editingShipping && editingShipping !== "new") {
      shippingForm.put(`/addresses/${shippingForm.data.id}`, {
        onSuccess: () => {
          setEditingShipping(null)
          shippingForm.reset()
          shippingForm.setData("type", "shipping") // Remettre le type après reset
        },
      })
    } else {
      shippingForm.post("/addresses", {
        onSuccess: () => {
          setEditingShipping(null)
          shippingForm.reset()
          shippingForm.setData("type", "shipping") // Remettre le type après reset
        },
      })
    }
  }

  const handleShippingEdit = (address) => {
    setEditingShipping(address.id)
    shippingForm.setData({ ...address, type: "shipping" })
  }

  const handleShippingAddNew = () => {
    setEditingShipping("new")
    shippingForm.reset()
    shippingForm.setData("type", "shipping")
  }

  const handleShippingCancel = () => {
    setEditingShipping(null)
    shippingForm.reset()
    shippingForm.setData("type", "shipping")
  }

  // FONCTIONS DE SUPPRESSION
  const handleBillingDelete = (id) => {
    if (confirm("Supprimer cette adresse de facturation ?")) {
      billingForm.delete(`/addresses/${id}`, {
        onSuccess: () => {
          billingForm.reset()
          billingForm.setData("type", "billing")
        },
      })
    }
  }

  const handleShippingDelete = (id) => {
    if (confirm("Supprimer cette adresse de livraison ?")) {
      shippingForm.delete(`/addresses/${id}`, {
        onSuccess: () => {
          shippingForm.reset()
          shippingForm.setData("type", "shipping")
        },
      })
    }
  }

  // Séparer les adresses par type
  const billingAddresses = addresses.filter((addr) => addr.type === "billing")
  const shippingAddresses = addresses.filter((addr) => addr.type === "shipping")

  return (
    <>
      <Head title="Mes adresses" />
      <Header />

      <div className="min-h-screen bg-gray-300 flex">
        <Sidebar currentRoute={url} />

        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes adresses</h1>

            {/* SECTION FACTURATION */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Adresse de facturation</h3>
                {billingAddresses.length === 0 && (
                  <button
                    onClick={handleBillingAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Ajouter facturation
                  </button>
                )}
              </div>

              {(editingBilling || billingAddresses.length === 0) && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <form onSubmit={handleBillingSubmit} className="space-y-6">
                    <div className="text-sm text-blue-600 mb-2">
                      📋 Formulaire de facturation (Type: {billingForm.data.type})
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                          value={billingForm.data.first_name}
                          onChange={(e) => billingForm.setData("first_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {billingForm.errors.first_name && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.first_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          value={billingForm.data.last_name}
                          onChange={(e) => billingForm.setData("last_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {billingForm.errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.last_name}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <textarea
                          value={billingForm.data.street}
                          onChange={(e) => billingForm.setData("street", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          rows="2"
                          required
                        />
                        {billingForm.errors.street && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.street}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                        <input
                          value={billingForm.data.postal_code}
                          onChange={(e) => billingForm.setData("postal_code", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {billingForm.errors.postal_code && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.postal_code}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <input
                          value={billingForm.data.city}
                          onChange={(e) => billingForm.setData("city", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {billingForm.errors.city && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          value={billingForm.data.phone}
                          onChange={(e) => billingForm.setData("phone", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {billingForm.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{billingForm.errors.phone}</p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={billingForm.data.is_default}
                          onChange={(e) => billingForm.setData("is_default", e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">Adresse par défaut</label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={billingForm.processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {billingForm.processing ? "Traitement..." : editingBilling !== "new" ? "Modifier" : "Ajouter"}
                      </button>
                      <button
                        type="button"
                        onClick={handleBillingCancel}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Liste adresses facturation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {billingAddresses.map((address) => (
                  <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                      Facturation
                    </span>
                    {address.is_default && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2 inline-block ml-2">
                        Par défaut
                      </span>
                    )}
                    <div className="space-y-2">
                      <p className="font-medium">
                        {address.first_name} {address.last_name}
                      </p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">
                        {address.postal_code} {address.city}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      {address.phone && <p className="text-gray-600">{address.phone}</p>}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleBillingEdit(address)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleBillingDelete(address.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION LIVRAISON */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Adresse de livraison</h3>
                {shippingAddresses.length === 0 && (
                  <button
                    onClick={handleShippingAddNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Ajouter livraison
                  </button>
                )}
              </div>

              {(editingShipping || shippingAddresses.length === 0) && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="text-sm text-green-600 mb-2">
                      🚚 Formulaire de livraison (Type: {shippingForm.data.type})
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                          value={shippingForm.data.first_name}
                          onChange={(e) => shippingForm.setData("first_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        {shippingForm.errors.first_name && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.first_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          value={shippingForm.data.last_name}
                          onChange={(e) => shippingForm.setData("last_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        {shippingForm.errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.last_name}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <textarea
                          value={shippingForm.data.street}
                          onChange={(e) => shippingForm.setData("street", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                          rows="2"
                          required
                        />
                        {shippingForm.errors.street && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.street}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                        <input
                          value={shippingForm.data.postal_code}
                          onChange={(e) => shippingForm.setData("postal_code", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        {shippingForm.errors.postal_code && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.postal_code}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <input
                          value={shippingForm.data.city}
                          onChange={(e) => shippingForm.setData("city", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        {shippingForm.errors.city && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          value={shippingForm.data.phone}
                          onChange={(e) => shippingForm.setData("phone", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                        {shippingForm.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{shippingForm.errors.phone}</p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={shippingForm.data.is_default}
                          onChange={(e) => shippingForm.setData("is_default", e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">Adresse par défaut</label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={shippingForm.processing}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {shippingForm.processing ? "Traitement..." : editingShipping !== "new" ? "Modifier" : "Ajouter"}
                      </button>
                      <button
                        type="button"
                        onClick={handleShippingCancel}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Liste adresses livraison */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shippingAddresses.map((address) => (
                  <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                      Livraison
                    </span>
                    {address.is_default && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block ml-2">
                        Par défaut
                      </span>
                    )}
                    <div className="space-y-2">
                      <p className="font-medium">
                        {address.first_name} {address.last_name}
                      </p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">
                        {address.postal_code} {address.city}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      {address.phone && <p className="text-gray-600">{address.phone}</p>}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleShippingEdit(address)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleShippingDelete(address.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
