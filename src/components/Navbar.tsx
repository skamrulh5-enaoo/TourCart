import React from 'react';
import { ShoppingCart, MapPin, Coffee, HelpCircle } from 'lucide-react';
import { useTourCart } from '../context/TourCartContext';

export const Navbar: React.FC = () => {
  const { cart, setCheckoutModalOpen, setAdminOpen } = useTourCart();
  const cartCount = cart.length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCartClick = () => {
    if (cartCount > 0) {
      // Toggle or scroll to bottom cart notification card
      const notifEl = document.getElementById('cartNotif');
      if (notifEl) {
        notifEl.classList.toggle('expanded');
        notifEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      scrollToSection('activities');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#F5EFE6]/95 backdrop-blur-md border-b border-[#d1cdc7] transition-all duration-300 md:px-12">
      <a href="#" className="font-serif text-xl md:text-2xl font-black text-[#111827] flex items-center gap-1.5 no-underline">
        Tour<span className="text-[#E85D3A]">CartBD</span> 🛒
      </a>

      <ul className="hidden md:flex gap-7 list-none m-0 p-0">
        <li>
          <button onClick={() => scrollToSection('activities')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Activities
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('hotels')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Hotels
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('bus-transport')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Bus Transport
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('local-transport')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Local Transport
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('destinations')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Destinations
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('packages')} className="text-sm font-semibold text-gray-600 hover:text-[#1A7C6E] cursor-pointer transition-colors">
            Packages
          </button>
        </li>
      </ul>

      <div className="flex gap-2.5 items-center">
        {/* Secret Admin Shortcut Trigger */}
        <button 
          onClick={() => setAdminOpen(true)}
          className="text-[10px] text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded border border-gray-300 mr-2 uppercase"
          title="Administrative Operations Portal"
        >
          Ops
        </button>

        <button 
          onClick={handleCartClick}
          className="bg-[#111827] text-white hover:bg-[#1A7C6E] flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold cursor-pointer transition-all duration-200 relative"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>My Tour Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#E85D3A] text-white rounded-full text-[10px] font-black w-5 h-5 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => scrollToSection('activities')}
          className="bg-[#E85D3A] text-white hover:bg-[#c94d2e] px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-colors hidden sm:block"
        >
          🗺️ Plan My Tour →
        </button>
      </div>
    </nav>
  );
};
