import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";

export default function PanierLink() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const count = JSON.parse(localStorage.getItem("cart") || "[]").length;
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("focus", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("focus", updateCartCount);
    };
  }, []);

  return (
    <Link href="/panier" className="hover:text-blue-200 transition-colors" aria-label="Panier">
      🛒 Panier
      <span className="ml-1 bg-red-600 text-white rounded-full px-2 text-xs">
        {cartCount}
      </span>
    </Link>
  );
}
