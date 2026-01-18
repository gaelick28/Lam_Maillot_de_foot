import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { router } from "@inertiajs/react";
import WishlistButton from "@/Components/WishlistButton";

export default function MaillotDetail({ maillot, tailles, stocks, quantite, prix, prix_numero, prix_nom }) {
  const [taille, setTaille] = useState(tailles[0]);
  const [qte, setQte] = useState(1);
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [personnalisation, setPersonnalisation] = useState({ numero: false, nom: false });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mobileZoom, setMobileZoom] = useState(false);

  // ✅ Obtenir le stock disponible pour la taille sélectionnée
  const stockDisponible = stocks[taille] || 0;

  // ✅ Gérer le changement de taille
  const handleTailleChange = (nouvelleTaille) => {
    setTaille(nouvelleTaille);
    const nouveauStock = stocks[nouvelleTaille] || 0;
    // Si la quantité actuelle dépasse le nouveau stock, on l'ajuste
    if (qte > nouveauStock) {
      setQte(nouveauStock > 0 ? nouveauStock : 1);
    }
  };

  // Validation identique à Panier.jsx pour le numéro
  const validateNumero = (val) => {
    if (val === "") return true;
    if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 99;
    }
    return false;
  };
  
 // Validation numéro : entre 1 et 99 uniquement
  const handleNumeroChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = parseInt(val, 10);
      if (val === "" || (num >= 1 && num <= 99)) {
        setNumero(val);
      }
    }
  };

    // Validation identique à Panier.jsx
    const validateNom = (val) => /^[A-ZÀÇÉÈÊËÏÄÜÖÔ'\s-]*$/.test(val);
  
    // Validation nom : lettres majuscules uniquement
  const handleNomChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (validateNom(val)) {
      setNom(val);
    }
  };

  // Calcul du supplément pour personnalisation
  const supplement =
    (personnalisation.numero && numero ? prix_numero : 0) +
    (personnalisation.nom && nom ? prix_nom : 0);

  // Multiplie bien par la quantité choisie
  const total = (prix + supplement) * parseInt(qte || 1, 10);

  function handleAddToCart() {
    router.post('/cart/add', {
      maillot_id: maillot.id,
      size: taille,
      quantity: qte,
      numero: personnalisation.numero ? numero : null,
      nom: personnalisation.nom ? nom : null,
    }, {
      onSuccess: () => alert("Maillot ajouté au panier !"), 
    });
  }

  // Gestion de l'effet loupe
  const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;

  setZoomPosition({ x, y });
};

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
          
          {/* Section image avec bouton wishlist */}
          <div className="flex-1 flex justify-center md:justify-start">
              <div
                className="relative w-full max-w-md overflow-hidden"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Image normale */}
                <img
                  src={`/${maillot.image}`}
                  alt={maillot.nom}
                  className="w-full rounded shadow"
                  onClick={() => setMobileZoom(true)}
                />

                {/* Effet loupe */}
                {showZoom && (
                  <div
                    className="absolute inset-0 rounded"
                    style={{
                      backgroundImage: `url(/${maillot.image})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "200%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                )}
                
                {/* Version mobile de l'effet zoom */}
            {mobileZoom && (
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center md:hidden">
                <img
                  src={`/${maillot.image}`}
                  alt={maillot.nom}
                  className="max-w-full max-h-full"
                />
                <button
                  className="absolute top-4 right-4 text-white text-3xl"
                  onClick={() => setMobileZoom(false)}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Wishlist */}
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton maillotId={maillot.id} />
            </div>
          </div>
        </div>

          <div className="flex-1">
  <div className="flex items-center gap-4 mb-2">
    {maillot.club?.logo && (
      <img
        src={`/${maillot.club.logo}`}
        alt={`Logo ${maillot.club.name}`}
        className="w-16 h-16 object-contain mix-blend-multiply"
      />
    )}
    <h1 className="text-3xl font-bold">{maillot.club?.name}</h1>
  </div>
  <h2 className="text-2xl font-semibold mb-4">{maillot.nom}</h2>
            <div className="mb-2">Prix : <span className="font-semibold">{prix} €</span></div>
            <div className="mb-2">Type : <span className="font-semibold">{maillot.type || "Maillot"}</span></div>
            
            {/* ✅ Affichage du stock total et du stock par taille */}
            <div className="mb-2">
              <span>Stock total : </span>
              <span className="font-semibold">{quantite}</span>
              {stockDisponible > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  (Taille {taille} : {stockDisponible} disponible{stockDisponible > 1 ? 's' : ''})
                </span>
              )}
              {stockDisponible === 0 && (
                <span className="ml-2 text-sm text-red-600 font-semibold">
                  (Taille {taille} : Rupture de stock)
                </span>
              )}
            </div>
            
            <div className="mb-2">
              Taille :
              <select 
                value={taille} 
                onChange={e => handleTailleChange(e.target.value)} 
                className="ml-2 border rounded px-2 py-1"
              >
                {tailles.map(t => (
                  <option key={t} value={t}>
                    {t} - {stocks[t] === 0 ? '(Rupture)' : `${stocks[t]} dispo`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-2">
              Quantité :
              <input
                type="number"
                min="1"
                max={stockDisponible}
                value={qte}
                 onInput={(e) => {
    e.target.value = e.target.value.replace(/^0+/, '') || '1';
  }}
                onChange={e => setQte(e.target.value)}
                className="ml-2 border rounded px-2 py-1 w-16"
                disabled={stockDisponible === 0}
              />
            </div>
            
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={personnalisation.numero}
                  onChange={e => setPersonnalisation(p => ({ ...p, numero: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un numéro (+{prix_numero} €)
          </label>
          {personnalisation.numero && (
            <input
                  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
                  value={numero}
                  onChange={handleNumeroChange}
                  placeholder="Numéro (1-99)"
                  className="ml-2 border rounded px-2 py-1 w-20"
                />
              )}
            </div>
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={personnalisation.nom}
                  onChange={e => setPersonnalisation(p => ({ ...p, nom: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un nom (+{prix_nom} €)
          </label>
          {personnalisation.nom && (
            <input
                  type="text"
                  value={nom}
                  onChange={handleNomChange}
                  placeholder="NOM"
                  className="ml-2 border rounded px-2 py-1 w-32"
                />

              )}
            </div>
            
            <div className="text-xl font-bold mt-4">Total : {total} €</div>
            
            {/* ✅ Bouton conditionnel selon le stock */}
            {stockDisponible > 0 ? (
              <button
                onClick={handleAddToCart}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-red-800 to-blue-500 text-white rounded shadow hover:bg-blue-900 transition-colors"
              >
                AJOUTER AU PANIER
              </button>
            ) : (
              <button
                disabled
                className="mt-6 px-6 py-2 bg-gray-400 text-white rounded shadow cursor-not-allowed"
              >
                RUPTURE DE STOCK - TAILLE {taille}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}