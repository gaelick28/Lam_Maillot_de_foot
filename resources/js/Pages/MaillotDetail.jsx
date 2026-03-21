import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { router } from "@inertiajs/react";
import WishlistButton from "@/Components/WishlistButton";

export default function MaillotDetail({ maillot, tailles, stocks, quantite, prix, prix_numero, prix_nom }) {
// FORCER la conversion en nombres
  const prixNum = Number(prix);
  const prixNumeroNum = Number(prix_numero);
  const prixNomNum = Number(prix_nom);

  const [taille, setTaille] = useState(tailles[0]);
  const [qte, setQte] = useState(1);
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [personnalisation, setPersonnalisation] = useState({ numero: false, nom: false, ligue1: false, champions: false, uefa: false });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mobileZoom, setMobileZoom] = useState(false);
  const [showTooltipNom, setShowTooltipNom] = useState(false);
  const [showTooltipNumero, setShowTooltipNumero] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [maillot.image, ...(maillot.image_dos ? [maillot.image_dos] : [])];
  const [activeTab, setActiveTab] = useState('description');
  const [showTooltipTaille, setShowTooltipTaille] = useState(false);

  //  Obtenir le stock disponible pour la taille sélectionnée
  const stockDisponible = stocks[taille] || 0;

  //  Gérer le changement de taille
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
    const validateNom = (val) => /^[A-ZÀÂÇÉÈÊËÎÏÙÛÜŸÔŒÆÁÓÚÑÃÕÄÖØÅČŠŽĆĐŁ'\s-]*$/.test(val);
  
    // Validation nom : lettres majuscules uniquement
  const handleNomChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (validateNom(val)&& val.length <= 25) {
      setNom(val);
    }
  };

  // Calcul du supplément pour personnalisation
  const patchSupplement = maillot.club?.patches
    ? maillot.club.patches.reduce((acc, patch) => {
        return acc + (personnalisation[`patch_${patch.id}`] ? Number(patch.prix) : 0);
    }, 0)
    : 0;

