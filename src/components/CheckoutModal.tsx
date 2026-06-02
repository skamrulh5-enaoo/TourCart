import React, { useState } from 'react';
import { useTourCart, BookingPayload } from '../context/TourCartContext';
import { X, Check, Lock, ArrowRight, ShieldCheck, Mail, Phone, Calendar, User, HelpCircle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart, clearCart, removeFromCart,
    checkoutModalOpen, setCheckoutModalOpen,
    checkoutStep, setCheckoutStep,
    selectedPayment, setSelectedPayment,
    checkoutForm, setCheckoutForm,
    settingsApiUrl, settingsWA,
    bookings, setBookings,
    bookedRef, setBookedRef,
    lastSubmitPayload, setLastSubmitPayload,
    showToast
  } = useTourCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal e.g. 0.10 for 10%
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkoutModalOpen) return null;

  const totalBeforePromo = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(totalBeforePromo * promoDiscount);
  const finalTotalAmount = totalBeforePromo - discountAmount;
  const depositAmount = Math.round(finalTotalAmount * 0.5);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'LOVEBD') {
      setPromoDiscount(0.10);
      showToast('🎉 Promo LOVEBD applied! 10% off!');
    } else {
      showToast('❌ Invalid promo code');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutForm((p: any) => ({ ...p, [name]: value }));
  };

  const handleNextStep = () => {
    if (checkoutStep === 1 && cart.length === 0) {
      showToast('Your tour cart is empty!');
      return;
    }
    if (checkoutStep === 2) {
      if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.email) {
        showToast('Please fill out Name, Phone and Email!');
        return;
      }
    }
    setCheckoutStep(checkoutStep + 1);
  };

  const handlePrevStep = () => {
    setCheckoutStep(Math.max(1, checkoutStep - 1));
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refCode = `TCBD-${Math.floor(1000 + Math.random() * 9000)}-${checkoutForm.phone.slice(-4) || 'X'}`;
    const itemSummaries = cart.map(x => `${x.icon} ${x.name} (৳${x.price.toLocaleString()})`).join(' | ');

    const payload: BookingPayload = {
      ref: refCode,
      name: checkoutForm.name,
      phone: checkoutForm.phone,
      email: checkoutForm.email,
      type: checkoutForm.type || 'couple',
      travellers: Number(checkoutForm.travellers) || 2,
      checkin: checkoutForm.checkin,
      checkout: checkoutForm.checkout,
      items: itemSummaries,
      total: finalTotalAmount,
      deposit: depositAmount,
      paymentMethod: selectedPayment,
      requests: checkoutForm.requests || 'None',
      source: checkoutForm.source || 'Direct Search',
      status: 'pending_deposit',
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Save locally to Operations list
      const updatedBookings = [payload, ...bookings];
      setBookings(updatedBookings);
      localStorage.setItem('tcbd_bookings', JSON.stringify(updatedBookings));

      // 2. Attempt Google Sheet POST if API URL defined
      if (settingsApiUrl) {
        await fetch(settingsApiUrl, {
          method: 'POST',
          mode: 'no-cors', // allows passing through standard cross-origin sandboxes
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setBookedRef(refCode);
      setLastSubmitPayload(payload);
      setCheckoutStep(4); // Advance to success
      showToast('🎉 Tour itinerary saved!');
    } catch (err) {
      console.error(err);
      showToast('Saved locally. Network sync failed.');
      setBookedRef(refCode);
      setLastSubmitPayload(payload);
      setCheckoutStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp text
  const getWhatsAppLink = () => {
    if (!lastSubmitPayload) return '';
    const text = `Hi TourCartBD team! I just built a custom tour itinerary on your portal. 
*Booking Ref*: ${lastSubmitPayload.ref}
*Lead Name*: ${lastSubmitPayload.name}
*Phone*: ${lastSubmitPayload.phone}
*Total*: ৳${lastSubmitPayload.total.toLocaleString()}
*Deposit Type*: ${lastSubmitPayload.paymentMethod}
*Itinerary Summary*: ${lastSubmitPayload.items}
*Travelers Count*: ${lastSubmitPayload.travellers}`;
    
    return `https://wa.me/${settingsWA}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F5EFE6] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative border border-[#d1cdc7] max-h-[90vh] flex flex-col justify-between">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d1cdc7] bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <div>
              <h3 className="font-serif text-[#111827] text-md md:text-lg font-black leading-none">
                {checkoutStep === 4 ? 'Tour Booking Secured!' : 'Tour Checkout Pipeline'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">
                {checkoutStep <= 3 && `Step ${checkoutStep} of 3 · Custom Package Assembly`}
                {checkoutStep === 4 && 'Complete On-Ground Coordination Log'}
              </p>
            </div>
          </div>
          {checkoutStep < 4 && (
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Steps navigation dots indicator */}
        {checkoutStep < 4 && (
          <div className="grid grid-cols-3 bg-white border-b border-[#d1cdc7]">
            <div className={`py-2 text-center text-[10px] font-black uppercase tracking-wider border-b-2 ${checkoutStep === 1 ? 'border-[#1A7C6E] text-[#1A7C6E]' : 'border-transparent text-gray-400'}`}>
              1. Review Cart
            </div>
            <div className={`py-2 text-center text-[10px] font-black uppercase tracking-wider border-b-2 ${checkoutStep === 2 ? 'border-[#1A7C6E] text-[#1A7C6E]' : 'border-transparent text-gray-400'}`}>
              2. Your Details
            </div>
            <div className={`py-2 text-center text-[10px] font-black uppercase tracking-wider border-b-2 ${checkoutStep === 3 ? 'border-[#1A7C6E] text-[#1A7C6E]' : 'border-transparent text-gray-400'}`}>
              3. Deposit Payment
            </div>
          </div>
        )}

        {/* Dynamic content scrollable area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {checkoutStep === 1 && (
            <div className="space-y-6">
              <h4 className="font-serif text-lg font-bold text-[#111827]">Verify Your Selected Tour Components</h4>
              
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto border border-[#d1cdc7] p-2.5 rounded-xl bg-white/70">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm font-bold text-gray-400">Your tour cart is empty. Please select activities or hotels first!</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center justify-between p-3.5 bg-white rounded-xl border border-gray-150 shadow-sm">
                      <div className="flex gap-3 items-center min-w-0">
                        <span className="text-xl leading-none">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#111827] truncate">{item.name}</p>
                          <p className="text-[9px] uppercase font-bold text-[#1A7C6E] inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#E8F4F2]">{item.cat}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-[#111827]">
                          {item.price === 0 ? 'Free' : `৳${item.price.toLocaleString()}`}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 p-1 rounded font-bold text-[10px] cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Promo code slot block */}
              <div className="bg-white p-4 rounded-xl border border-[#d1cdc7] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#111827] mb-0.5">Do you have a special Campaign promo code?</p>
                  <p className="text-[10px] text-gray-500 mb-2 leading-none">Try typing <strong>LOVEBD</strong> for 10% off the bundle!</p>
                  <input 
                    type="text" 
                    placeholder="Enter Coupon"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-[#F5EFE6] border border-[#d1cdc7] rounded px-3 py-1.5 text-xs font-black text-[#111827] w-full outline-none focus:border-[#1A7C6E] uppercase"
                  />
                </div>
                <button 
                  onClick={applyPromo}
                  className="bg-[#111827] text-white hover:bg-[#1A7C6E] px-4 py-2.5 rounded text-xs font-black uppercase cursor-pointer"
                >
                  Apply Code
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#111827]">Enter Tour Guest Registrations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 p-5 rounded-2xl border border-[#d1cdc7]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">Guest Lead Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      name="name"
                      value={checkoutForm.name}
                      onChange={handleInputChange}
                      placeholder="Kamrul Hasan" 
                      className="bg-white border border-[#d1cdc7] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">WhatsApp Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      required
                      name="phone"
                      value={checkoutForm.phone}
                      onChange={handleInputChange}
                      placeholder="01712000000" 
                      className="bg-white border border-[#d1cdc7] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      name="email"
                      value={checkoutForm.email}
                      onChange={handleInputChange}
                      placeholder="skamrul@gmail.com" 
                      className="bg-white border border-[#d1cdc7] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">Traveler Category</label>
                  <select 
                    name="type"
                    value={checkoutForm.type}
                    onChange={handleInputChange}
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  >
                    <option value="couple">Couple Tour (2 Pax)</option>
                    <option value="group">Friends/Family Group</option>
                    <option value="solo">Backpacker Solo Journey</option>
                    <option value="corporate">Official Corporate Retreat</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">Est. Arrival Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      name="checkin"
                      value={checkoutForm.checkin}
                      onChange={handleInputChange}
                      className="bg-white border border-[#d1cdc7] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-500">Total Travelers Count</label>
                  <input 
                    type="number" 
                    name="travellers"
                    min="1"
                    value={checkoutForm.travellers}
                    onChange={handleInputChange}
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2.5 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-gray-500">Special requests regarding transfers or medical needs</label>
                <textarea 
                  name="requests"
                  rows={2}
                  value={checkoutForm.requests}
                  onChange={handleInputChange}
                  placeholder="Need wheelchair access or early check-in at Cox's Bazar hotel..." 
                  className="bg-white border border-[#d1cdc7] rounded-xl p-4 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E] resize-none"
                />
              </div>
            </div>
          )}

          {checkoutStep === 3 && (
            <div className="space-y-6">
              <h4 className="font-serif text-lg font-bold text-[#111827]">Secure Ground Co-ordination Deposit</h4>
              
              <div className="bg-white p-5 rounded-2xl border border-[#d1cdc7]">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Choose Your Desired Payment Method:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'bKash', label: 'bKash Wallet', desc: 'Instant 5% Cashback', color: 'border-pink-500 text-pink-600 bg-pink-50' },
                    { id: 'Nagad', label: 'Nagad Mobile', desc: 'Secure Mobile Gateway', color: 'border-orange-500 text-orange-600 bg-orange-50' },
                    { id: 'Card', label: 'Visa / Card', desc: 'SSL Commerz Global', color: 'border-blue-500 text-blue-600 bg-blue-50' }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`p-4 border rounded-xl flex flex-col justify-center items-center text-center cursor-pointer transition-colors ${selectedPayment === pm.id ? pm.color : 'border-gray-200 hover:border-gray-400 bg-white'}`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider block">{pm.label}</span>
                      <span className="text-[9px] text-gray-400 mt-1 block">{pm.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#111827] text-white p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Confirmation Summary</h5>
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="font-bold">Contact Name: <span className="text-[#D4A843]">{checkoutForm.name}</span></p>
                    <p className="font-bold">Est Arrival: <span className="text-[#D4A843]">{checkoutForm.checkin}</span></p>
                    <p className="font-mono text-[10px] text-gray-400 truncate max-w-sm">{cart.length} unique components secured.</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-serif text-2xl font-black text-[#D4A843]">৳{depositAmount.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">5% Refundable Booking Deposit</p>
                </div>
              </div>

              <div className="bg-[#E8F4F2] p-4.5 rounded-xl border border-[#1A7C6E]/20 flex gap-3 text-xs text-[#1A7C6E]/90">
                <ShieldCheck className="w-6 h-6 text-[#1A7C6E] shrink-0" />
                <p className="font-semibold leading-relaxed">
                  Your deposit secures all rooms, operator bus blocks, and ground cars simultaneously. The remaining 50% is payable to your local tour guide upon arrival at your first hotel check-in.
                </p>
              </div>
            </div>
          )}

          {checkoutStep === 4 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-[#E8F4F2] rounded-full flex items-center justify-center mx-auto border-2 border-[#1A7C6E] text-3xl">
                📋
              </div>

              <div>
                <h3 className="font-serif text-[#111827] text-2xl font-black mb-2">Itinerary Layout Complete!</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your custom tour booking has been logged onto our local servers. A dedicated on-ground manager will contact you in 1 hour via WhatsApp to confirm seat reservations and room blocks.
                </p>
              </div>

              <div className="bg-white border border-[#d1cdc7] p-5 rounded-2xl max-w-md mx-auto">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Your Tracking Code</span>
                <span className="font-mono text-xl font-black text-[#1A7C6E] tracking-wider block bg-[#E8F4F2] py-2 rounded-lg border border-[#1A7C6E]/20">
                  {bookedRef}
                </span>

                <div className="h-px bg-gray-150 my-4"></div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Guest Lead</span>
                    <span className="text-xs font-bold text-[#111827]">{checkoutForm.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Contact Phone</span>
                    <span className="text-xs font-bold text-[#111827]">{checkoutForm.phone}</span>
                  </div>
                  <div className="col-span-2 mt-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Itinerary Total Budget</span>
                    <span className="text-sm font-bold text-gray-800">৳{finalTotalAmount.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-4">
                <a 
                  href={getWhatsAppLink()}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1F8A70] hover:bg-[#155e4c] text-white py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider block no-underline shadow-md transition-colors"
                >
                  💬 Send to Local Coordination Desk
                </a>
                <button 
                  onClick={() => {
                    clearCart();
                    setCheckoutModalOpen(false);
                    setCheckoutStep(1);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-[#111827] py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Create New Tour
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action footer keys */}
        {checkoutStep < 4 && (
          <div className="px-6 py-4 border-t border-[#d1cdc7] bg-white flex justify-between items-center">
            <div className="text-left font-mono text-xs md:text-sm font-bold text-[#111827]">
              <span>Grand Total: </span>
              <span className="text-[#E85D3A]">৳{finalTotalAmount.toLocaleString()} BDT</span>
              {promoDiscount > 0 && (
                <span className="text-gray-400 text-[10px] block line-through">৳{totalBeforePromo.toLocaleString()}</span>
              )}
            </div>

            <div className="flex gap-2">
              {checkoutStep > 1 && (
                <button 
                  onClick={handlePrevStep}
                  className="border border-[#d1cdc7] hover:border-[#111827] text-gray-500 hover:text-[#111827] font-black text-xs uppercase px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Back
                </button>
              )}

              {checkoutStep < 3 ? (
                <button 
                  onClick={handleNextStep}
                  className="bg-[#1A7C6E] text-white hover:bg-[#111827] font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={submitBooking}
                  disabled={isSubmitting}
                  className="bg-[#E85D3A] text-white hover:bg-[#c94d2e] font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200 shadow"
                >
                  {isSubmitting ? 'Processing Network Sync...' : '✓ Confirm & Secure Tour'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
