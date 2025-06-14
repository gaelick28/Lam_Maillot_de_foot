// resources/js/Components/Sidebar.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaBoxOpen, 
  FaMapMarkerAlt, 
  FaUser, 
  FaHeart, 
  FaSignOutAlt,
  FaTachometerAlt 
} from 'react-icons/fa';

export default function Sidebar({ currentRoute = '' }) {
  const menuItems = [
    {
      href: '/account/dashboard',
      label: 'Tableau de bord',
      icon: FaTachometerAlt,
      active: currentRoute.includes('/dashboard')
    },
    {
      href: '/account/orders',
      label: 'Commandes',
      icon: FaBoxOpen,
      active: currentRoute.includes('/orders')
    },
    {
      href: '/account/address',
      label: 'Adresse',
      icon: FaMapMarkerAlt,
      active: currentRoute.includes('/address')
    },
    {
      href: '/account/details',
      label: 'Détails du compte',
      icon: FaUser,
      active: currentRoute.includes('/details')
    },
    {
      href: '/account/wishlist',
      label: 'Ma wishlist',
      icon: FaHeart,
      active: currentRoute.includes('/wishlist')
    },
    {
      href: '/logout',
      label: 'Se déconnecter',
      icon: FaSignOutAlt,
      className: 'text-red-300 hover:text-red-500 mt-8',
      active: false
    }
  ];

  return (
    <aside className="w-64 bg-gray-500 text-white p-6 hidden md:block">
      <h2 className="text-lg font-bold mb-6 text-blue-900">Navigation</h2>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link 
              href={item.href} 
              className={`flex items-center gap-2 ${item.active ? 'text-blue-900 font-bold' : 'text-black hover:text-blue-200'} ${item.className || ''}`}
            >
              <item.icon /> 
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}