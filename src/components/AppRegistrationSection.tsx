import React, { useState } from 'react';
import { Smartphone, CheckCircle, Mail, User, Sparkles, ShieldCheck, Download, ArrowRight } from 'lucide-react';

export interface AppRegistration {
  id: string;
  name: string;
  email: string;
  platform: string;
  createdAt: string;
}

export const AppRegistrationSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<'ios' | 'android' | 'both'>('android');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const registration: AppRegistration = {
      id: `reg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      platform,
      createdAt: new Date().toISOString()
    };

    try {
      const existingStr = localStorage.getItem('tcbd_app_registrations');
      const existing: AppRegistration[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(registration);
      localStorage.setItem('tcbd_app_registrations', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save registration locally:', err);
    }

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setIsSubmitted(false);
    setErrorMsg('');
  };

  return (
    <section id="app-registration" className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#111827] via-[#1A7C6E] to-[#0d5248] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E85D3A] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: App Teaser & Features */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#D4A843] text-xs font-mono font-bold uppercase tracking-wider mb-6 w-fit">
            <Sparkles className="w-4 h-4 text-[#D4A843]" />
            TourCart Mobile App — Coming Soon
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Get Our Mobile App <br />
            <span className="text-[#D4A843] italic font-serif">Early Access</span> &amp; Rewards
          </h2>

          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8">
            Be the first to experience seamless mobile tour booking across Southeast Bangladesh. Pre-register today with your name &amp; email to lock in a <strong className="text-white underline decoration-[#E85D3A] underline-offset-4">15% Launch Discount</strong> on your first trip booking!
          </p>

          {/* App Value Highlights */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur">
              <div className="p-2 bg-[#1A7C6E] rounded-lg text-white">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Offline Itinerary &amp; Ticket Sync</h4>
                <p className="text-xs text-gray-300">Access your tour schedules, hotel passes, and boat ticket QR codes even in zero-cellular hill tracts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur">
              <div className="p-2 bg-[#E85D3A] rounded-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Real-Time Concierge Push Alerts</h4>
                <p className="text-xs text-gray-300">Live vehicle tracking, driver contact details, and weather alerts delivered straight to your phone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Registration Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-white text-[#111827] rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A7C6E] block">Early Access Signup</span>
                    <h3 className="font-serif text-2xl font-black text-[#111827]">Register for the App</h3>
                  </div>
                  <div className="w-12 h-12 bg-[#E8F4F2] text-[#1A7C6E] rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                    📲
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl mb-4 border border-red-200">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Full Name <span className="text-[#E85D3A]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kamrul Hasan"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#1A7C6E] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Email Address <span className="text-[#E85D3A]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. kamrul@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#1A7C6E] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Device Platform Selection */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Select Your Mobile Device
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPlatform('android')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                          platform === 'android'
                            ? 'bg-[#1A7C6E] text-white border-[#1A7C6E] shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-base">🤖</span>
                        <span>Android</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlatform('ios')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                          platform === 'ios'
                            ? 'bg-[#1A7C6E] text-white border-[#1A7C6E] shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-base">📱</span>
                        <span>iOS (iPhone)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlatform('both')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                          platform === 'both'
                            ? 'bg-[#1A7C6E] text-white border-[#1A7C6E] shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-base">📲</span>
                        <span>Both</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#E85D3A] hover:bg-[#d44e2d] text-white font-extrabold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                  >
                    <span>🚀 Register For App Early Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-gray-400 font-medium mt-2">
                    🔒 Zero spam guaranteed. We will only email you when the mobile app invite is ready.
                  </p>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🎉
                </div>
                <h3 className="font-serif text-2xl font-black text-[#111827]">
                  App Registration Confirmed!
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#111827]">{name}</strong>! We've registered your email address (<strong className="text-[#1A7C6E]">{email}</strong>) for early access to the TourCart app on {platform.toUpperCase()}.
                </p>
                <div className="bg-[#E8F4F2] p-4 rounded-2xl border border-[#1A7C6E]/20 text-left space-y-1 text-xs">
                  <div className="font-bold text-[#1A7C6E] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Your Benefits Locked In:</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 pt-1 font-medium">
                    <li>15% Early Access Launch Voucher code attached to email</li>
                    <li>VIP priority access to iOS/Android TestFlight/Beta build</li>
                    <li>Exclusive offline map downloads for Cox's Bazar &amp; Hill Tracts</li>
                  </ul>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-block mt-4 text-xs font-bold text-gray-500 hover:text-[#111827] underline cursor-pointer"
                >
                  Register Another Email or Device
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
