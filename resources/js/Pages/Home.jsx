// import MainLayout from '@/Layouts/MainLayout';

// export default function Home() {
//   return (
//     <MainLayout>
//       <div className="p-4">
//         <h1>Acueil Fou2Foot </h1>
//       </div>
//     </MainLayout>
//   );
// }

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';



export default function Homepage({ products }) {
  // Données exemple pour les maillots
  const featuredProducts = [
    {
      id: 1,
      team: 'Girondins de Bordeaux',
      type: 'Maillot Domicile 2023/24',
      price: 79.90,
      image: '/images/maillot/images_maillot/girondins.jfif',
      badge: 'Nouveauté'
    },
    {
      id: 2,
      team: 'Girondins de Bordeaux',
      type: 'Maillot Extérieur',
      price: 74.90,
      image: '/images/maillot/images_maillot/girondins_ext_202425.JPG',
    },
    // Répéter pour 4 maillots Bordeaux
    {
      id: 5,
      team: 'Olympique Lyonnais',
      type: 'Maillot Third 2024',
      price: 84.90,
      image: '/images/maillot/images_maillot/OL_2024-2025-Third-webp.webp',
      badge: 'Limited Edition'
    },
    // 4 maillots OL
    {
      id: 9,
      team: 'Equipe de France',
      type: 'Maillot Coupe du Monde 2022',
      price: 129.90,
      image: '/images/maillot/images_maillot/france.JPG',
      badge: 'Champions Edition'
    },
    // 4 maillots France
  ];

  return (
    <>
      <Head title="Accueil - Fou2Foot" />
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 to-blue-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Maillots de Football Officiels</h1>
          <p className="text-xl mb-8">Retrouvez les tenues des plus grands clubs et des plus grandes sélections</p>
          <p className="text-xl mb-8">Nous nous engageons à vous fournir des maillots de football officiels de la meilleure qualité , personnalisables, à partir d'un catalogue complet recensant les meilleures ligues, avec livraison rapide.Si vous ne trouvez pas le maillot de football que vous aimez, n'hésitez pas à me contacter. Mises à jours régulières du site</p>
        </div>
      </div>

      {/* Produits en vedette */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos Maillots Phares</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={`Maillot ${product.team}`}
                  className="w-full h-64 object-contain rounded-t-lg"
                />
                {product.badge && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.team}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.type}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-800">{product.price.toFixed(2)}€</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Équipes */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos Équipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamCard 
              team="Girondins de Bordeaux" 
              image='/images/maillot/images_maillot/girondins.jfif'
              count={4}
            />
            <TeamCard 
              team="Olympique Lyonnais" 
              image="/images/maillot/images_maillot/OL-2025-75-ans.webp"
              count={4}
            />
            <TeamCard 
              team="Équipe de France" 
              image='/images/maillot/images_maillot/france.JPG'
              count={4}
            />
          </div>
        </div>
      </section>

      
    <Footer /></>
  );
}

function TeamCard({ team, image, count }) {
  return (
    <div className="relative rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
      <img src={image} alt={team} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col">
        <h3 className="text-2xl font-bold text-white mb-2">{team}</h3>
        <p className="text-white">{count} maillots disponibles</p>
      </div>
    </div>
  );
}

