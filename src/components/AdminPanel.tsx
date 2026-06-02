import React, { useState } from 'react';
import { useTourCart } from '../context/TourCartContext';
import { X, Check, Trash2, Calendar, Settings, Database, RefreshCw } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    adminOpen, setAdminOpen,
    activeAdminTab, setActiveAdminTab,
    bookings, setBookings,
    corporateInquiries, setCorporateInquiries,
    settingsApiUrl, setSettingsApiUrl,
    settingsWA, setSettingsWA,
    showToast
  } = useTourCart();

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!adminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      showToast('🔑 Ops access granted!');
    } else {
      showToast('❌ Unauthorized passcode');
    }
  };

  const handleUpdateBookingStatus = (ref: string, newStatus: string) => {
    const updated = bookings.map(b => b.ref === ref ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem('tcbd_bookings', JSON.stringify(updated));
    showToast(`Status updated: ${newStatus}`);
  };

  const handleDeleteBooking = (ref: string) => {
    if (confirm('Are you sure you want to delete this booking entry?')) {
      const updated = bookings.filter(b => b.ref !== ref);
      setBookings(updated);
      localStorage.setItem('tcbd_bookings', JSON.stringify(updated));
      showToast('Booking deleted');
    }
  };

  const handleUpdateCorpStatus = (company: string, newStatus: string) => {
    const updated = corporateInquiries.map(c => c.company === company ? { ...c, status: newStatus } : c);
    setCorporateInquiries(updated);
    localStorage.setItem('tcbd_corporate', JSON.stringify(updated));
    showToast(`Corp status updated: ${newStatus}`);
  };

  const handleDeleteCorp = (company: string) => {
    if (confirm('Are you sure you want to delete this corporate request?')) {
      const updated = corporateInquiries.filter(c => c.company !== company);
      setCorporateInquiries(updated);
      localStorage.setItem('tcbd_corporate', JSON.stringify(updated));
      showToast('Inquiry deleted');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tcbd_api_url', settingsApiUrl);
    localStorage.setItem('tcbd_wa', settingsWA);
    showToast('⚙️ Administrative variables saved!');
  };

  const handleClearDatabase = () => {
    if (confirm('🚨 CRITICAL ACTION: Clear all local booking/corporate database entries? This cannot be undone.')) {
      setBookings([]);
      setCorporateInquiries([]);
      localStorage.removeItem('tcbd_bookings');
      localStorage.removeItem('tcbd_corporate');
      showToast('Database wiped cleanly!');
    }
  };

  // Analytics score calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalReceivedDeposits = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.deposit, 0);
  const totalCorporateLeads = corporateInquiries.length;
  const popularDestinationCount = bookings.reduce((acc: any, b) => {
    const items = b.items || '';
    if (items.includes("Cox's Bazar")) acc.cox = (acc.cox || 0) + 1;
    if (items.includes('Bandarban')) acc.bandarban = (acc.bandarban || 0) + 1;
    if (items.includes('Rangamati')) acc.rangamati = (acc.rangamati || 0) + 1;
    return acc;
  }, { cox: 0, bandarban: 0, rangamati: 0 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#F5EFE6] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden border border-[#d1cdc7] max-h-[92vh] flex flex-col justify-between">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d1cdc7] bg-[#111827] text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <div>
              <h3 className="font-serif text-lg font-black leading-none">TourCartBD Operations Port</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Ground logistics &amp; backend synchronization</p>
            </div>
          </div>
          <button 
            onClick={() => setAdminOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/15 text-gray-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authenticate panel */}
        {!isAuthenticated ? (
          <div className="p-8 md:p-12 text-center flex-1 flex flex-col justify-center items-center max-w-sm mx-auto space-y-6">
            <div className="text-4xl text-gray-400">🛡️</div>
            <div>
              <h4 className="text-sm font-black text-[#111827] uppercase tracking-widest mb-1">Passcode Authorization Required</h4>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">Enter administrative passcode to view active guest sheets, corporate leads, and webhooks.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-2.5">
              <input 
                type="password" 
                placeholder="Passcode (Try 'admin123')" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-[#d1cdc7] rounded-xl px-4 py-2.5 text-xs text-center font-black outline-none focus:border-[#1A7C6E]"
              />
              <button 
                type="submit"
                className="bg-[#1A7C6E] hover:bg-[#111827] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
              >
                Verify Code
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar nav keys */}
            <div className="w-full lg:w-48 bg-white border-b lg:border-b-0 lg:border-r border-[#d1cdc7] flex lg:flex-col gap-1 p-3">
              {[
                { id: 'bookings', label: '📋 Bookings Ledger', count: bookings.length },
                { id: 'corporate', label: '🏢 Corporate Leads', count: corporateInquiries.length },
                { id: 'analytics', label: '📈 Stats & Analytics', count: null },
                { id: 'settings', label: '⚙️ Sync Settings', count: null }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-black flex justify-between items-center whitespace-nowrap cursor-pointer transition-colors w-full ${activeAdminTab === tab.id ? 'bg-[#1A7C6E] text-white' : 'text-gray-600 hover:bg-[#E8F4F2]'}`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeAdminTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Dynamic ledger boards */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-[300px]">
              
              {activeAdminTab === 'bookings' && (
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-black text-[#111827] mb-2">Lead Bookings ledger</h4>
                  
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-150">
                      <p className="text-sm font-bold text-gray-400">No tour bookings gathered yet.</p>
                    </div>
                  ) : (
                    bookings.map((b, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="font-mono text-xs font-black text-gray-400">REF: {b.ref}</span>
                            <h5 className="font-serif text-base font-black text-[#111827] mt-0.5">{b.name}</h5>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
                              📞 {b.phone} &nbsp;·&nbsp; ✉️ {b.email}
                            </p>
                          </div>

                          <div className="flex gap-2 items-center">
                            <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {b.status === 'confirmed' ? '✓ Deposit Verified' : '⌚ Pending Deposit'}
                            </span>
                            
                            <button
                              onClick={() => handleDeleteBooking(b.ref)}
                              className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F5EFE6] border border-gray-150">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Arrival Date</span>
                            <span className="text-xs font-bold text-gray-700">{b.checkin}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Pax Count</span>
                            <span className="text-xs font-bold text-gray-700">{b.travellers} Travelers ({b.type})</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Itinerary Total</span>
                            <span className="text-xs font-mono font-black text-gray-800">৳{b.total.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Deposit Req ({b.paymentMethod})</span>
                            <span className="text-xs font-mono font-black text-[#1A7C6E]">৳{b.deposit.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Secured Components</span>
                          <p className="text-xs text-gray-600 block leading-relaxed mt-1">{b.items}</p>
                        </div>

                        {b.requests && b.requests !== 'None' && (
                          <div className="border-[#1A7C6E]/10 border-l-2 pl-3 py-1 bg-[#E8F4F2]">
                            <span className="text-[9px] font-bold text-[#1A7C6E] uppercase tracking-wider block">Special requests</span>
                            <p className="text-xs text-[#1A7C6E]/80 mt-0.5 leading-relaxed">{b.requests}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                          {b.status !== 'confirmed' ? (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.ref, 'confirmed')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-3 py-1.5 text-[10px] font-black uppercase cursor-pointer transition-colors"
                            >
                              ✓ Verify Deposit Pay
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.ref, 'pending_deposit')}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-3 py-1.5 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Reset to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeAdminTab === 'corporate' && (
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-black text-[#111827] mb-2">B2B Corporate inquiries</h4>
                  
                  {corporateInquiries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-150">
                      <p className="text-sm font-bold text-gray-400">No corporate proposals requested yet.</p>
                    </div>
                  ) : (
                    corporateInquiries.map((c, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold uppercase">B2B Lead</span>
                            <h5 className="font-serif text-base font-black text-[#111827] mt-1.5">{c.company}</h5>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
                              👤 {c.contact} ({c.designation || 'Visitor'}) &nbsp;·&nbsp; 📞 {c.phone} &nbsp;·&nbsp; ✉️ {c.email}
                            </p>
                          </div>

                          <div className="flex gap-2 items-center">
                            <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${c.status === 'proposal_sent' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {c.status === 'proposal_sent' ? '✓ Proposal Dispatched' : '⌚ Awaiting Proposal'}
                            </span>
                            <button
                              onClick={() => handleDeleteCorp(c.company)}
                              className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F5EFE6] border border-gray-150 text-xs">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Preferred Destination</span>
                            <span className="font-bold text-gray-700">{c.dest}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Group Size</span>
                            <span className="font-bold text-gray-700">{c.size} Employees</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Target Budget</span>
                            <span className="font-bold text-gray-700">{c.budget}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide block">Target Dates</span>
                            <span className="font-bold text-gray-700">{c.dates}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Corporate Requirements</span>
                          <p className="text-xs text-gray-600 block leading-relaxed mt-1">{c.requirements}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                          {c.status !== 'proposal_sent' ? (
                            <button
                              onClick={() => handleUpdateCorpStatus(c.company, 'proposal_sent')}
                              className="bg-sky-600 hover:bg-sky-700 text-white rounded px-3 py-1.5 text-[10px] font-black uppercase cursor-pointer"
                            >
                              ✓ Dispatch PDF Proposal
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateCorpStatus(c.company, 'pending_proposal')}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-3 py-1.5 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Reset to Awaiting
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeAdminTab === 'analytics' && (
                <div className="space-y-6">
                  <h4 className="font-serif text-lg font-black text-[#111827]">Financial conversions desk</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-150">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Gross Booked Revenue</span>
                      <p className="text-2xl font-mono font-black text-[#111827] mt-1">৳{totalRevenue.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Accumulated draft bookings</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#1A7C6E]/20">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block text-[#1A7C6E]">Deposits Collected</span>
                      <p className="text-2xl font-mono font-black text-[#1A7C6E] mt-1">৳{totalReceivedDeposits.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Deposits on verified status</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-150">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Enterprise B2B Pipeline</span>
                      <p className="text-2xl font-mono font-black text-[#111827] mt-1">{totalCorporateLeads} Deals</p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Corporate retreats requested</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-150">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Destination Popularity Tracker</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>🏖️ Cox's Bazar Booking Slots</span>
                          <span>{popularDestinationCount.cox} hits</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#1A7C6E] h-full" style={{ width: `${Math.min(100, (popularDestinationCount.cox * 20))}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>🌿 Bandarban Mountain Treks</span>
                          <span>{popularDestinationCount.bandarban} hits</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#E85D3A] h-full" style={{ width: `${Math.min(100, (popularDestinationCount.bandarban * 20))}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>💧 Rangamati Island Cruising</span>
                          <span>{popularDestinationCount.rangamati} hits</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#D4A843] h-full" style={{ width: `${Math.min(100, (popularDestinationCount.rangamati * 20))}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAdminTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <h4 className="font-serif text-lg font-black text-[#111827]">Logistics Webhook &amp; Variables</h4>
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Google Sheets / Apps Script API URL Webhook</label>
                      <input 
                        type="url" 
                        value={settingsApiUrl}
                        onChange={(e) => setSettingsApiUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycby.../exec"
                        className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-700 font-bold outline-none focus:border-[#1A7C6E] w-full"
                      />
                      <span className="text-[10px] text-gray-400 font-bold block leading-relaxed leading-none mt-1">
                        If connected, all confirmed bookings and B2B leads POST to your active Apps Script backend instantly. Under 'no-cors' mode, credentials pass safely through sandboxed embeds.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 relative border-t border-gray-100 pt-4">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Official Contact Desk WhatsApp Destination</label>
                      <input 
                        type="text" 
                        required
                        value={settingsWA}
                        onChange={(e) => setSettingsWA(e.target.value)}
                        placeholder="8801740902857"
                        className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-700 font-bold outline-none focus:border-[#1A7C6E] w-full"
                      />
                      <span className="text-[10px] text-gray-400 font-bold block leading-relaxed leading-none mt-1">
                        Enter country code with phone (e.g. 8801740902857). When the guest hits Submit, client WhatsApp triggers are pre-filled with this target handle.
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4 border-t border-gray-200 pt-4 flex-wrap">
                    <button 
                      type="submit" 
                      className="bg-[#1A7C6E] text-white hover:bg-[#111827] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Save Parameters
                    </button>

                    <button 
                      type="button"
                      onClick={handleClearDatabase}
                      className="text-red-500 hover:text-white hover:bg-red-600 border border-red-500 hover:border-transparent px-5 py-2.5 rounded-xl text-xs font-black uppercase cursor-pointer"
                    >
                      Wipe Logs Database
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
