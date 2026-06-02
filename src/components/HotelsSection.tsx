import React from 'react';
import { useTourCart } from '../context/TourCartContext';
import { HOTELS, Hotel } from '../data';
import { Star, ShieldAlert, Wifi, Coffee, HelpCircle, Utensils, Zap, HelpCircle as HelpIcon } from 'lucide-react';

export const HotelsSection: React.FC = () => {
  const {
    cart, addToCart, removeFromCart, isInCart,
    hotelTierFilter, setHotelTierFilter,
    hotelDestFilter, setHotelDestFilter,
    nightsCount, setNightsCount,
    setCheckoutModalOpen,
    hotels, refreshHotels
  } = useTourCart();

  React.useEffect(() => {
    refreshHotels();
  }, []);

  const handleNightsChange = (delta: number) => {
    setNightsCount(Math.max(1, Math.min(15, nightsCount + delta)));
  };

  const handleToggleHotel = (hotel: Hotel) => {
    const totalCost = hotel.pricePerNight * nightsCount;
    const addedId = `hotel-${hotel.id}-${nightsCount}`;

    // Look for any existing hotel and remove first (usually people book 1 central hotel)
    const existingHotel = cart.find(x => x.cat === 'hotel');
    
    if (isInCart(addedId)) {
      removeFromCart(addedId);
    } else {
      if (existingHotel) {
        removeFromCart(existingHotel.id);
      }
      addToCart({
        id: addedId,
        name: `${hotel.name} (${nightsCount} Nights Room Booking)`,
        price: totalCost,
        icon: '🏨',
        cat: 'hotel',
        dest: hotel.dest
      });
    }
  };

  const hotelInCartId = (hotelId: string) => {
    const addedId = `hotel-${hotelId}-${nightsCount}`;
    return isInCart(addedId);
  };

  const filteredHotels = (hotels || []).filter(h => {
    if (h.active === false) return false;
    if (hotelTierFilter !== 'all' && h.tier !== hotelTierFilter) return false;
    if (hotelDestFilter !== 'all' && h.dest !== hotelDestFilter) return false;
    return true;
  });

  const tierColors: Record<string, string> = {
    budget: 'bg-emerald-50 text-emerald-700 border-emerald-200/55',
    midrange: 'bg-amber-50 text-amber-700 border-amber-200/55',
    premium: 'bg-sky-50 text-sky-700 border-sky-200/55',
    luxury: 'bg-violet-50 text-violet-700 border-[#7c3aed]/25'
  };

  return (
    <section id="hotels" className="py-20 px-6 md:px-12 bg-white border-t border-[#d1cdc7]">
      <div className="flex justify-between items-end flex-wrap gap-6 mb-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A7C6E] block mb-2">
            Vetted Quality Accommodations
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-[#111827]">
            Select Vetted Hotels &amp; Resorts
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            We inspect every single hotel personally. No deceptive images. Select standard checkout parameters for double occupancy rooms.
          </p>
        </div>

        {cart.some(i => i.cat === 'hotel') && (
          <button 
            onClick={() => setCheckoutModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-[#1A7C6E] text-[#1A7C6E] hover:bg-[#1A7C6E] hover:text-white text-xs font-black uppercase transition-all duration-200"
          >
            🏨 Hotel Added &nbsp;·&nbsp; Checkout Now →
          </button>
        )}
      </div>

      {/* Nights selection control block */}
      <div className="flex flex-wrap gap-6 items-center bg-[#F5EFE6] p-4 md:p-6 rounded-2xl border border-[#d1cdc7] mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#111827]">Stay Duration:</span>
          <div className="flex border border-[#d1cdc7] rounded-xl bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => handleNightsChange(-1)}
              className="px-4 py-2 hover:bg-gray-100 font-extrabold text-sm border-r border-[#d1cdc7] cursor-pointer"
            >
              −
            </button>
            <div className="px-5 py-2 flex items-center font-mono text-sm font-bold text-[#111827]">
              {nightsCount} {nightsCount > 1 ? 'nights' : 'night'}
            </div>
            <button 
              onClick={() => handleNightsChange(1)}
              className="px-4 py-2 hover:bg-gray-100 font-extrabold text-sm border-l border-[#d1cdc7] cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider" id="nightsNote">
          All calculated room price estimations are presented per room for <strong>{nightsCount} night{nightsCount > 1 ? 's' : ''}</strong> based on double occupancy.
        </p>
      </div>

      {/* Hotel filtering buttons bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-150 pb-6 mb-8 gap-y-4">
        {/* Tier filter */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Tiers' },
            { id: 'budget', label: '🟢 Budget' },
            { id: 'midrange', label: '🟡 Mid-range' },
            { id: 'premium', label: '🔵 Premium' },
            { id: 'luxury', label: '💎 Luxury' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setHotelTierFilter(t.id)}
              className={`px-4 py-2.5 rounded-full border text-xs font-black cursor-pointer transition-colors ${hotelTierFilter === t.id ? 'bg-[#111827] border-[#111827] text-white' : 'bg-white border-[#d1cdc7] hover:border-gray-500 text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Location filter */}
        <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
          {[
            { id: 'all', label: 'All Locations' },
            { id: 'cox', label: "Cox's Bazar" },
            { id: 'bandarban', label: 'Bandarban' },
            { id: 'rangamati', label: 'Rangamati' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setHotelDestFilter(d.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-150 ${hotelDestFilter === d.id ? 'bg-white text-[#1A7C6E] border-transparent shadow' : 'text-gray-500 hover:text-[#111827]'}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hotels card list */}
      {filteredHotels.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-[#d1cdc7] rounded-3xl flex flex-col items-center justify-center">
          <span className="text-4xl mb-3">🏨</span>
          <p className="text-lg font-bold text-[#111827] mb-1">No accommodations match your selection</p>
          <p className="text-sm text-gray-400">Try choosing a different budget tier or location tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => {
            const totalRoomPrice = hotel.pricePerNight * nightsCount;
            const chosen = hotelInCartId(hotel.id);
            return (
              <div 
                key={hotel.id}
                className={`bg-white rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 relative ${chosen ? 'border-[#1A7C6E] shadow-xl shadow-[#1A7C6E]/5 bg-[#E8F4F2]/10' : 'border-[#d1cdc7] hover:border-[#1A7C6E] hover:shadow-lg'}`}
              >
                {/* Header background with visual representation */}
                <div className="h-36 relative select-none flex items-center justify-center text-4xl" style={{ background: hotel.bg }}>
                  <span className="relative z-10">{hotel.icon}</span>
                  <div className="absolute inset-0 bg-black/15"></div>
                  
                  <span className={`absolute top-3 left-3 text-[9px] uppercase font-black px-2 py-0.5 rounded border ${tierColors[hotel.tier]}`}>
                    {hotel.tier}
                  </span>

                  {hotel.discountLabel && (
                    <span className="absolute bottom-3 left-3 bg-[#E85D3A] text-white text-[10px] font-black tracking-wider px-2 py-0.5 rounded uppercase z-10 shadow flex items-center">
                      🔥 {hotel.discountLabel}
                    </span>
                  )}

                  <span className="absolute top-3 right-3 bg-black/60 text-[#D4A843] text-[10px] font-black px-2 py-0.5 rounded flex items-center">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </span>
                </div>

                {/* Info and details body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
                      <span>📍</span>
                      {hotel.loc}
                    </p>
                    <h3 className="font-serif text-[#111827] text-base md:text-lg font-black leading-snug tracking-tight mb-2">
                      {hotel.name}
                    </h3>
                    <span className="inline-block bg-[#E8F4F2] text-[#1A7C6E] text-[11px] font-black px-2.5 py-1 rounded-md mb-3">
                      ✨ {hotel.specialty}
                    </span>
                    <p className="text-xs text-gray-500 leading-normal line-clamp-3">
                      {hotel.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {hotel.amenities.map((a, i) => (
                        <span key={i} className="text-[10px] font-bold text-gray-500 bg-[#F5EFE6] px-2.5 py-1 rounded-md">
                          {a === 'Wi-Fi' && '📶 Wi-Fi'}
                          {a === 'Sea view' && '🌊 Sea View'}
                          {a === 'Pool' && '🏊 Infinity Pool'}
                          {a === 'Restaurant' && '🍽️ Diner'}
                          {a === 'AC' && '❄️ A/C'}
                          {a !== 'Wi-Fi' && a !== 'Sea view' && a !== 'Pool' && a !== 'Restaurant' && a !== 'AC' && a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-150 pt-4 flex justify-between items-end">
                    <div>
                      <p className="font-mono text-base md:text-lg font-bold">
                        {hotel.prevPricePerNight && hotel.prevPricePerNight > hotel.pricePerNight ? (
                          <>
                            <span className="line-through text-gray-400 text-xs font-normal mr-2">৳{(hotel.prevPricePerNight * nightsCount).toLocaleString()}</span>
                            <span className="text-[#E85D3A] font-extrabold">৳{totalRoomPrice.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-[#111827]">৳{totalRoomPrice.toLocaleString()}</span>
                        )}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                        {hotel.prevPricePerNight && hotel.prevPricePerNight > hotel.pricePerNight ? (
                          <>
                            <span className="line-through text-gray-400 mr-1.5">৳{hotel.prevPricePerNight.toLocaleString()}</span>
                            <span className="text-[#E85D3A] font-bold">৳{hotel.pricePerNight.toLocaleString()}/night</span>
                          </>
                        ) : (
                          `৳${hotel.pricePerNight.toLocaleString()}/night`
                        )}
                        <span> · {nightsCount} nights</span>
                      </p>
                    </div>

                    <button 
                      onClick={() => handleToggleHotel(hotel)}
                      className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer border transition-colors ${chosen ? 'bg-[#E85D3A] text-white border-[#E85D3A]' : 'bg-[#1A7C6E] text-white border-[#1A7C6E] hover:bg-[#1A7C6E]/90'}`}
                    >
                      {chosen ? '✓ Selected' : '+ Add Room'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
