import React, { useState } from 'react';
import { useTourCart } from '../context/TourCartContext';

export const Hero: React.FC = () => {
  const { cart, setCheckoutModalOpen } = useTourCart();
  const [selectedType, setSelectedType] = useState('couple');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If cart is empty, show sample checkout values so the design doesn't look blank
  const displayItems = cart.length > 0 ? cart : [
    { id: 'sample-h', name: 'Sea Palace Hotel', price: 11000, icon: '🏨', cat: 'hotel' as any },
    { id: 'sample-a1', name: 'Saint Martin Island — Full Day', price: 3500, icon: '🏝️', cat: 'island' as any },
    { id: 'sample-a2', name: 'Dulahazra Safari Park', price: 1800, icon: '🐅', cat: 'wildlife' as any }
  ];

  const displayTotal = displayItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="relative min-h-[95vh] grid grid-cols-1 lg:grid-cols-12 pt-24 px-6 md:px-12 bg-gradient-to-br from-[#1A7C6E]/5 via-[#F5EFE6] to-[#E85D3A]/5 overflow-hidden items-center">
      {/* Visual background ambient details */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-tr from-[#1A7C6E]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#E85D3A]/10 to-transparent blur-3xl"></div>
      </div>

      {/* Hero content Left - 7 cols */}
      <div className="relative z-10 lg:col-span-7 flex flex-col justify-center py-10 md:pr-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F4F2] border border-[#1A7C6E]/30 text-[#1A7C6E] text-xs font-bold uppercase tracking-wider mb-6 w-fit animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#1A7C6E] inline-block"></span>
          🇧🇩 Southeast Bangladesh's Ultimate Tour Builder
        </span>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight mb-6">
          Build Your <br />
          <span className="italic text-[#E85D3A] font-serif pr-2">Perfect Tour</span> <br />
          Item by Item.
        </h1>

        <p className="text-[#111827]/75 font-normal text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          Cox's Bazar, Bandarban, Rangamati, Khagrachhari & Chattogram — customize every single activity, hotel, and ride. Add only what excites you, skip the unneeded bulk. Enjoy a single deposit, fully coordinated on the ground by native locals.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <button 
            onClick={() => scrollToSection('activities')}
            className="bg-[#1A7C6E] text-white hover:bg-[#1A7C6E]/90 hover:scale-[1.01] px-7 py-4 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all duration-200"
          >
            🛒 Start Designing Tour
          </button>
          <button 
            onClick={() => scrollToSection('destinations')}
            className="border-2 border-[#d1cdc7] text-[#111827] hover:border-[#1A7C6E] hover:text-[#1A7C6E] px-7 py-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200"
          >
            Explore Destinations
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-8 border-t border-[#d1cdc7] max-w-lg">
          <div className="flex flex-col">
            <span className="font-mono text-xl md:text-2xl font-bold text-[#111827]">5</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Destinations</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl md:text-2xl font-bold text-[#111827]">48+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Activities</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl md:text-2xl font-bold text-[#111827]">34</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Hotels</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl md:text-2xl font-bold text-[#111827]">24/7</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Coordination</span>
          </div>
        </div>
      </div>

      {/* Hero Cart Preview Right - 5 cols */}
      <div className="relative z-10 lg:col-span-5 flex items-center justify-center py-10">
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-md w-full relative">
          <div className="absolute -top-3.5 right-6 bg-[#D4A843] text-[#111827] rounded-md px-3.5 py-1 text-[10px] font-black tracking-widest uppercase shadow">
            {cart.length > 0 ? "LIVE TOUR BUDGET" : "SAMPLE PROSPECTUS"}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg font-bold text-[#111827]">TourCartBD System</h3>
            <span className="bg-[#E85D3A] text-white px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black">
              {displayItems.length} items
            </span>
          </div>

          <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Selected Traveler Profile:</p>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {['couple', 'group', 'corp', 'solo'].map(type => (
              <button 
                key={type}
                onClick={() => setSelectedType(type)}
                className={`py-2 text-[10px] font-black rounded-lg border uppercase tracking-wider text-center cursor-pointer transition-all duration-150 ${selectedType === type ? 'border-[#1A7C6E] bg-[#E8F4F2] text-[#1A7C6E]' : 'border-gray-200 bg-white hover:border-[#1A7C6E] text-gray-600'}`}
              >
                {type === 'couple' && '👫 Couple'}
                {type === 'group' && '👥 Group'}
                {type === 'corp' && '🏢 Corp'}
                {type === 'solo' && '🧍 Solo'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-4 max-h-[220px] overflow-y-auto">
            {displayItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-center bg-[#F5EFE6] rounded-xl p-3 border border-gray-100">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-500 truncate-capitalize block mt-0.5">
                    {item.cat} Custom Package Add-on
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#1A7C6E]">
                  {item.price === 0 ? 'Free' : `৳${item.price.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-200 my-4"></div>

          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">{selectedType === 'couple' ? '2 travelers · Estimated' : 'Custom package quote'}</p>
              <div className="flex gap-1.5">
                <span className="bg-[#E8F4F2] text-[#1A7C6E] text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">bKash</span>
                <span className="bg-[#E8F4F2] text-[#1A7C6E] text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">Nagad</span>
                <span className="bg-[#E8F4F2] text-[#1A7C6E] text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">Visa</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl font-black text-[#111827]">৳{displayTotal.toLocaleString()}</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-1">50% Deposit: ৳{(Math.round(displayTotal * 0.5)).toLocaleString()}</p>
            </div>
          </div>

          <button 
            onClick={() => cart.length > 0 ? setCheckoutModalOpen(true) : scrollToSection('activities')}
            className="w-full bg-gradient-to-r from-[#1A7C6E] to-[#1A7C6E]/80 hover:scale-[1.01] text-white py-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider cursor-pointer shadow-md transition-all duration-200"
          >
            {cart.length > 0 ? '🔒 Proceed & Book Tour →' : '🛒 Build Your Live Cart Now'}
          </button>
        </div>
      </div>
    </section>
  );
};
