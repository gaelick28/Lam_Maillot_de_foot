import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';

export default function SearchResults({ clubs, query }) {
    // Fonction pour corriger les URLs d'images
    const getImageUrl = (image) => {
        if (!image) return null;
        
        // Si l'image commence déjà par http:// ou https:// ou /, la retourner telle quelle
        if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
            return image;
        }
        
        // Sinon, ajouter le / au début
        return '/' + image;
    };

    return (
        <>
            <Header />
            <main className="bg-gradient-to-r from-purple-200 to-blue-100 min-h-screen p-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-6">
                        Résultats pour "{query}" ({clubs.total} club{clubs.total > 1 ? 's' : ''} trouvé{clubs.total > 1 ? 's' : ''})
                    </h1>
                    
                    {clubs.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clubs.data.map(club => {
                                const firstMaillot = club.maillots && club.maillots[0];
                                const imageUrl = firstMaillot ? getImageUrl(firstMaillot.image) : null;
                                
                                return (
                                    <Link
                                        key={club.id}
                                        href={`/clubs/${club.slug}/maillots`}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={club.name}
                                                className="w-full h-48 object-cover bg-gray-50"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            className="w-full h-48 bg-gray-200 flex items-center justify-center"
                                            style={{ display: imageUrl ? 'none' : 'flex' }}
                                        >
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2">{club.name}</h3>
                                            <p className="text-sm text-blue-600">
                                                {club.maillots?.length || 0} maillot{(club.maillots?.length || 0) > 1 ? 's' : ''} disponible{(club.maillots?.length || 0) > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xl text-gray-600 mb-2">Aucun club trouvé pour "{query}"</p>
                            <p className="text-gray-500 mb-4">Essayez avec d'autres mots-clés comme :</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Link href="/search?q=Lyon" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">Lyon</Link>
                                <Link href="/search?q=Paris" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">Bordeaux</Link>
                                <Link href="/search?q=France" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">France</Link>
                                <Link href="/search?q=Milan" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">Milan</Link>
                            </div>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {clubs.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {clubs.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-4 py-2 rounded ${
                                            link.active 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded bg-gray-200 text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}