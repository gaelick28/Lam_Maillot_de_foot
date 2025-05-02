import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#2a3740] text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20">
        
        <div className="flex items-center gap-2">
          <img src="images/logo.png" alt="Logo" className="w-6 h-6" />
          <span className="text-sm">&copy; MyScript {new Date().getFullYear()}.</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm justify-center">
          <a href="/legal" className="hover:underline">Informations légales</a>
          <a href="/preferences" className="hover:underline">Gérer mes préférences</a>
        </div>
        
      </div>
    </footer>
  );
}
