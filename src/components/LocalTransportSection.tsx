import React from 'react';
import { useTourCart } from '../context/TourCartContext';
import { LocalTransport } from '../data';
import { Check, Star, Info, HelpCircle } from 'lucide-react';

export const LocalTransportSection: React.FC = () => {
  const {
    cart, addToCart, removeFromCart, isInCart,
    ltDestFilter, setLtDestFilter,
    setCheckoutModalOpen,
    localTransport
  } = useTourCart();

  const handleToggleLT = (lt: LocalTransport) => {
    const addedId = `lt-${lt.id}`;
    if (isInCart(addedId)) {
      removeFromCart(addedId);
    } else {
      addToCart({
        id: addedId,
        name: `${lt.name} (Local Ground Carriage)`,
        price: lt.price,
        icon: lt.icon,
        cat: 'transport',
        dest: lt.dest
      });
    }
  };

  const isSelected = (ltId: string) => {
    return isInCart(`lt-${ltId}`);
  };

  const filteredLT = (localTransport || []).filter(t => {
    if (t.active === false) return false;
    return ltDestFilter === 'all' || t.dest === ltDestFilter;
  });

  return (
    <section id="local-transport" className="pt-20 pb-40 md:pb-20 px-6 md:px-12 bg-[#F5EFE6] border-t border-[#d1cdc7]">
      <div className="flex justify-between items-end flex-wrap gap-6 mb-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A7C6E] block mb-2">
            Local Transfer Co-ordination
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-[#111827]">
            Secure Private Local Transport
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Coordinate private open-top jeeps, local boats, motorbikes, or standard air-conditioned sedans. All options are operated by vetted partner drivers.
          </p>
        </div>

        {cart.some(i => i.cat === 'transport') && (
          <button 
            onClick={() => setCheckoutModalOpen(true)}
            className="bg-[#111827] text-white hover:bg-[#1A7C6E] px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all duration-200 cursor-pointer"
          >
            🚗 Ground Ride Added &nbsp;·&nbsp; Checkout →
          </button>
        )}
      </div>

      {/* Destination filter togglers */}
      <div className="flex flex-nowrap md:flex-wrap gap-2 mb-8 bg-white p-2.5 rounded-2xl border border-[#d1cdc7] shadow-sm max-w-full overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Regions' },
          { id: 'cox', label: "Cox's Bazar" },
          { id: 'bandarban', label: 'Bandarban' },
          { id: 'rangamati', label: 'Rangamati' },
          { id: 'khagra', label: 'Khagrachhari' }
        ].map(dest => (
          <button
            key={dest.id}
            onClick={() => setLtDestFilter(dest.id)}
            className={`flex-1 md:flex-none min-w-[130px] py-3 px-4 rounded-xl text-xs font-black uppercase whitespace-nowrap cursor-pointer transition-all duration-150 ${ltDestFilter === dest.id ? 'bg-[#1A7C6E] text-white shadow' : 'bg-transparent text-gray-500 hover:text-[#111827]'}`}
          >
            {dest.label}
          </button>
        ))}
      </div>

      {/* Local transport catalog cards grid */}
      {filteredLT.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-[#d1cdc7] rounded-3xl flex flex-col items-center justify-center">
          <span className="text-4xl mb-3">🛺</span>
          <p className="text-lg font-bold text-[#111827] mb-1">No options available for this region</p>
          <p className="text-sm text-gray-400">All coordinates represent regional local rentals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLT.map(lt => {
            const added = isSelected(lt.id);
            return (
              <div
                key={lt.id}
                onClick={() => handleToggleLT(lt)}
                className={`bg-white p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${added ? 'border-[#1A7C6E] bg-[#E8F4F2]/10 shadow-lg' : 'border-[#d1cdc7] hover:border-[#1A7C6E] hover:shadow-md'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-[#F5EFE6] p-3 rounded-xl leading-none">{lt.icon}</span>
                      {lt.popular && (
                        <span className="bg-[#D4A843] text-black text-[9px] font-black tracking-widest px-2.5 py-1 rounded uppercase font-mono leading-none">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${added ? 'bg-[#1A7C6E] border-[#1A7C6E] text-white' : 'border-gray-300'}`}>
                      {added && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h3 className="font-serif text-[#111827] text-base font-black leading-snug tracking-tight mb-2">
                    {lt.name}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {lt.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {lt.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-bold px-2 py-0.5 rounded font-mono"
                        style={{ backgroundColor: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}35` }}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-150 pt-4 flex justify-between items-end">
                  <div>
                    <span className="font-mono text-base font-bold text-[#111827]">
                      ৳{lt.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block leading-none mt-1">
                      {lt.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLT(lt);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider border cursor-pointer transition-colors ${added ? 'bg-[#E85D3A] text-white border-[#E85D3A]' : 'bg-[#1A7C6E] text-white border-[#1A7C6E] hover:bg-[#1A7C6E]/90'}`}
                  >
                    {added ? '✓ Selected' : '＋ Add Ground Ride'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
