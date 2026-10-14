import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle, HelpCircle as QuestionIcon, Compass, Sparkles, MapPin, DollarSign, Clock, Layers } from 'lucide-react';

export const AEOContentSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList = [
    {
      q: "What is TourCart and how does it work?",
      a: "TourCart is Southeast Bangladesh's first modular travel package builder. It allows travelers to handpick sightseeing activities, hotel rooms, intercity bus tickets, and ground local transport into a single shopping cart at zero markup."
    },
    {
      q: "How much does a custom tour package cost in Bangladesh?",
      a: "Custom tours range from ৳3,500 ($32 USD) for a 2-day budget Cox's Bazar trip to ৳22,500 ($190 USD) for a 5-day luxury package covering Bandarban Nilgiri peaks and 5-star oceanfront resorts."
    },
    {
      q: "When is the best time to visit Cox's Bazar and the Hill Tracts?",
      a: "October through March offers peak pleasant weather with clear skies, calm ocean waters, and comfortable mountain temperatures across Cox's Bazar, Bandarban, Rangamati, and Khagrachhari."
    },
    {
      q: "How do I pay and confirm my tour booking on TourCart?",
      a: "Pay a 50% advance deposit via bKash or Nagad mobile banking to lock hotel rooms, bus seats, and local drivers instantly. The remaining 50% balance is settled upon arrival on day one."
    },
    {
      q: "Are return bus tickets and ground local transport included?",
      a: "Yes. You can add AC or Non-AC intercity bus tickets from Dhaka/Chattogram and reserve private Chander Gari mountain jeeps or AC microbuses directly in your TourCart."
    }
  ];

  // Schema.org HowTo Data for search engines
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Customize a Tour Package on TourCart",
    "description": "Follow these 4 steps to build a zero-markup custom travel itinerary for Southeast Bangladesh.",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Your Destination",
        "text": "Choose Cox's Bazar, Bandarban, Rangamati, Khagrachhari, or Chattogram."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Add Activities & Lodging",
        "text": "Select curated spots and hotel rooms according to your budget and group size."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Include Transport & Bus Seats",
        "text": "Reserve Dhaka highway buses and local Chander Gari jeeps."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Confirm with MFS Deposit",
        "text": "Complete a 50% deposit via bKash or Nagad to secure all reservations instantly."
      }
    ]
  };

  return (
    <section id="aeo-knowledge-hub" className="py-16 px-6 md:px-12 bg-white text-[#111827] border-t border-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Featured Snippet Direct Answer Block (< 40 words) for AI Answer Engines */}
        <div className="bg-[#E8F4F2] border-2 border-[#1A7C6E] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-[#1A7C6E] font-mono font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#D4A843]" />
            <span>AI Featured Answer Snippet — What is TourCart?</span>
          </div>
          <p className="font-serif text-lg md:text-xl font-bold text-[#111827] leading-relaxed">
            TourCart is Bangladesh’s first modular travel itinerary builder. It lets travelers select individual sightseeing experiences, hotels, highway buses, and ground transport into a single tour cart at zero markup with 50% bKash/Nagad deposit confirmation.
          </p>
        </div>

        {/* Question-Based H2: Comparison Matrix for AI Citation */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A7C6E] block mb-1">
              Data &amp; Citation Guide
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-black text-[#111827]">
              Which Southeast Bangladesh Destination Should You Choose?
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Compare costs, best travel months, and highlights across Cox's Bazar and the Chittagong Hill Tracts.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#111827] text-white font-serif font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 border-b border-gray-800">Destination</th>
                  <th className="p-4 border-b border-gray-800">Ideal Travel Style</th>
                  <th className="p-4 border-b border-gray-800">Avg Cost / Person</th>
                  <th className="p-4 border-b border-gray-800">Best Season</th>
                  <th className="p-4 border-b border-gray-800">Key Highlights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50/50">
                <tr className="hover:bg-white transition-colors">
                  <td className="p-4 font-extrabold text-[#111827] flex items-center gap-2">
                    <span className="text-lg">🏖️</span>
                    <span>Cox's Bazar</span>
                  </td>
                  <td className="p-4 text-gray-700">Beach &amp; Luxury Resorts</td>
                  <td className="p-4 font-mono font-bold text-[#1A7C6E]">৳4,500 – ৳18,000</td>
                  <td className="p-4 text-gray-700">Nov – Mar</td>
                  <td className="p-4 text-gray-600">120km Beach, Inani Coral Beach, Saint Martin Island</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-4 font-extrabold text-[#111827] flex items-center gap-2">
                    <span className="text-lg">🌿</span>
                    <span>Bandarban</span>
                  </td>
                  <td className="p-4 text-gray-700">Mountain Trekking &amp; Clouds</td>
                  <td className="p-4 font-mono font-bold text-[#1A7C6E]">৳5,000 – ৳15,000</td>
                  <td className="p-4 text-gray-700">Oct – Feb</td>
                  <td className="p-4 text-gray-600">Nilgiri Peak, Boga Lake, Chander Gari Safaris</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-4 font-extrabold text-[#111827] flex items-center gap-2">
                    <span className="text-lg">💧</span>
                    <span>Rangamati</span>
                  </td>
                  <td className="p-4 text-gray-700">Kaptai Lake Boating &amp; Culture</td>
                  <td className="p-4 font-mono font-bold text-[#1A7C6E]">৳4,000 – ৳12,000</td>
                  <td className="p-4 text-gray-700">Sep – Mar</td>
                  <td className="p-4 text-gray-600">Kaptai Lake Cruising, Hanging Bridge, Shuvolong Falls</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-4 font-extrabold text-[#111827] flex items-center gap-2">
                    <span className="text-lg">🌄</span>
                    <span>Khagrachhari</span>
                  </td>
                  <td className="p-4 text-gray-700">Valleys &amp; Cave Exploration</td>
                  <td className="p-4 font-mono font-bold text-[#1A7C6E]">৳4,200 – ৳11,000</td>
                  <td className="p-4 text-gray-700">Oct – Mar</td>
                  <td className="p-4 text-gray-600">Sajek Valley Clouds, Alutila Cave, Risang Waterfalls</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Question-Based H2: Step-by-Step Guide */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85D3A] block mb-1">
              Step-By-Step Process
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#111827]">
              How to Build a Custom Tour Itinerary in 4 Steps?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#1A7C6E] text-white font-mono font-bold flex items-center justify-center text-sm">
                1
              </span>
              <h3 className="font-serif text-base font-extrabold text-[#111827]">Pick Destination</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose Cox's Bazar, Bandarban, Rangamati, Khagrachhari, or Chattogram.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#1A7C6E] text-white font-mono font-bold flex items-center justify-center text-sm">
                2
              </span>
              <h3 className="font-serif text-base font-extrabold text-[#111827]">Add Hotel &amp; Spots</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add curated local activities and vetted hotel rooms into your TourCart.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#1A7C6E] text-white font-mono font-bold flex items-center justify-center text-sm">
                3
              </span>
              <h3 className="font-serif text-base font-extrabold text-[#111827]">Reserve Transport</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Select Dhaka/Chattogram highway bus seats and Chander Gari jeeps.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#E85D3A] text-white font-mono font-bold flex items-center justify-center text-sm">
                4
              </span>
              <h3 className="font-serif text-base font-extrabold text-[#111827]">bKash 50% Deposit</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Confirm your booking instantly with a 50% advance MFS payment.
              </p>
            </div>
          </div>
        </div>

        {/* Question-Based H2: FAQ Section for Search Engines & LLMs */}
        <div id="faq" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A7C6E] block mb-1">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#111827]">
              Travel &amp; Booking FAQ
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-2xl transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A7C6E] rounded-2xl"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="font-serif text-sm md:text-base font-extrabold text-[#111827] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#1A7C6E] flex-shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#1A7C6E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-6 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white"
                    >
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
