import React, { useState } from 'react';
import { MapPin, Sun, Calendar, DollarSign, Bus, Hotel, ShieldCheck, ChevronRight, Compass } from 'lucide-react';

interface DestinationDetail {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  icon: string;
  description: string;
  avgBudget: string;
  bestMonths: string;
  keySpots: string[];
  recommendedHotels: string[];
  transportOptions: string[];
  localCuisine: string[];
}

const DESTINATION_GUIDES: DestinationDetail[] = [
  {
    id: 'cox',
    name: "Cox's Bazar",
    tagline: "World's Longest Natural Sandy Sea Beach (120 km)",
    badge: "Most Popular Beach Resort",
    icon: "🏖️",
    description: "Cox's Bazar features 120 kilometers of continuous natural sandy beach along the Bay of Bengal. Highlights include Marine Drive coastal driving, Inani coral beach, Himchhari waterfalls, Moheshkhali island, and Saint Martin coral island ferry access.",
    avgBudget: "৳4,500 – ৳18,000 per person",
    bestMonths: "November to March",
    keySpots: ["Inani Coral Beach", "Marine Drive Open Jeep", "Saint Martin Coral Island", "Himchhari Hill Waterfall"],
    recommendedHotels: ["Long Beach Hotel (5-Star)", "Hotel Sea Palace (4-Star)", "Green Nature Resort (Eco)"],
    transportOptions: ["Direct AC Scania Highway Bus from Dhaka", "Ground Private Microbus & Open Jeep Rentals"],
    localCuisine: ["Loitta Fish Fry", "Fresh Bay Lobster", "Dry Fish Bhorta", "Coconut Water"]
  },
  {
    id: 'bandarban',
    name: "Bandarban",
    tagline: "High-Altitude Cloud Peaks & Indigenous Hill Tracts",
    badge: "Premier Mountain Adventure",
    icon: "🌿",
    description: "Bandarban is Bangladesh's highest mountain district. Famous for Nilgiri cloud peak (2,200 ft), Boga Lake high-altitude lagoon, Keokradong peak trekking, Golden Temple, and indigenous Marma & Tripura cultural heritage.",
    avgBudget: "৳5,000 – ৳15,000 per person",
    bestMonths: "October to February",
    keySpots: ["Nilgiri Horizon Peak", "Boga Lake High Lagoon", "Nafakhum Waterfall Trek", "Buddha Dhatu Nadi Temple"],
    recommendedHotels: ["Nilgiri Hill Resort", "Bandarban Eco Resort", "Sairu Hill Resort"],
    transportOptions: ["4x4 Mountain Chander Gari Jeeps", "Dhaka to Bandarban AC Highway Buses"],
    localCuisine: ["Bamboo Shoot Chicken (Chunga Haa)", "Marma Rice Cakes", "Wild Mountain Tea"]
  },
  {
    id: 'rangamati',
    name: "Rangamati",
    tagline: "Kaptai Lake Archipelago & Floating Tribal Markets",
    badge: "Eco Boating & Lake Life",
    icon: "💧",
    description: "Rangamati is defined by Kaptai Lake, the largest artificial reservoir in South Asia. Famous for the iconic Red Hanging Bridge, Shuvolong Waterfall boat trips, Chakma Royal Palace, Rajban Vihara monastery, and floating weave markets.",
    avgBudget: "৳4,000 – ৳12,000 per person",
    bestMonths: "September to March",
    keySpots: ["Kaptai Lake Boat Cruise", "Rangamati Hanging Bridge", "Shuvolong Waterfall", "Rajban Vihara Monastery"],
    recommendedHotels: ["Parjatan Motel Rangamati", "Hotel Green Castle", "Aronnok Holiday Resort"],
    transportOptions: ["Engineered Speedboats & Kaptai Wooden Cruisers", "Direct Bus from Dhaka/Chittagong"],
    localCuisine: ["Kaptai Lake Fresh Carp & Tilapia", "Chakma Bamboo Fish Curry", "Sticky Rice in Banana Leaf"]
  },
  {
    id: 'khagra',
    name: "Khagrachhari & Sajek",
    tagline: "Cloud Valley of Sajek & Mysterious Subterranean Caves",
    badge: "Valley Above Clouds",
    icon: "🌄",
    description: "Khagrachhari serves as the gateway to Sajek Valley, perched above the clouds on the Kasalong hill range. Features Alutila Mysterious Cave, Risang Waterfalls, and scenic Chander Gari valley rides.",
    avgBudget: "৳4,200 – ৳11,000 per person",
    bestMonths: "October to March",
    keySpots: ["Sajek Valley Helipad Clouds", "Alutila Subterranean Cave", "Risang Cascade Waterfall", "Hajachora Falls"],
    recommendedHotels: ["Sajek Megh Machang Cottage", "Ruilui Resort Sajek", "Hotel Saiduk Khagrachhari"],
    transportOptions: ["Chander Gari Mountain Escort Jeeps", "Non-AC / AC Buses from Dhaka"],
    localCuisine: ["Sajek Mountain BBQ Chicken", "Tripura Herbal Bamboo Stew", "Wild Papaya Salad"]
  },
  {
    id: 'ctg',
    name: "Chattogram",
    tagline: "Port City, Patenga Sea Beach & Heritage Gateway",
    badge: "Maritime & Heritage Gateway",
    icon: "🏙️",
    description: "Chattogram (Chittagong) is Bangladesh's primary maritime port city. Features Patenga Sea Beach, Foy's Lake amusement park, Naval Avenue sunset points, and historical shrines.",
    avgBudget: "৳3,800 – ৳10,000 per person",
    bestMonths: "Year-Round",
    keySpots: ["Patenga Sea Beach Walk", "Foy's Lake Boating", "Naval Avenue Sunset", "Bhatiari Lakes"],
    recommendedHotels: ["Radisson Blu Chattogram", "Hotel Agrabad", "The Peninsula Chittagong"],
    transportOptions: ["Sonar Bangla Express Train", "Intercity Highway Express Buses"],
    localCuisine: ["Chittagong Mezban Beef", "Kala Bhuna", "Chittagong Paratha", "Sweet Shemai"]
  }
];

