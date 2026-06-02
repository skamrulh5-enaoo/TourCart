import React from 'react';
import { useTourCart } from '../context/TourCartContext';
import { BUS_OPERATORS, ROUTE_LABELS } from '../data';
import { Award, Zap, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

export const BusTransportSection: React.FC = () => {
  const {
    cart, addToCart, removeFromCart, isInCart,
    selectedRoute, setSelectedRoute,
    selectedBusType, setSelectedBusType,
    busClasses
  } = useTourCart();

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId);
    setSelectedBusType(null); // Reset choice on route swap
  };

  const currentRouteName = ROUTE_LABELS[selectedRoute];
  const busInCartId = `bus-${selectedBusType}-${selectedRoute}`;
  const isBusSelectedInCart = selectedBusType ? isInCart(busInCartId) : false;

  const handleToggleBus = () => {
    if (!selectedBusType) return;
    const b = (busClasses || []).find(x => x.id === selectedBusType);
    if (!b) return;

    const price = b.priceRange[selectedRoute];
    const itemKey = `bus-${selectedBusType}-${selectedRoute}`;

    if (isBusSelectedInCart) {
      removeFromCart(itemKey);
    } else {
      // Remove any existing bus item first
      const existingBus = cart.find(x => x.cat === 'bus');
      if (existingBus) {
        removeFromCart(existingBus.id);
      }

      addToCart({
        id: itemKey,
        name: `${b.name} (${ROUTE_LABELS[selectedRoute]})`,
        price,
        icon: b.icon,
        cat: 'bus',
        dest: selectedRoute.split('-')[1] // extract dest (cox, bandarban, etc.)
      });
    }
  };

  return (
    <section id="bus-transport" className="py-20 px-6 md:px-12 bg-[#111827] text-white border-t border-[#d1cdc7]">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A7C6E] block mb-2">
          Intercity Scenic Transport
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-black text-white">
          Book Long-Distance Bus Travel
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          Coordinate highway travel out of Dhaka seamlessly. Choose your coach category and let our local ground desk pre-book ticket blocks with top operators.
        </p>
      </div>

      {/* Routes Switch Grid */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {[
          { id: 'dhaka-cox', label: "🚌 Dhaka → Cox's Bazar" },
          { id: 'dhaka-bandarban', label: '🌿 Dhaka → Bandarban' },
          { id: 'dhaka-rangamati', label: '💧 Dhaka → Rangamati' },
          { id: 'ctg-cox', label: "🔄 Chattogram → Cox's Bazar" },
          { id: 'dhaka-ctg', label: '🏙️ Dhaka → Chattogram' }
        ].map(route => (
          <button
            key={route.id}
            onClick={() => handleRouteSelect(route.id)}
            className={`px-4 py-3 rounded-full border text-xs md:text-sm font-black whitespace-nowrap cursor-pointer transition-all duration-150 ${selectedRoute === route.id ? 'bg-[#1A7C6E] border-[#1A7C6E] text-white' : 'bg-[#111827] border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white'}`}
          >
            {route.label}
          </button>
        ))}
      </div>

      {/* Bus choices grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {(busClasses || []).map(bus => {
          const price = bus.priceRange[selectedRoute];
          const active = selectedBusType === bus.id;

          return (
            <div
              key={bus.id}
              onClick={() => setSelectedBusType(bus.id)}
              className={`bg-white/5 border rounded-2xl p-5 hover:bg-white/10 cursor-pointer relative flex flex-col justify-between transition-all duration-200 ${active ? 'border-[#1A7C6E] bg-[#1A7C6E]/10 ring-2 ring-[#1A7C6E]/50' : 'border-gray-800'}`}
            >
              {bus.popular && (
                <span className="absolute top-4 right-4 bg-[#D4A843] text-black text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-md uppercase">
                  {bus.label}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-3xl bg-white/5 p-2 rounded-xl flex">{bus.icon}</span>
                  <div>
                    <h4 className="text-sm font-black text-white">{bus.name}</h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Coach Class</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {bus.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {bus.features.map((feat, i) => (
                    <span key={i} className="text-[9px] font-semibold text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex gap-2 items-end justify-between">
                <div>
                  <p className="font-mono text-base md:text-lg font-black text-[#D4A843]">
                    ৳{price.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">One Way / Seat</p>
                </div>

                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center transition-colors">
                  {active && <span className="w-2.5 h-2.5 rounded-full bg-[#1A7C6E]"></span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popular Operators banner for current route */}
      <div className="bg-white/5 p-6 rounded-2xl border border-gray-800/80 mb-8">
        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
          Recommended operators currently active on route: <span className="text-white normal-case font-bold">{currentRouteName}</span>
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(BUS_OPERATORS[selectedRoute] || []).map((o, idx) => (
            <div key={idx} className="bg-white/5 border border-gray-800 p-3.5 rounded-xl text-center">
              <p className="text-xs font-bold text-white mb-0.5">{o.name}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide leading-none">{o.type}</p>
              <p className="font-mono text-xs font-bold text-[#D4A843] mt-2 block">{o.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm selected bus addition button bar */}
      <div className="flex flex-wrap gap-6 items-center justify-between bg-white/5 p-5 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleBus}
            disabled={!selectedBusType}
            className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border transition-colors flex items-center gap-2 ${!selectedBusType ? 'bg-gray-800 text-gray-500 border-transparent cursor-not-allowed' : isBusSelectedInCart ? 'bg-[#E85D3A] text-white border-[#E85D3A]' : 'bg-[#1A7C6E] text-white border-[#1A7C6E] hover:bg-[#1A7C6E]/90'}`}
          >
            {!selectedBusType 
              ? 'Select a Bus Coach Above' 
              : isBusSelectedInCart 
                ? '✓ Selected (Remove)' 
                : `+ Add Selected Seats to Tour Cart`
            }
          </button>

          <span className="text-[11px] text-gray-400 max-w-sm hidden sm:block">
            Note: Return tickets can be appended during the confirmation phone consultation. Group discounts automatically apply for orders exceeding 10 seats.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#D4A843] font-bold">
          <span>🤝 Verified Partner</span>
        </div>
      </div>
    </section>
  );
};
