import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import WishlistButton from "@/Components/WishlistButton";

export default function MaillotCardCarousel({ maillot, href, clubName, maillotName, showPrice = true, footer = null }) {
    const images = [maillot.image, ...(maillot.image_dos ? [maillot.image_dos] : [])];
    const [currentImage, setCurrentImage] = useState(0);

    const prev = (e) => {
        e.preventDefault();
        setCurrentImage(i => i === 0 ? images.length - 1 : i - 1);
    };

    const next = (e) => {
        e.preventDefault();
        setCurrentImage(i => i === images.length - 1 ? 0 : i + 1);
    };

    const formatPrice = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    return (
        <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full relative group">
            <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                <Link href={href || `/maillots/${maillot.id}`}>
                    <img
    src={`/${images[currentImage]}`}
    alt={`Maillot ${clubName || maillot.nom}`}
    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
    loading="lazy"
/>
                </Link>

                {/* Flèches — uniquement si image_dos existe */}
                {maillot.image_dos && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-7 h-7 flex items-center justify-center shadow transition z-10"
                            aria-label="Image précédente"
                        >‹</button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-7 h-7 flex items-center justify-center shadow transition z-10"
                            aria-label="Image suivante"
                        >›</button>
                    </>
                )}

                <div className="absolute top-2 right-2 z-10">
                    <WishlistButton maillotId={maillot.id} />
                </div>
            </div>

            <Link href={href || `/maillots/${maillot.id}`} className="block p-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 truncate">
                    {clubName || maillot.nom}
                </h3>
                {maillotName && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{maillotName}</p>
                )}
                {showPrice && (
                    <span className="text-lg font-bold text-blue-800">
                        {clubName ? `À partir de ${formatPrice.format(maillot.price)}` : `${Number(maillot.price).toFixed(2)}€`}
                    </span>
                )}
            </Link>

            {maillot.badge && (
                <span className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {maillot.badge}
                </span>
            )}
            {footer && (
    <div className="px-4 pb-4">
        {footer}
    </div>
)}
        </article>
    );
}