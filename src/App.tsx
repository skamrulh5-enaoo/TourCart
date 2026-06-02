import React from 'react';
import { TourCartProvider, useTourCart } from './context/TourCartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SpotlightsSection } from './components/SpotlightsSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { HotelsSection } from './components/HotelsSection';
import { BusTransportSection } from './components/BusTransportSection';
import { LocalTransportSection } from './components/LocalTransportSection';
import { DetailModal } from './components/DetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CorporateModal } from './components/CorporateModal';
import { AdminPanel } from './components/AdminPanel';
import { FloatingCart } from './components/FloatingCart';
import { Mail, Phone, Heart, Calendar } from 'lucide-react';

// Central notification element
const NotificationToast: React.FC = () => {
  const { toastText } = useTourCart();
  if (!toastText) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#111827] border border-gray-800 text-white font-mono text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
      <span className="w-2 h-2 rounded-full bg-[#1A7C6E] inline-block animate-ping"></span>
      <span>{toastText}</span>
    </div>
  );
};

const DashboardFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111827] text-white py-16 px-6 md:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand overview */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-serif text-2xl font-black">
            Tour<span className="text-[#E85D3A]">CartBD</span> 🛒
          </h3>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm">
            Southeast Bangladesh's first granular tour architect. Customize your accommodation, local transfers, intercity bus, and mountain safaris item by item with zero hidden margins.
          </p>
          <div className="flex gap-4 text-xs font-bold text-gray-500 pt-2 font-mono">
            <span>🛡️ Registered license &nbsp;·&nbsp; #2901-T</span>
          </div>
        </div>

        {/* Dynamic Section Coordinates links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Section Links</h4>
          <ul className="space-y-2 list-none m-0 p-0 text-xs">
            <li>
              <a href="#activities" className="text-gray-400 hover:text-[#1A7C6E] no-underline transition-colors font-semibold">Curated Local Activities</a>
            </li>
            <li>
              <a href="#hotels" className="text-gray-400 hover:text-[#1A7C6E] no-underline transition-colors font-semibold">Vetted Tourist Lodgings</a>
            </li>
            <li>
              <a href="#bus-transport" className="text-gray-400 hover:text-[#1A7C6E] no-underline transition-colors font-semibold">Dhaka Intercity Coaches</a>
            </li>
            <li>
              <a href="#local-transport" className="text-gray-400 hover:text-[#1A7C6E] no-underline transition-colors font-semibold">Ground Private Transfers</a>
            </li>
          </ul>
        </div>

        {/* Official contact desk desk */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Support Coordination Desk Hours</h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            Dhaka Desk &amp; Spot Managers: <strong>9:00 AM – 11:30 PM (Daily)</strong>
          </p>
          
          <div className="space-y-2 text-xs font-bold text-[#D4A843] font-mono">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>curations@tourcartbd.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+880 1740 902 857 (General Desk)</span>
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto h-px bg-gray-800 my-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
        <p>© {new Date().getFullYear()} TourCartBD. All rights reserved on-ground.</p>
        <p className="flex items-center gap-1.5 font-sans">
          Crafted for premium Southeast Bangladesh travel curations &nbsp;·&nbsp;
          <button 
            onClick={scrollToTop}
            className="text-gray-400 hover:text-white capitalize cursor-pointer font-bold font-mono underline ml-1"
          >
            Jump to Top ↑
          </button>
        </p>
      </div>
    </footer>
  );
};

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5EFE6] select-none text-[#111827] flex flex-col justify-between selection:bg-[#1A7C6E]/20 relative">
      <Navbar />
      
      {/* Scrollable grid layout sections */}
      <main className="flex-1">
        <Hero />
        <SpotlightsSection />
        <ActivitiesSection />
        <HotelsSection />
        <BusTransportSection />
        <LocalTransportSection />
      </main>

      <DashboardFooter />

      {/* Floating overlay portals portal */}
      <DetailModal />
      <CheckoutModal />
      <CorporateModal />
      <AdminPanel />
      <FloatingCart />
      
      {/* Toast alert notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <TourCartProvider>
      <MainLayout />
    </TourCartProvider>
  );
}
