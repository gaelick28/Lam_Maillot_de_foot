import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Returns() {
  return (
    <>
      <Head title="Retours - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de retours</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Délai de rétractation</h2>
                <p>Vous disposez d'un délai de <strong>30 jours</strong> à compter de la réception de votre colis pour retourner tout article qui ne vous conviendrait pas.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Conditions de retour</h2>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Pour être accepté, votre retour doit respecter les conditions suivantes :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>L'article doit être dans son état d'origine</li>
                    <li>Les étiquettes doivent être intactes</li>
                    <li>L'article ne doit pas avoir été porté ou lavé</li>
                    <li>L'emballage d'origine doit être inclus</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Procédure de retour</h2>
                <ol className="list-decimal list-inside space-y-2 bg-blue-50 p-4 rounded-lg">
                  <li>Connectez-vous à votre compte client</li>
                  <li>Accédez à l'historique de vos commandes</li>
                  <li>Sélectionnez la commande concernée</li>
                  <li>Suivez la procédure de retour en ligne</li>
                  <li>Imprimez l'étiquette de retour fournie</li>
                  <li>Déposez votre colis dans un point relais</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Remboursement</h2>
                <p>Une fois votre retour reçu et validé, votre remboursement sera traité sous <strong>5 à 10 jours ouvrables</strong>. Le montant remboursé correspond au prix d'achat de l'article. Les frais de livraison initiaux ne sont pas remboursés.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Échange</h2>
                <p>Vous pouvez également opter pour un échange. Dans ce cas, nous vous enverrons le nouvel article dès réception de votre retour.</p>
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