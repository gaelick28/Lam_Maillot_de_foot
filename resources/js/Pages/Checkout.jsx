"use client";

import { usePage, router, Link } from "@inertiajs/react";
import React, { useMemo, useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// ✅ NOUVEAU : Composant Modal d'erreur de stock
function StockErrorModal({ stockIssues, onClose }) {
  if (!stockIssues || stockIssues.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center mb-4">
          <div className="p-3 bg-red-100 rounded-full mr-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stock insuffisant</h2>
            <p className="text-gray-600 text-sm">Certains articles ne sont plus disponibles</p>
          </div>
        </div>

        {/* Liste des articles en problème */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Les articles suivants n'ont pas assez de stock :
          </p>
          <div className="space-y-3">
            {stockIssues.map((issue, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-semibold text-red-800">{issue.message}</p>
                {issue.details && (
                  <p className="text-sm text-red-600 mt-1">{issue.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message d'aide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Suggestion :</strong> Retournez à votre panier pour ajuster les quantités ou supprimer les articles concernés.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Fermer
          </button>
          <Link
            href="/panier"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
          >
            Retour au panier
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const {
    items = [],
    subtotal = 0,
    supplements = 0,
    total = 0,
    shippingAddress = null,
    auth = {},
    stockIssues = [], // ✅ NOUVEAU : Récupérer les erreurs de stock
  } = usePage().props;

  const [processing, setProcessing] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false); // ✅ NOUVEAU : State pour la modal

  // Récupérer les adresses de facturation de l'utilisateur
  const billingAddresses = auth.user?.addresses?.filter(addr => addr.type === 'billing') || [];

  // Par défaut, sélectionner la première adresse de facturation
  useEffect(() => {
    if (billingAddresses.length > 0 && !selectedBillingId) {
      setSelectedBillingId(billingAddresses[0].id);
    }
  }, [billingAddresses, selectedBillingId]);

  // ✅ NOUVEAU : Afficher la modal automatiquement si erreurs de stock
  useEffect(() => {
    if (stockIssues && stockIssues.length > 0) {
      setShowStockModal(true);
    }
  }, [stockIssues]);

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    []
  );

  // Fallbacks côté client
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

  const handleProceedToPayment = () => {
    // ✅ NOUVEAU : Empêcher la validation si erreurs de stock
    if (stockIssues && stockIssues.length > 0) {
      setShowStockModal(true);
      return;
    }

    if (!shippingAddress) {
      alert("Veuillez d'abord renseigner votre adresse de livraison.");
      return;
    }
    if (!items.length) {
      alert("Votre panier est vide.");
      return;
    }

    // Déterminer l'adresse de facturation
    const billingId = sameAddress ? shippingAddress.id : selectedBillingId;

    if (!billingId) {
      alert("Veuillez sélectionner une adresse de facturation.");
      return;
    }

    setProcessing(true);

    router.post("/checkout/proceed", {
      shipping_address_id: shippingAddress.id,
      billing_address_id: billingId,
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

      {/* ✅ NOUVEAU : Modal d'erreur de stock */}
      {showStockModal && (
        <StockErrorModal 
          stockIssues={stockIssues} 
          onClose={() => setShowStockModal(false)}
        />
      )}

      <main className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Validation de la commande</h1>

          {/* ✅ NOUVEAU : Alerte visible si problème de stock */}
          {stockIssues && stockIssues.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-bold">⚠️ Attention : Stock insuffisant</p>
                  <p className="text-sm mt-1">
                    Vous ne pouvez pas finaliser cette commande. 
                    <button 
                      onClick={() => setShowStockModal(true)}
                      className="underline ml-1 font-medium hover:text-red-800"
                    >
                      Voir les détails
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

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

            {/* Adresses + Totaux */}
            <div className="space-y-6">
              {/* Adresse de livraison */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="font-semibold mb-2">Adresse de livraison</div>
                {shippingAddress ? (
                  <>
                    <div className="font-medium">
                      {shippingAddress.first_name} {shippingAddress.last_name}
                    </div>
                    <div>{shippingAddress.street}</div>
                    <div>{shippingAddress.postal_code} {shippingAddress.city}</div>
                    <div className="text-sm md:text-base">{shippingAddress.country}</div>
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

              {/* Adresse de facturation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-semibold mb-3">Adresse de facturation</div>
                
                {/* Case à cocher "Même adresse" */}
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Identique à l'adresse de livraison</span>
                </label>

                {/* Sélecteur d'adresse de facturation */}
                {!sameAddress && (
                  <>
                    {billingAddresses.length > 0 ? (
                      <select
                        value={selectedBillingId || ''}
                        onChange={(e) => setSelectedBillingId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {billingAddresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.title || `${addr.first_name} ${addr.last_name} - ${addr.city}`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Aucune adresse de facturation disponible.
                        <Link href="/addresses" className="text-blue-600 underline ml-1">
                          Ajouter une adresse
                        </Link>
                      </div>
                    )}

                    {/* Afficher l'adresse sélectionnée */}
                    {selectedBillingId && billingAddresses.length > 0 && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-sm">
                        {(() => {
                          const addr = billingAddresses.find(a => a.id === selectedBillingId);
                          if (!addr) return null;
                          return (
                            <>
                              <div className="font-medium">{addr.first_name} {addr.last_name}</div>
                              <div>{addr.street}</div>
                              <div>{addr.postal_code} {addr.city}</div>
                              <div>{addr.country}</div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Totaux */}
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

                {/* ✅ MODIFIÉ : Bouton désactivé si erreur de stock */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={processing || (stockIssues && stockIssues.length > 0)}
                  className={`w-full mt-4 text-white py-3 rounded-md focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed transition-colors ${
                    stockIssues && stockIssues.length > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-800 to-blue-500 hover:opacity-95 disabled:opacity-50'
                  }`}
                >
                  {stockIssues && stockIssues.length > 0 
                    ? '⚠️ Stock insuffisant - Retournez au panier'
                    : processing 
                      ? 'Chargement...' 
                      : 'Continuer vers le paiement →'
                  }
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