import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Legal() {
  return (
    <>
      <Head title="Mentions légales - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-r from-red-500 to-blue-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-purple-200 to-blue-100 rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mentions légales</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Éditeur du site</h2>
                <p><strong>Fou2Foot</strong></p>
                <p>Société par actions simplifiée au capital de 10 000 €</p>
                <p>RCS Paris 123 456 789</p>
                <p>Siège social : 123 Avenue du Football, 69002 Lyon</p>
                <p>Téléphone : 06 13 06 27 30</p>
                <p>Email : contact@fou2foot.com</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Directeur de la publication</h2>
                <p>Monsieur Philippe Diandet, Président</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Hébergement</h2>
                <p><strong>OVH Cloud</strong></p>
                <p>107 crs Charlemagne - 69002 Lyon - France</p>
                <p>Téléphone : 1007</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Propriété intellectuelle</h2>
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Données personnelles</h2>
                <p>Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion des commandes et à la relation client. Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent.</p>
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