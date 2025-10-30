import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Terms() {
  return (
    <>
      <Head title="CGU/CGV - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Conditions Générales d'Utilisation et de Vente</h1>
            
            <div className="space-y-8 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 1 : OBJET</h2>
                <p>Les présentes conditions générales ont pour objet de définir les modalités de vente entre Fou2Foot et tout acheteur de produits via le site internet fou2foot.com.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 2 : PRODUITS</h2>
                <p>Les produits proposés à la vente sont ceux qui figurent sur le site fou2foot.com. Chaque produit est accompagné d'un descriptif. Les photographies sont aussi fidèles que possible mais ne peuvent assurer une parfaite similitude avec le produit vendu.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 3 : PRIX</h2>
                <p>Les prix de nos produits sont indiqués en euros toutes taxes comprises. Les frais de livraison sont calculés en fonction du poids du colis et du mode de livraison choisi.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 4 : COMMANDE</h2>
                <p>Le client passe commande via le site internet. La vente ne sera considérée comme définitive qu'après paiement complet de la commande et envoi d'un email de confirmation.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 5 : PAIEMENT</h2>
                <p>Le paiement s'effectue par carte bancaire via notre plateforme sécurisée. Les cartes acceptées sont : Carte Bleue, Visa, Mastercard, American Express.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 6 : LIVRAISON</h2>
                <p>Les délais de livraison sont indiqués lors de la commande. En cas de retard de livraison, le client sera informé par email.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">ARTICLE 7 : DROIT DE RÉTRACTATION</h2>
                <p>Conformément à la loi, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation.</p>
              </section>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}