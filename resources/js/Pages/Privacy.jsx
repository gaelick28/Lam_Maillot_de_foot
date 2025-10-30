import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Privacy() {
  return (
    <>
      <Head title="Confidentialité - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de confidentialité</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Collecte des données</h2>
                <p>Nous collectons les informations que vous nous fournissez directement lorsque vous :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Créez un compte sur notre site</li>
                  <li>Passez une commande</li>
                  <li>Vous abonnez à notre newsletter</li>
                  <li>Nous contactez via le formulaire de contact</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Utilisation des données</h2>
                <p>Vos données personnelles sont utilisées pour :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Traiter et livrer vos commandes</li>
                  <li>Vous fournir un service client de qualité</li>
                  <li>Vous informer des nouveautés et promotions</li>
                  <li>Améliorer notre site et nos services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Partage des données</h2>
                <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées avec :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nos prestataires de livraison</li>
                  <li>Nos processeurs de paiement</li>
                  <li>Les autorités légales si requis par la loi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p className="mt-2">Pour exercer ces droits, contactez-nous à : privacy@fou2foot.com</p>
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