const supplement =
    (personnalisation.numero && numero ? prixNumeroNum : 0) +
    (personnalisation.nom && nom ? prixNomNum : 0) +
    patchSupplement;

  // Multiplie bien par la quantité choisie
  const quantiteNumerique = parseInt(qte, 10) || 1;
  const total = (prixNum + supplement) * quantiteNumerique;
  
  function handleAddToCart() {
    router.post('/cart/add', {
      maillot_id: maillot.id,
      size: taille,
      quantity: qte,
      numero: personnalisation.numero ? numero : null,
      nom: personnalisation.nom ? nom : null,
      patches: maillot.club.patches
          .filter(patch => personnalisation[`patch_${patch.id}`])
          .map(patch => patch.id),
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
          <div className="flex-1 flex flex-col justify-center md:justify-start">
            <div
              className="relative w-full max-w-md overflow-hidden group"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Image active */}
              <img
                src={`/${images[currentImage]}`}
                alt={currentImage === 0 ? maillot.nom : `${maillot.nom} - dos`}
                className="w-full rounded shadow"
                onClick={() => setMobileZoom(true)}
              />

              {/* Effet loupe */}
              {showZoom && (
                <div
                  className="absolute inset-0 rounded"
                  style={{
                    backgroundImage: `url(/${images[currentImage]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200%",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              )}

              {/* Wishlist */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity">
                <WishlistButton maillotId={maillot.id} />
              </div>

              {/* Flèches carrousel — uniquement si image_dos existe */}
              {maillot.image_dos && (
                <>
                  <button
                    onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center shadow transition z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Image précédente"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center shadow transition z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Image suivante"
                  >
                    ›
                  </button>

                 
                </>
              )}

              {/* Zoom mobile */}
              {mobileZoom && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center md:hidden">
                  <img
                    src={`/${images[currentImage]}`}
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
            </div>
            {/* Miniatures de navigation */}
              {maillot.image_dos && (
                <div className="flex gap-2 mt-3 justify-center w-full max-w-md">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`border-2 rounded overflow-hidden transition ${
                        currentImage === index ? 'border-blue-500' : 'border-transparent hover:border-gray-400'
                      }`}
                      aria-label={index === 0 ? 'Face' : 'Dos'}
                    >
                      <img
                        src={`/${img}`}
                        alt={index === 0 ? `${maillot.nom} - face` : `${maillot.nom} - dos`}
                        className="w-16 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
          </div>



          <div className="flex-1">
  <div className="flex items-center gap-4 mb-2">
    {maillot.club?.logo && (
     <a href={`/clubs/${maillot.club.slug}/maillots`}>
    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <img
            src={`/${maillot.club.logo}`}
            alt={`Logo ${maillot.club.name}`}
            className="w-full h-full object-contain"
        />
    </div>
</a>
    )}

 {/* //Ou versiontransparente avec le mix-blend-multiply//      */}
 {/* {maillot.club?.logo && (
    <img
        src={`/${maillot.club.logo}`}
        alt={`Logo ${maillot.club.name}`}
        className="w-16 h-16 object-contain mix-blend-multiply"
      /> 
       )} */}
     


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
              <span
    className="relative inline-block ml-2"
    onMouseEnter={() => setShowTooltipTaille(true)}
    onMouseLeave={() => setShowTooltipTaille(false)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 cursor-pointer text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth={3} />
      <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" strokeWidth={2} />
    </svg>
    {showTooltipTaille && (
      <div className="absolute left-6 top-0 z-20 w-56 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm text-gray-700">
        <ul className="space-y-1">
          <li>S – 168 / 173 cm</li>
          <li>M – 173 / 178 cm</li>
          <li>L – 178 / 183 cm</li>
          <li>XL – 183 / 188 cm</li>
          <li>XXL – 188 / 193 cm</li>
        </ul>
      </div>
    )}
  </span>
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
                onChange={(e) => {
  const value = e.target.value;
  const numValue = parseInt(value, 10);
  
  // Si vide, mettre 1
  if (value === '' || isNaN(numValue)) {
    setQte(1);
    return;
  }
  
  // Limiter entre 1 et le stock disponible
  if (numValue < 1) {
    setQte(1);
  } else if (numValue > stockDisponible) {
    setQte(stockDisponible);
    alert(`Stock maximum disponible : ${stockDisponible} pour la taille ${taille}`);
  } else {
    setQte(numValue);
  }
}}
                className="ml-2 border rounded px-2 py-1 w-16"
                disabled={stockDisponible === 0}
              />
            </div>
            
            {/* NUMÉRO */}
            <div className="mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={personnalisation.numero}
                  onChange={e => setPersonnalisation(p => ({ ...p, numero: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un numéro (+{prix_numero} €)

                <span
                  className="relative inline-block"
                  onMouseEnter={() => setShowTooltipNumero(true)}
                  onMouseLeave={() => setShowTooltipNumero(false)}
                >
                 {/* i entouré d'un cercle pour information numérotation */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 cursor-pointer text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth={3} />
                    <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" strokeWidth={2} />
                  </svg>

                  {showTooltipNumero && (
                    <div className="absolute left-6 top-0 z-20 w-52 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                       
                        Numérotation de <strong>1</strong> à <strong>99</strong>
                      </ul>
                    </div>
                  )}
                </span>
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

            {/* NOM */}
            <div className="mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={personnalisation.nom}
                  onChange={e => setPersonnalisation(p => ({ ...p, nom: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un nom (+{prix_nom} €)

                <span
                  className="relative inline-block"
                  onMouseEnter={() => setShowTooltipNom(true)}
                  onMouseLeave={() => setShowTooltipNom(false)}
                >
                  {/* i entouré d'un cercle pour information nom */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 cursor-pointer text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth={3} />
                    <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" strokeWidth={2} />
                  </svg>

                  {showTooltipNom && (
                    <div className="absolute left-6 top-0 z-20 w-64 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Lettres majuscules uniquement</li>
                        <li>Accents autorisés (É,Ë,Ï, Ñ, Ø…)</li>
                        <li>Tiret <strong>-</strong> et apostrophe <strong>'</strong> acceptés</li>
                        <li>Maximum : <strong>25 caractères</strong></li>
                      </ul>
                    </div>
                  )}
                </span>
              </label>

              {personnalisation.nom && (
                <div className="mt-1">
                  <input
                    type="text"
                    value={nom}
                    onChange={handleNomChange}
                    placeholder="NOM"
                    maxLength={25}
                    className="ml-2 border rounded px-2 py-1 w-48"
                  />
                  <span className={`ml-2 text-sm ${nom.length >= 23 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    {nom.length}/25
                  </span>
                </div>
              )}
            </div>

          {/* PATCHS */}
{maillot.club?.patches?.length > 0 && (
    <div className="mb-2 mt-3 border-t pt-3">
        <p className="font-medium mb-2">Ajouter un patch :</p>
        {maillot.club.patches.map(patch => (
            <label key={patch.id} className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    checked={personnalisation[`patch_${patch.id}`] || false}
                    onChange={e => setPersonnalisation(p => ({ ...p, [`patch_${patch.id}`]: e.target.checked }))}
                    className="mr-2"
                />
                {patch.nom} (+{patch.prix} €)
            </label>
        ))}
    </div>
)}

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
          

        {/* Description */}
      {/* Onglets */}
<div className="mt-14">
    {/* Navigation onglets */}
    <div className="flex border-b border-gray-300" role="tablist">
        <button
        role="tab"
        aria-selected={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
            className={`px-4 py-2 text-base font-medium ${activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Description
        </button>
        <button
        role="tab"
        aria-selected={activeTab === 'infos'}
            onClick={() => setActiveTab('infos')}
            className={`px-4 py-2 text-base font-medium ${activeTab === 'infos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Informations complémentaires
        </button>
    </div>

    {/* Contenu onglets */}
    <div role="tabpanel" className="pt-4 text-base text-gray-700">
        {activeTab === 'description' && (
            <p className="leading-relaxed text-justify">
                {maillot.description ? maillot.description : (
                    <>
                        {[
                            `Maillot ${maillot.nom}`,
                            maillot.club?.name ? `de l'équipe de ${maillot.club.name}` : null,
                            maillot.badge ? `— ${maillot.badge}` : null,
                        ].filter(Boolean).join(' ')}
                        {'. '}
                        {tailles.length > 0 ? `Disponible en ${tailles.join(', ')}.` : 'Actuellement en rupture de stock.'}
                    </>
                )}
            </p>
        )}
        {activeTab === 'infos' && (
            <table className="w-full">
                <tbody>
                    <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-700 w-1/3">Poids</td>
                        <td className="py-2">0.25 kg</td>
                    </tr>
                </tbody>
            </table>
        )}
    </div>
</div>
      </div>
      </div>
      </main>
      <Footer />
    </>
  );
}