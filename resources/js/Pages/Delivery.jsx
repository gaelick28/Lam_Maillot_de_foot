import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Delivery() {
  return (
    <>
      <Head title="Livraisons - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Informations livraison</h1>
            
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Délais de livraison</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span><strong>France métropolitaine :</strong> 2-4 jours ouvrables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span><strong>Union Européenne :</strong> 5-7 jours ouvrables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span><strong>International :</strong> 7-14 jours ouvrables</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Frais de livraison</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Zone</th>
                        <th className="text-left py-2">Frais standard</th>
                        <th className="text-left py-2">Livraison express</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">France</td>
                        <td className="py-2">4,90 €</td>
                        <td className="py-2">9,90 €</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">UE</td>
                        <td className="py-2">9,90 €</td>
                        <td className="py-2">19,90 €</td>
                      </tr>
                      <tr>
                        <td className="py-2">International</td>
                        <td className="py-2">14,90 €</td>
                        <td className="py-2">29,90 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Suivi de commande</h2>
                <p>Une fois votre commande expédiée, vous recevrez un email de confirmation avec un numéro de suivi. Vous pourrez suivre l'acheminement de votre colis en temps réel.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Retard de livraison</h2>
                <p>En cas de retard exceptionnel, notre service client vous contactera personnellement. Les délais indiqués sont des délais moyens et peuvent varier selon la période de l'année.</p>
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