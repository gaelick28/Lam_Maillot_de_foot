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



export default function Homepage({ maillots }) {
  // Données exemple pour les maillots
  const featuredMaillots = [
    {
      id: 37,
      team: 'Girondins de Bordeaux',
      type: 'Maillot Domicile 2024/25',
      price: 20,
      image: '/images/maillot/images_maillot/girondins.jfif',
      badge: ''
    },
    {
      id: 38,
      team: 'Girondins de Bordeaux',
      type: 'Maillot Extérieur 2024/25',
      price: 20.00,
      image: '/images/maillot/images_maillot/girondins_ext_202425.JPG',
    },
  
    {
      id: 369,
      team: 'Olympique Lyonnais',
      type: 'Maillot Domicile 2025-26',
      price: 20,
      image: '/images/maillot/images_maillot/ol_25_26_domicile.webp',
      badge: ''
    },
   
    { 
      id: 177,
      team: 'Olympique Lyonnais',
      type: 'Maillot Extérieur 2025-26',
      price: 20,
      image: '/images/maillot/images_maillot/ol_exterieur_25_26.jfif',
      badge: ''
    },
    {
      id: 1,
      team: 'Equipe de France',
      type: 'Maillot Domicile 2024',
      price: 20.00,
      image: '/images/maillot/images_maillot/france.JPG',
      badge: 'Champions Edition'
    },
    
    {
      id: 2,
      team: 'Equipe de France',
      type: 'Maillot Extérieur 2024',
      price: 20.00,
      image: '/images/maillot/images_maillot/france_ext.jfif',
      badge: 'Champions Edition'
    },

  {
      id: 187,
      team: 'Japon',
      type: 'Graffiti',
      price: 20,
      image: '/images/maillot/images_maillot/japon_graffiti.jpg',
      badge: 'Limited Edition'
    },

{
      id: '390',
      team: 'Brésil',
      type: 'Maillot concept 2025',
      price: 20.00,
      image: '/images/maillot/images_maillot/bresil2.jfif',
      badge: 'Nouveauté'
    },

  ];

const newMaillots = [

  {
      id: 185,
      team: 'Japon',
      type: 'Geisha',
      price: 20,
      image: '/images/maillot/images_maillot/geisha.webp',
      badge: 'Limited Edition'
    },
    
    {
      id: 382,
      team: 'Japon spécial samourai',
      type: 'Maillot 2024/25',
      price: 20.00,
      image: '/images/maillot/images_maillot/japon_special_samourai.webp',
      badge: 'Nouveauté'
    },
    
    {
      id: 367,
      team: 'Japon',
      type: 'Temple blanc',
      price: 20.00,
      image: '/images/maillot/images_maillot/japon_temple_blanc.webp',
      badge: 'Limited Edition'
    },
    //  maillots OL
    {
      id: 367,
      team: 'Japon',
      type: 'Fox',
      price: 20.00,
      image: '/images/maillot/images_maillot/japon_fox.webp',
      badge: 'Nouveauté'
    },

]


  return (
    <>
      <Head title="Accueil - Fou2Foot" />
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 to-blue-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Maillots de Football Officiels</h1>
          <p className="text-xl mb-8">Retrouvez les tenues des plus grands clubs et des plus grandes sélections</p>
          <p className="text-xl mb-8">Nous nous engageons à vous fournir des maillots de football officiels de la meilleure qualité , personnalisables, à partir d'un catalogue complet recensant les meilleures ligues, avec livraison rapide. Si vous ne trouvez pas le maillot de football que vous aimez, n'hésitez pas à nous contacter. Mises à jours régulières du site avec de nouveaux maillots</p>
        </div>
      </div>

      {/* Maillots vedettes */}
  <section className="container mx-auto bg-gradient-to-r from-purple-200 to-blue-100 px-4 py-16">
  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos Maillots Phares</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {featuredMaillots.map((maillot) => (
      <div key={maillot.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Link href={`/maillots/${maillot.id}`}>
          <div className="relative">
            <img 
              src={maillot.image} 
              alt={`Maillot ${maillot.team}`}
              className="w-full h-64 object-contain rounded-t-lg"
            />
            {maillot.badge && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {maillot.badge}
              </span>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{maillot.team}</h3>
            <p className="text-gray-600 text-sm mb-2">{maillot.type}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-800">{maillot.price.toFixed(2)}€</span>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
</section>

{/* Nos nouveaux Maillots */}
<section className="container mx-auto bg-gradient-to-r from-purple-200 to-blue-100 px-4 py-16">
  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos nouveaux Maillots</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {newMaillots.map((maillot) => (
      <div key={maillot.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Link href={`/maillots/${maillot.id}`}>
          <div className="relative">
            <img 
              src={maillot.image} 
              alt={`Maillot ${maillot.team}`}
              className="w-full h-64 object-contain rounded-t-lg"
            />
            {maillot.badge && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {maillot.badge}
              </span>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{maillot.team}</h3>
            <p className="text-gray-600 text-sm mb-2">{maillot.type}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-800">{maillot.price.toFixed(2)}€</span>
            </div>
          </div>
        </Link>
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
        count={11}
      />
      <TeamCard 
        team="Olympique Lyonnais" 
        image="/images/maillot/images_maillot/lyon_75ans.jfif"
        count={8}
      />
      <TeamCard 
        team="France" 
        image='/images/maillot/images_maillot/france.jpg'
        count={8}
      />
    </div>
  </div>
</section>


  
    <Footer /></>
  );
}

function TeamCard({ team, image, count }) {
  const slug = team.toLowerCase().replace(/ /g, '-');
  
  return (
    <Link href={`/clubs/${slug}/maillots`}>
      <div className="relative rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
        <img src={image} alt={team} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col">
          <h3 className="text-2xl font-bold text-white mb-2">{team}</h3>
          <p className="text-white">{count} maillots disponibles</p>
        </div>
      </div>
    </Link>
  );
}

