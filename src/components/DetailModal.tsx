import React from 'react';
import { useTourCart } from '../context/TourCartContext';
import { ACTIVITIES } from '../data';
import { X, Star, Clock, MapPin, Sparkles } from 'lucide-react';

export const DetailModal: React.FC = () => {
  const {
    detailModalId, setDetailModalId,
    cart, addToCart, removeFromCart, isInCart
  } = useTourCart();

  if (detailModalId === null) return null;

  const activity = ACTIVITIES.find(a => a.id === detailModalId);
  if (!activity) return null;

  const added = isInCart(activity.id);

  const handleToggle = () => {
    if (added) {
      removeFromCart(activity.id);
    } else {
      addToCart({
        id: activity.id,
        name: activity.name,
        price: activity.price,
        icon: activity.icon,
        cat: activity.cat as any,
        dest: activity.dest
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative border border-[#d1cdc7] max-h-[90vh] flex flex-col justify-between">
        
        {/* Close button overhead */}
        <button 
          onClick={() => setDetailModalId(null)}
          className="absolute top-4 right-4 bg-[#111827]/80 hover:bg-[#111827] text-white p-2 rounded-full cursor-pointer transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Banner */}
        <div className="h-56 bg-[#F5EFE6] relative flex items-center justify-center text-7xl select-none">
          <span>{activity.icon}</span>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex gap-1 items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-[#1A7C6E]" />
            <span>{activity.loc}</span>
          </div>

          <h3 className="font-serif text-[#111827] text-xl md:text-2xl font-black leading-tight">
            {activity.name}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 py-2 border-y border-gray-100">
            <span className="text-[#D4A843] flex items-center font-black">
              <Star className="w-4 h-4 fill-current mr-1" />
              {activity.rating} ({activity.reviews} ratings)
            </span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {activity.duration}
            </span>

            <span>•</span>

            <span className="uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded font-black bg-gray-100 text-gray-600">
              {activity.diff} difficulty
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-600 leading-normal font-medium">
            {activity.desc}
          </p>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1A7C6E]" />
              Spot Highlight Indicators
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(activity.highlights || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">{key}</span>
                  <span className="text-xs font-black text-[#111827] mt-0.5 block">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom Control */}
        <div className="px-6 py-4 border-t border-[#d1cdc7] bg-gray-50 flex items-center justify-between">
          <div>
            <p className="font-mono text-base md:text-lg font-black text-[#111827]">
              {activity.price === 0 ? 'Free Entry' : `৳${activity.price.toLocaleString()}`}
            </p>
            <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider leading-none mt-1">Per Person Rate</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setDetailModalId(null)}
              className="border border-[#d1cdc7] text-gray-600 font-bold hover:border-[#111827] hover:text-[#111827] text-xs uppercase px-4 py-2.5 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button 
              onClick={handleToggle}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer border transition-colors ${added ? 'bg-[#E85D3A] text-white border-[#E85D3A]' : 'bg-[#1A7C6E] text-white border-[#1A7C6E] hover:bg-[#1A7C6E]/90'}`}
            >
              {added ? '✓ Remove Inclusions' : '+ Add to Tour'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
