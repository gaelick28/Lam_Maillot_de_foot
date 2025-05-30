import React from 'react';
import { Link } from '@inertiajs/react';
import { GiSoccerBall } from 'react-icons/gi';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function OrderHistory() {
  // Données mockées
  const orders = [
    {
      id: '#789456',
      date: '15 mars 2024',
      items: 3,
      total: 149.90,
      status: 'Livré',
      itemsDetails: [
        { name: 'Maillot domicile OL 2024', size: 'XL', quantity: 1, price: 89.90 },
        { name: 'Maillot extérieur OL 2025', size: 'L', quantity: 2, price: 30.00 }
      ],
      shippingAddress: '12 Rue de Gerland, 69007 Lyon'
    },
    {
      id: '#123456',
      date: '10 février 2024',
      items: 2,
      total: 199.90,
      status: 'Expédié',
      itemsDetails: [
        { name: 'Maillot extérieur BORDEAUX 2025', size: '42', quantity: 1, price: 159.90 },
        { name: 'Maillot domicile BORDEAUX 2025', size: '40-43', quantity: 1, price: 40.00 }
      ],
      shippingAddress: '5 Avenue des ports, 06210 Mandelieu',
      trackingNumber: '1Z2345X6789123456'
    }
  ];

  return (
    <>
   
    <Header />       
    
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <GiSoccerBall className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Historique des commandes</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune commande trouvée</p>
              <Link 
                href="/boutique" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Commencer mes achats
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-gray-300 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Commande {order.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Livré' ? 'bg-green-100 text-green-800' :
                        order.status === 'Expédié' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-gray-900 font-medium">{order.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Détails des articles */}
                    <div>
                      <h4 className="font-medium mb-4">Articles ({order.items})</h4>
                      <div className="space-y-4">
                        {order.itemsDetails.map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg" />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Taille: {item.size} · Quantité: {item.quantity}
                              </p>
                              <p className="text-sm font-medium mt-1">{item.price.toFixed(2)}€</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informations de livraison */}
                    <div>
                      <h4 className="font-medium mb-4">Adresse de livraison</h4>
                      <p className="text-black">{order.shippingAddress}</p>
                      
                      {order.trackingNumber && (
                        <div className="mt-6">
                          <p className="text-sm font-medium mb-2">Suivi de colis</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={order.trackingNumber}
                              readOnly
                              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                              Suivre
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    <Footer /></>
  );
}