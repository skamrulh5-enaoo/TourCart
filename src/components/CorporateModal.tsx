import React, { useState } from 'react';
import { useTourCart, CorporatePayload } from '../context/TourCartContext';
import { X, Check } from 'lucide-react';

export const CorporateModal: React.FC = () => {
  const {
    corpForm, setCorpForm,
    corpModalOpen, setCorpModalOpen,
    corpSubmittedSuccess, setCorpSubmittedSuccess,
    corporateInquiries, setCorporateInquiries,
    settingsApiUrl, settingsWA,
    showToast
  } = useTourCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!corpModalOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCorpForm((p: any) => ({ ...p, [name]: value }));
  };

  const handleClose = () => {
    setCorpModalOpen(false);
    setCorpSubmittedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corpForm.company || !corpForm.contact || !corpForm.phone || !corpForm.email) {
      showToast('Please fill out all required fields!');
      return;
    }
    setIsSubmitting(true);

    const payload: CorporatePayload = {
      company: corpForm.company,
      contact: corpForm.contact,
      designation: corpForm.designation,
      phone: corpForm.phone,
      email: corpForm.email,
      size: Number(corpForm.size) || 25,
      dest: corpForm.dest || "Cox's Bazar",
      budget: corpForm.budget || '৳5,000–8,000 / Person',
      dates: corpForm.dates || 'TBD',
      proposalEmail: corpForm.proposalEmail || corpForm.email,
      requirements: corpForm.requirements || 'Standard corporate lodging',
      status: 'pending_proposal',
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Keep local operation state updated
      const updatedList = [payload, ...corporateInquiries];
      setCorporateInquiries(updatedList);
      localStorage.setItem('tcbd_corporate', JSON.stringify(updatedList));

      // 2. Sync to active spreadsheet
      if (settingsApiUrl) {
        await fetch(settingsApiUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, isCorporate: true })
        });
      }

      setCorpSubmittedSuccess(true);
      showToast('🎉 Corporate tour proposal requested!');
    } catch (err) {
      console.error(err);
      showToast('Logged locally. Network sync failed.');
      setCorpSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWALink = () => {
    const text = `Hi TourCartBD Corporate Desk! We would like to request a custom official tour quotation.
*Company*: ${corpForm.company}
*Contact*: ${corpForm.contact}
*Est Size*: ${corpForm.size} Pax
*Destination*: ${corpForm.dest}
*Dates*: ${corpForm.dates}
*Special Needs*: ${corpForm.requirements}`;

    return `https://wa.me/${settingsWA}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F5EFE6] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative border border-[#d1cdc7] max-h-[90vh] flex flex-col justify-between">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d1cdc7] bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <div>
              <h3 className="font-serif text-[#111827] text-md md:text-lg font-black leading-none">
                B2B Corporate Tour Quotator
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">
                Custom itineraries for corporate teams &amp; retreats
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content scroll area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {corpSubmittedSuccess ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-[#E8F4F2] rounded-full flex items-center justify-center mx-auto border-2 border-[#1A7C6E] text-3xl">
                ✓
              </div>
              <div>
                <h3 className="font-serif text-[#111827] text-2xl font-black mb-2">Proposal Requested Successfully!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Our B2B corporate team will review your parameters, compile customized bento layout accommodations, and send an email proposal in 2 hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
                <a 
                  href={getWALink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1F8A70] text-white hover:bg-[#155e4c] py-3 px-5 rounded-xl text-xs font-black uppercase text-center block no-underline shadow transition-colors"
                >
                  💬 Connect on WhatsApp
                </a>
                <button 
                  onClick={handleClose}
                  className="bg-gray-100 hover:bg-gray-200 text-[#111827] py-3 px-5 rounded-xl text-xs font-bold uppercase cursor-pointer"
                >
                  Return to Site
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 p-5 rounded-2xl border border-[#d1cdc7]">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    name="company"
                    value={corpForm.company}
                    onChange={handleInputChange}
                    placeholder="Grameenphone Ltd." 
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Contact Person Name *</label>
                  <input 
                    type="text" 
                    required
                    name="contact"
                    value={corpForm.contact}
                    onChange={handleInputChange}
                    placeholder="Aunindo Rahman" 
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Designation</label>
                  <input 
                    type="text" 
                    name="designation"
                    value={corpForm.designation}
                    onChange={handleInputChange}
                    placeholder="HR Lead" 
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Phone (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    required
                    name="phone"
                    value={corpForm.phone}
                    onChange={handleInputChange}
                    placeholder="01711122233" 
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Official Email *</label>
                  <input 
                    type="email" 
                    required
                    name="email"
                    value={corpForm.email}
                    onChange={handleInputChange}
                    placeholder="retreats@grameenphone.com" 
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Estimated Group Size</label>
                  <select 
                    name="size"
                    value={corpForm.size}
                    onChange={handleInputChange}
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  >
                    <option value="25">15–25 people</option>
                    <option value="50">25–50 people</option>
                    <option value="100">50–100 people</option>
                    <option value="200">100–250+ people</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Preferred Destination</label>
                  <select 
                    name="dest"
                    value={corpForm.dest}
                    onChange={handleInputChange}
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  >
                    <option value="Cox's Bazar">🏖️ Cox's Bazar</option>
                    <option value="Bandarban">🌿 Bandarban</option>
                    <option value="Rangamati">💧 Rangamati</option>
                    <option value="Khagrachhari">🌄 Khagrachhari</option>
                    <option value="Multi-city Expedition">🗺️ Multi-city Expedition</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-500">Target Budget / Pax</label>
                  <select 
                    name="budget"
                    value={corpForm.budget}
                    onChange={handleInputChange}
                    className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                  >
                    <option value="৳5,000–8,000">Economy: ৳5,000–8,000</option>
                    <option value="৳8,000–12,000">Executive: ৳8,000–12,000</option>
                    <option value="৳12,000–20,000+">Luxury / VIP: ৳12,000–20,000+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-gray-500">Target Dates or Tentative Month</label>
                <input 
                  type="text" 
                  name="dates"
                  value={corpForm.dates}
                  onChange={handleInputChange}
                  placeholder="E.g., Mid September, 3 Days / 2 Nights" 
                  className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-gray-500">List specific retreat programs, team-building, or special meals (mezzan/seafood)</label>
                <textarea 
                  name="requirements"
                  rows={2}
                  value={corpForm.requirements}
                  onChange={handleInputChange}
                  placeholder="Need floating breakfast, beach bonfire setups, conference hall with screen, team-building tug-of-war on the beach..." 
                  className="bg-white border border-[#d1cdc7] rounded-xl p-4 text-xs font-bold text-[#111827] w-full outline-none focus:border-[#1A7C6E] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-150 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={handleClose}
                  className="border border-[#d1cdc7] text-gray-500 font-bold text-xs uppercase px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:border-[#111827] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#E85D3A] text-white hover:bg-[#c94d2e] font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg cursor-pointer transition-colors shadow"
                >
                  {isSubmitting ? 'Syncing...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
