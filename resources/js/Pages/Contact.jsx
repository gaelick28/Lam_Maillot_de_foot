import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Contact() {
  return (
    <>
      <Head title="Contact - Fou2Foot" />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contactez-nous</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations de contact */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">contact@fou2foot.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3">📞</span>
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p className="text-gray-600">06 13 06 27 30</p>
                      <p className="text-sm text-gray-500">Lun-Ven : 9h-18h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3">🏢</span>
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p className="text-gray-600">101 Avenue Bernard Lacombe,</p>
                      <p className="text-gray-600"> 69002 Lyon France</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Réponse garantie</h3>
                  <p className="text-sm text-blue-700">Notre équipe s'engage à vous répondre sous 24 heures ouvrées.</p>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Formulaire de contact</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Question sur un produit</option>
                      <option>Problème de commande</option>
                      <option>Retour/Échange</option>
                      <option>Service client</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
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