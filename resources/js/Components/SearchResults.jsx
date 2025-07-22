import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';

export default function SearchResults({ clubs, query }) {
    return (
        <>
            <Header />
            <main className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen p-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-6">
                        Résultats pour "{query}" ({clubs.total} clubs trouvés)
                    </h1>
                    
                    {clubs.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clubs.data.map(club => (
                                <Link
                                    key={club.id}
                                    href={`/clubs/${club.id}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <img
                                        src={`/${club.logo}`}
                                        alt={club.name}
                                        className="w-full h-48 object-contain bg-gray-50"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2">{club.name}</h3>
                                        <p className="text-gray-600 mb-1">{club.pays}</p>
                                        <p className="text-gray-500 text-sm mb-2">{club.ligue}</p>
                                        <p className="text-sm text-blue-600">
                                            {club.maillots?.length || 0} maillot(s) disponible(s)
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">Aucun club trouvé pour "{query}"</p>
                            <p className="text-gray-500 mt-2">Essayez "Olympique Lyonnais", "Girondins de Bordeaux", "France"...</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