export const DestinationGuidesSection: React.FC = () => {
  const [selectedDestId, setSelectedDestId] = useState<string>('cox');

  const activeDest = DESTINATION_GUIDES.find(d => d.id === selectedDestId) || DESTINATION_GUIDES[0];

  return (
    <section id="destination-guides" className="py-16 px-6 md:px-12 bg-gray-50 text-[#111827] border-t border-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A7C6E] block">
            AI Travel Citation Hub
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111827]">
            Southeast Bangladesh Destination Knowledge Guides
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Factual travel data, estimated budgets, transport routes, and key highlights for human travelers and AI answer engines.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {DESTINATION_GUIDES.map((dest) => {
            const isActive = dest.id === selectedDestId;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDestId(dest.id)}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#1A7C6E] ${
                  isActive
                    ? 'bg-[#1A7C6E] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
                aria-pressed={isActive}
              >
                <span>{dest.icon}</span>
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Destination Knowledge Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-xl space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="inline-block bg-[#E8F4F2] text-[#1A7C6E] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                {activeDest.badge}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-black text-[#111827] flex items-center gap-2">
                <span>{activeDest.icon}</span>
                <span>{activeDest.name} Travel Guide</span>
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium">
                {activeDest.tagline}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <DollarSign className="w-4 h-4 text-[#1A7C6E]" />
                <span>Est. Budget: <strong className="text-[#1A7C6E]">{activeDest.avgBudget}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Calendar className="w-4 h-4 text-[#E85D3A]" />
                <span>Best Months: <strong className="text-[#111827]">{activeDest.bestMonths}</strong></span>
              </div>
            </div>
          </div>

          {/* AI Citation Summary Paragraph */}
          <div className="bg-[#E8F4F2]/50 p-5 rounded-2xl border border-[#1A7C6E]/20 text-xs md:text-sm text-gray-800 leading-relaxed font-medium">
            <strong className="text-[#1A7C6E] block font-mono text-[11px] uppercase tracking-wider mb-1">
              📌 AI Overview Factual Summary
            </strong>
            {activeDest.description}
          </div>

          {/* Detailed Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Key Spots */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 font-serif text-sm font-black text-[#111827]">
                <MapPin className="w-4 h-4 text-[#1A7C6E]" />
                <span>Top Attractions</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700 list-none p-0 m-0">
                {activeDest.keySpots.map((spot, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A7C6E]"></span>
                    <span>{spot}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Lodging */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 font-serif text-sm font-black text-[#111827]">
                <Hotel className="w-4 h-4 text-[#D4A843]" />
                <span>Vetted Lodgings</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700 list-none p-0 m-0">
                {activeDest.recommendedHotels.map((hotel, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]"></span>
                    <span>{hotel}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transport Options */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 font-serif text-sm font-black text-[#111827]">
                <Bus className="w-4 h-4 text-[#E85D3A]" />
                <span>Transport Routes</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700 list-none p-0 m-0">
                {activeDest.transportOptions.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E85D3A]"></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Local Cuisine */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 font-serif text-sm font-black text-[#111827]">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>Must-Try Food</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700 list-none p-0 m-0">
                {activeDest.localCuisine.map((food, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Action */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111827] text-white p-6 rounded-2xl">
            <div>
              <h4 className="font-serif text-lg font-bold">
                Ready to customize your {activeDest.name} trip?
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                Add {activeDest.name} activities, hotel rooms, and transport tickets to your TourCart with 0% markup.
              </p>
            </div>

            <a
              href="#activities"
              className="bg-[#E85D3A] hover:bg-[#d44e2d] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <span>Build {activeDest.name} Package</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
