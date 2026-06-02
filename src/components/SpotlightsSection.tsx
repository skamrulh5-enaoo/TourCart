import React from 'react';
import { SPOTLIGHTS } from '../data';
import { Mail, HelpCircle, Phone, ArrowUpRight } from 'lucide-react';
import { useTourCart } from '../context/TourCartContext';

export const SpotlightsSection: React.FC = () => {
  const { setCorpModalOpen } = useTourCart();

  const handleScrollToActivities = () => {
    const el = document.getElementById('activities');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="destinations" className="py-20 px-6 md:px-12 bg-white border-t border-[#d1cdc7]">
      <div className="mb-12">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A7C6E] block mb-2">
          Curated Bento Spotlights
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-black text-[#111827]">
          Southeast Bangladesh Hidden Gems
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-xl">
          We identify points of high interest that conventional tourist routes completely overlook. Incorporate these incredible spots into your custom days.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SPOTLIGHTS.map((spot, index) => (
          <div 
            key={index} 
            className="rounded-3xl p-6 relative flex flex-col justify-between border border-gray-100 group hover:shadow-xl transition-all duration-300 overflow-hidden"
            style={{ backgroundImage: spot.bg }}
          >
            {/* Visual aesthetic backdrop overlay */}
            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-all z-0"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-4xl leading-none">{spot.icon}</span>
                <span className="bg-[#111827] text-[#D4A843] text-[9px] font-black tracking-widest px-2.5 py-1 rounded uppercase">
                  {spot.entry}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  📍 {spot.dest} · {spot.type}
                </span>
                <h3 className="font-serif text-[#111827] text-lg font-black leading-snug mt-1 group-hover:text-[#1A7C6E] transition-colors">
                  {spot.name}
                </h3>
                <p className="text-xs text-[#111827]/75 mt-2.5 leading-relaxed font-semibold">
                  {spot.desc}
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-5 border-t border-black/10 mt-6 flex justify-between items-center bg-transparent">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                Available in Custom days
              </span>
              <button 
                onClick={handleScrollToActivities}
                className="text-xs font-black text-[#1A7C6E] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
              >
                Assemble Spot <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Corporate packages solicitor banner block */}
      <div id="packages" className="bg-[#111827] text-white rounded-3xl p-8 md:p-12 border border-gray-800 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden shadow-xl" style={{ contentVisibility: 'auto' }}>
        {/* Ambient background blur circles */}
        <div className="absolute -bottom-6 -left-6 w-44 h-44 rounded-full bg-[#1A7C6E]/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <span className="bg-[#E85D3A] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase">
            Official B2B Coordination Portal
          </span>
          <h3 className="font-serif text-2xl md:text-3.5xl font-black mt-4 leading-tight">
            Planning a Corporate Retreat or Annual Outing?
          </h3>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-3.5 font-medium">
            Let TourCartBD host your enterprise team! From Dhaka luxury sleepers, beach banquets, private speed boat cruises to team-building bonfires — we deliver end-to-end on-ground service. Special invoice corporate tax exemptions apply.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => setCorpModalOpen(true)}
            className="bg-[#E85D3A] hover:bg-[#c94d2e] hover:scale-[1.01] text-white py-4 px-8 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider cursor-pointer shadow transition-all duration-200"
          >
            🏢 Request Corporate Proposal →
          </button>
        </div>
      </div>
    </section>
  );
};
