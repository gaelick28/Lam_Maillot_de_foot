"use client";

import { usePage, router, Link } from "@inertiajs/react";
import React, { useMemo, useState } from "react"; // 🔥 AJOUT: useState
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Checkout() {
  const {
    items = [],
    subtotal = 0,
    supplements = 0,
    total = 0,
    shippingAddress = null,
  } = usePage().props;

  // 🔥 AJOUT: État pour gérer le processing
  const [processing, setProcessing] = useState(false);

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    []
  );

  // Fallbacks côté client si jamais le back renvoie 0
  const calcSubtotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 1)), 0),
    [items]
  );
  const calcSupplements = useMemo(
    () => items.reduce((s, it) => s + (Number(it.supplement_line ?? ((it.supplement_unit || 0) * (it.quantity || 1)))), 0),
    [items]
  );
  const showSubtotal    = subtotal    > 0 ? subtotal    : calcSubtotal;
  const showSupplements = supplements > 0 ? supplements : calcSupplements;
  const showTotal       = total       > 0 ? total       : (showSubtotal + showSupplements);

  // 🔥 MODIFICATION: Remplacer handleConfirm par handleProceedToPayment
  const handleProceedToPayment = () => {
    if (!shippingAddress) {
      alert("Veuillez d'abord renseigner votre adresse de livraison.");
      return;
    }
    if (!items.length) {
      alert("Votre panier est vide.");
      return;
    }

    setProcessing(true);

    // 🔥 MODIFICATION: Changer la route et les données envoyées
    router.post("/checkout/proceed", {
      shipping_address_id: shippingAddress.id,
      billing_address_id: shippingAddress.id, // Par défaut = même adresse
    }, {
      onFinish: () => setProcessing(false),
      onError: (errors) => {
        console.error('Erreur:', errors);
        alert('Erreur lors de la validation');
      }
    });
  };

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Validation de la commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Récap produits */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-3 border-b font-semibold">Récapitulatif des articles</div>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="text-left p-3">Article</th>
                      <th className="text-left p-3">Taille</th>
                      <th className="text-left p-3">Quantité</th>
                      <th className="text-left p-3">Nom</th>
                      <th className="text-left p-3">Numéro</th>
                      <th className="text-left p-3">Prix</th>
                      <th className="text-left p-3">Supplément</th>
                      <th className="text-left p-3">Total ligne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => {
                      const qty   = Number(it.quantity || 1);
                      const unit  = Number(it.price || 0);
                      const suppU = Number(it.supplement_unit || 0);
                      const suppL = Number(it.supplement_line ?? (suppU * qty));
                      const line  = (unit * qty) + suppL;

                      return (
                        <tr key={it.id} className="border-b">
                          <td className="p-3">
  <div className="flex items-center gap-3">
    {it.image && (
      <img
        src={it.image}
        alt={it.title || [it.club_name, it.maillot_name].filter(Boolean).join(", ") || "Maillot"}
        className="w-12 h-12 object-cover rounded"
      />
    )}
    <div className="text-sm">
      <div className="font-medium">
        {it.title || [it.club_name, it.maillot_name].filter(Boolean).join(", ") || "Maillot"}
      </div>
    </div>
  </div>
</td>

                          <td className="p-3">{it.size}</td>
                          <td className="p-3">{qty}</td>
                          <td className="p-3">{it.nom || "-"}</td>
                          <td className="p-3">{it.numero || "-"}</td>
                          <td className="p-3">{fmt.format(unit)}</td>
                          <td className="p-3">{suppU ? fmt.format(suppU) : "-"}</td>
                          <td className="p-3 font-semibold text-blue-700">{fmt.format(line)}</td>
                        </tr>
                      );
                    })}
                    {!items.length && (
                      <tr><td className="p-4 text-gray-500" colSpan={8}>Aucun article.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Adresse + Totaux */}
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="font-semibold mb-2">Adresse de livraison</div>
                {shippingAddress ? (
                  <>
                    <div className="font-medium">
                      {shippingAddress.first_name} {shippingAddress.last_name}
                    </div>
                    <div>{shippingAddress.street}</div>
                    <div>{shippingAddress.postal_code} {shippingAddress.city}</div>
                    <div className="text-sm md:text-base">
  {shippingAddress.country}
</div>
                    <Link href="/addresses" className="text-blue-600 underline mt-2 inline-block">
                      Modifier l'adresse
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-yellow-800">Aucune adresse de livraison configurée.</div>
                    <Link href="/addresses" className="text-blue-600 underline mt-2 inline-block">
                      Ajouter une adresse
                    </Link>
                  </>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{fmt.format(showSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Suppléments</span>
                  <span>{fmt.format(showSupplements)}</span>
                </div>
                <div className="border-top mt-3 pt-3 font-bold flex items-center justify-between">
                  <span>Total à payer</span>
                  <span className="text-blue-700">{fmt.format(showTotal)}</span>
                </div>

                {/* 🔥 MODIFICATION: Bouton et onClick changés */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={processing}
                  className="w-full mt-4 bg-gradient-to-r from-red-800 to-blue-500 text-white py-3 rounded-md hover:opacity-95 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Chargement...' : `Continuer vers le paiement →`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}