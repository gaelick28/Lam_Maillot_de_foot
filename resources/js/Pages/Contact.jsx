import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Contact({ flash }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: 'Question sur un produit',
    message: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    post('/contact/send', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setShowSuccessModal(true);
      },
    });
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <Head title="Contact - Fou2Foot" />
      <Header />
      
      {/* ✅ MODAL DE CONFIRMATION */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Icône de succès */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Titre */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Message envoyé !
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-6">
                Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 heures.
              </p>
              
              {/* Bouton */}
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                      <p className="text-gray-600">admin@fou2foot.com</p>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Votre nom"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="votre@email.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={data.subject}
                      onChange={(e) => setData('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option>Question sur un produit</option>
                      <option>Problème de commande</option>
                      <option>Retour/Échange</option>
                      <option>Service client</option>
                      <option>Autre</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      rows="4"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Votre message..."
                      required
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer le message'
                    )}
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