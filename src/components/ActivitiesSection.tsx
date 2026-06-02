import React from 'react';
import { useTourCart } from '../context/TourCartContext';
import { DESTINATIONS, CATEGORIES, Activity } from '../data';
import { Star, Clock, MapPin, Eye } from 'lucide-react';

export const ActivitiesSection: React.FC = () => {
  const {
    cart, addToCart, removeFromCart, isInCart,
    activeDest, setActiveDest,
    activeCat, setActiveCat,
    activeType, setActiveType,
    activeDiff, setActiveDiff,
    priceMax, setPriceMax,
    setDetailModalId,
    setCheckoutModalOpen,
    activities
  } = useTourCart();

  const [sortOption, setSortOption] = React.useState('recommended');

  const destObj = DESTINATIONS.find(d => d.id === activeDest);
  const currentDestinationCount = (activities || []).filter(a => a.active !== false && (activeDest === 'all' || a.dest === activeDest)).length;

  // Filter activities
  const filteredActivities = (activities || []).filter(activity => {
    if (activity.active === false) return false;
    if (activeDest !== 'all' && activity.dest !== activeDest) return false;
    if (activeCat !== 'all' && activity.cat !== activeCat) return false;
    if (activeType !== 'all' && !activity.types.includes(activeType)) return false;
    if (activeDiff !== 'all' && activity.diff !== activeDiff) return false;
    if (activity.price > priceMax) return false;
    return true;
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'top_rated') return b.rating - a.rating;
    return 0; // recommended / default
  });

  const handleToggleCart = (activity: Activity) => {
    if (isInCart(activity.id)) {
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

  const difficultyColors: Record<string, string> = {
    easy: 'bg-[#dcfce7] text-[#15803d]',
    moderate: 'bg-[#fef3c7] text-[#92400e]',
    hard: 'bg-[#fee2e2] text-[#b91c1c]',
  };

  return (
    <section id="activities" className="py-20 px-6 md:px-12 bg-[#F5EFE6] border-t border-[#d1cdc7]">
      <div className="flex justify-between items-end flex-wrap gap-6 mb-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A7C6E] block mb-2">
            Activity &amp; Spot Explorer
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-[#111827]">
            Build Your Own Custom Day
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Choose from 48+ curated local spots and activities. Put them in your basket, skip what doesn't fit your budget. Fully customizable.
          </p>
        </div>

        {cart.length > 0 && (
          <button 
            onClick={() => setCheckoutModalOpen(true)}
            className="bg-[#1A7C6E] text-white hover:bg-[#111827] px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all duration-250 animate-bounce"
          >
            🛒 {cart.length} selected &nbsp;·&nbsp; ৳{(cart.reduce((sum, item) => sum + item.price, 0)).toLocaleString()} &nbsp;·&nbsp; <strong>Review Tour &amp; Book →</strong>
          </button>
        )}
      </div>

      {/* Destinations Horizontal Scroll Wrapper */}
      <div className="flex gap-2 mb-6 border border-[#d1cdc7] rounded-2xl overflow-hidden bg-white p-2 max-w-full overflow-x-auto scrollbar-none shadow-sm">
        {DESTINATIONS.map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDest(d.id)}
            className={`flex-1 min-w-[130px] flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${activeDest === d.id ? 'bg-[#1A7C6E] text-white' : 'bg-white hover:bg-[#E8F4F2] text-[#111827]'}`}
          >
            <span className="text-xl mb-1">{d.icon}</span>
            <span className="text-xs font-bold block">{d.name}</span>
            <span className="text-[9px] opacity-75 font-mono tracking-wider mt-0.5">{d.count}</span>
          </button>
        ))}
      </div>

      {/* Categories Grid Scroll Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-4 py-2.5 rounded-full border text-xs md:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-150 ${activeCat === c.id ? 'bg-[#111827] border-[#111827] text-white font-bold' : 'bg-white border-[#d1cdc7] text-gray-700 hover:border-[#1A7C6E] hover:text-[#1A7C6E]'}`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Main Filter / Product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters - 3 Columns */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#d1cdc7] space-y-6 sticky top-24">
          <div>
            <h4 className="text-xs font-black uppercase text-[#111827] tracking-wider mb-3">Traveler Type Filter</h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All types' },
                { id: 'solo', label: '🧍 Solo' },
                { id: 'couple', label: '👫 Couple' },
                { id: 'group', label: '👥 Group' },
                { id: 'corporate', label: '🏢 Corporate' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold cursor-pointer transition-colors ${activeType === t.id ? 'bg-[#1A7C6E]/15 border-[#1A7C6E] text-[#1A7C6E]' : 'bg-white border-[#d1cdc7] hover:border-gray-500 text-gray-600'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-150 pt-5">
            <h4 className="text-xs font-black uppercase text-[#111827] tracking-wider mb-2">Difficulty Level</h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Difficulties' },
                { id: 'easy', label: '🟢 Easy' },
                { id: 'moderate', label: '🟡 Moderate' },
                { id: 'hard', label: '🔴 Hard' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDiff(d.id)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold cursor-pointer transition-colors ${activeDiff === d.id ? 'bg-[#1A7C6E]/15 border-[#1A7C6E] text-[#1A7C6E]' : 'bg-white border-[#d1cdc7] hover:border-gray-500 text-gray-600'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-150 pt-5">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-black uppercase text-[#111827] tracking-wider">Budget / Person</h4>
              <span className="font-mono text-xs font-bold text-[#1A7C6E]">
                {priceMax >= 10000 ? 'No limit BDT' : `৳${priceMax.toLocaleString()}`}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="500"
              value={priceMax} 
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A7C6E]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
              <span>৳0</span>
              <span>All Limits</span>
            </div>
          </div>

          <div className="bg-[#E8F4F2] p-4 rounded-xl border border-[#1A7C6E]/20">
            <h5 className="text-[11px] font-black text-[#1A7C6E] uppercase tracking-wider mb-1">💡 Local Tour Expert Tip</h5>
            <p className="text-xs text-[#1A7C6E]/80 leading-relaxed font-semibold">
              {activeDest === 'all' && 'Our Cox\'s Bazar + Bandarban combinations are highly popular during the winters.'}
              {activeDest === 'cox' && 'Best time is Nov–Mar. Visited spots like Ramu\'s Buddhist temples can be scheduled in a single evening!'}
              {activeDest === 'bandarban' && 'Nilgiri permits must be pre-cleared by the military. TourCartBD manages all permits for you.'}
              {activeDest === 'rangamati' && 'Rent a single boat to access Shuvolong waterfall + quiet island tribal restaurants in one tour.'}
              {activeDest === 'khagra' && 'Alutila caves require organic hand-held wood torches. We arrange them at the local entrance.'}
              {activeDest === 'ctg' && 'Patenga beach provides spectacular industrial photo sunsets next to the seaport.'}
            </p>
          </div>
        </div>

        {/* Activities List Wrapper - 9 Columns */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-xl border border-[#d1cdc7]">
            <span className="text-xs font-bold text-gray-600 font-mono uppercase tracking-wide">
              Showing {sortedActivities.length} available items for {destObj?.name || 'Southeast Bangladesh'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111827]">Order By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#F5EFE6] border border-[#d1cdc7] px-3 py-1.5 rounded-lg text-xs font-bold text-[#111827] cursor-pointer outline-none focus:border-[#1A7C6E]"
              >
                <option value="recommended">Best Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="top_rated">Top Rating ★★★★★</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {sortedActivities.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#d1cdc7] rounded-2xl flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-lg font-bold text-[#111827] mb-1">No activities match your filters</p>
              <p className="text-sm text-gray-400">Try adjusting the price slider or shifting destinations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedActivities.map(activity => {
                const added = isInCart(activity.id);
                return (
                  <div 
                    key={activity.id}
                    onClick={() => setDetailModalId(activity.id)}
                    className={`bg-white rounded-2xl border-2 overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-200 group relative ${added ? 'border-[#1A7C6E] shadow-lg shadow-[#1A7C6E]/5' : 'border-[#d1cdc7] hover:border-[#1A7C6E] hover:shadow-xl'}`}
                  >
                    {/* Badge Indicator in cart */}
                    {added && (
                      <span className="absolute top-3 right-3 bg-[#E85D3A] text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase z-10 shadow">
                        SELECTED
                      </span>
                    )}

                    {/* Active Campaign Tag */}
                    {activity.discountLabel && (
                      <span className="absolute top-3 left-3 bg-[#E85D3A] text-white text-[10px] font-black tracking-wider px-2 py-0.5 rounded uppercase z-10 shadow flex items-center">
                        🔥 {activity.discountLabel}
                      </span>
                    )}

                    {/* Image / Icon container */}
                    <div className="h-44 bg-[#F5EFE6] relative flex items-center justify-center text-6xl select-none group-hover:scale-105 transition-transform duration-300">
                      <span>{activity.icon}</span>
                      <span className={`absolute bottom-3 left-3 text-[10px] uppercase font-mono px-2.5 py-1 rounded font-black tracking-wide ${difficultyColors[activity.diff]}`}>
                        {activity.diff}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration}
                      </span>
                    </div>

                    {/* Contents info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#1A7C6E]" />
                          <span className="truncate">{activity.loc}</span>
                        </div>
                        <h4 className="font-serif text-base font-black text-[#111827] leading-snug tracking-tight mb-2 group-hover:text-[#1A7C6E] transition-colors line-clamp-2">
                          {activity.name}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-bold">
                          <span className="text-[#D4A843] flex items-center font-black">
                            <Star className="w-4 h-4 fill-current mr-0.5" />
                            {activity.rating}
                          </span>
                          <span>({activity.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-150 pt-4 mt-auto flex items-center justify-between">
                        <div>
                          <p className="font-mono text-base md:text-lg font-bold">
                            {activity.prevPrice && activity.prevPrice > activity.price ? (
                              <>
                                <span className="line-through text-gray-400 text-xs font-normal mr-2">৳{activity.prevPrice.toLocaleString()}</span>
                                <span className="text-[#E85D3A] font-extrabold">৳{activity.price.toLocaleString()}</span>
                              </>
                            ) : (
                              activity.price === 0 ? <span className="text-emerald-600">Free</span> : <span className="text-[#111827]">৳{activity.price.toLocaleString()}</span>
                            )}
                          </p>
                          <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Per Person</p>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailModalId(activity.id);
                            }}
                            className="bg-[#E8F4F2] text-[#1A7C6E] hover:bg-[#1A7C6E]/10 p-2.5 rounded-lg transition-colors border border-transparent"
                            title="View Spot Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCart(activity);
                            }}
                            className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-colors duration-150 border ${added ? 'bg-[#E85D3A] text-white border-[#E85D3A]' : 'bg-[#1A7C6E] text-white border-[#1A7C6E] hover:bg-[#1A7C6E]/90'}`}
                          >
                            {added ? '✓ Remove' : '+ Add to Tour'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
