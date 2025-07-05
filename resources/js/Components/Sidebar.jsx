import { Link, router } from "@inertiajs/react"
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa"

export default function Sidebar({ currentRoute = "" }) {
  const menuItems = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: FaTachometerAlt,
      active: currentRoute.includes("/dashboard"),
    },
    {
      href: "/order",
      label: "Commandes",
      icon: FaBoxOpen,
      active: currentRoute.includes("/order"),
    },
    {
      href: "/addresses",
      label: "Adresse",
      icon: FaMapMarkerAlt,
      active: currentRoute.includes("/addresses"),
    },
    {
      href: "/accountdetails",
      label: "Détails du compte",
      icon: FaUser,
      active: currentRoute.includes("/accountdetails"),
    },
    {
      href: "/mywishlist",
      label: "Ma wishlist",
      icon: FaHeart,
      active: currentRoute.includes("/mywishlist"),
    },
  ]

  const handleLogout = () => {
    router.post("/logout")
  }

  return (
    <aside className="w-64 bg-gray-500 text-white p-6 hidden md:block">
      <h2 className="text-lg font-bold mb-6 text-blue-900">Navigation</h2>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center gap-2 ${
                item.active ? "text-blue-900 font-bold" : "text-black hover:text-blue-200"
              } ${item.className || ""}`}
            >
              <item.icon />
              {item.label}
            </Link>
          </li>
        ))}

        {/* Bouton de déconnexion */}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-300 hover:text-red-500 mt-8"
          >
            <FaSignOutAlt />
            Se déconnecter
          </button>
        </li>
      </ul>
    </aside>
  )
}
