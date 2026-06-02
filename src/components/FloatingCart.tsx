import React, { useState } from 'react';
import { useTourCart } from '../context/TourCartContext';
import { ChevronUp, ChevronDown, CheckCircle, ShieldAlert, ShoppingBag } from 'lucide-react';

export const FloatingCart: React.FC = () => {
  const { cart, removeFromCart, setCheckoutModalOpen } = useTourCart();
  const [expanded, setExpanded] = useState(false);

  if (cart.length === 0) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const deposit = Math.round(total * 0.5);

  return (
    <div 
      id="cartNotif"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-12 z-40 bg-white border border-[#d1cdc7] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 md:max-w-md w-full ${expanded ? 'max-h-[380px]' : 'max-h-[75px]'}`}
    >
      {/* Tap header to expand */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 border-b border-[#d1cdc7]/40 select-none bg-white font-serif"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1A7C6E] flex items-center justify-center text-white text-xs font-black">
            {cart.length}
          </div>
          <div>
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider leading-none">Your Live Tour Cart</h4>
            <span className="font-mono text-sm font-bold text-[#E85D3A] mt-1 inline-block">৳{total.toLocaleString()} BDT</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCheckoutModalOpen(true);
            }}
            className="bg-[#E85D3A] hover:bg-[#c94d2e] text-white hover:scale-[1.01] text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer transition-all duration-150 shadow"
          >
            🔒 Book Tour
          </button>
          <div className="text-gray-400">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded item overview lists */}
      {expanded && (
        <div className="p-4 bg-gray-50 flex flex-col justify-between h-[300px]">
          <div className="overflow-y-auto space-y-2 max-h-[190px] pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-center justify-between p-2.5 bg-white border border-gray-150 rounded-xl shadow-sm text-xs">
                <div className="flex gap-2.5 items-center min-w-0">
                  <span className="text-lg leading-none">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#111827] truncate leading-none">{item.name}</p>
                    <span className="text-[9px] uppercase font-bold text-[#1A7C6E] inline-block mt-1 bg-[#E8F4F2] px-1 py-0.5 rounded leading-none">{item.cat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono font-bold">
                  <span>{item.price === 0 ? 'Free' : `৳${item.price.toLocaleString()}`}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded font-bold cursor-pointer"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-150 pt-3 mt-auto space-y-3 bg-gray-50">
            <div className="flex justify-between items-end">
              <div className="text-[10px] text-gray-500 font-bold uppercase leading-none">
                <p>Deposit Required: <strong>৳{deposit.toLocaleString()} (50%)</strong></p>
                <p className="text-gray-400 mt-1">Verified partner protection</p>
              </div>

              <button 
                onClick={() => setCheckoutModalOpen(true)}
                className="w-1/2 bg-[#1A7C6E] text-white hover:bg-[#111827] py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-center cursor-pointer shadow transition-colors"
              >
                Assemble Booking 🔒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
