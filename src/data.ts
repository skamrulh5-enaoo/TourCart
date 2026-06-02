// TourCartBD Data Module (Strict "tour" rule applies)

export interface Activity {
  id: number;
  name: string;
  cat: string;
  dest: string;
  icon: string;
  price: number;
  duration: string;
  diff: 'easy' | 'moderate' | 'hard';
  tags: string[];
  rating: number;
  reviews: number;
  loc: string;
  types: string[];
  desc: string;
  highlights: Record<string, string>;
}

export interface Hotel {
  id: string;
  name: string;
  dest: string;
  tier: 'budget' | 'midrange' | 'premium' | 'luxury';
  icon: string;
  stars: number;
  bg: string;
  loc: string;
  specialty: string;
  amenities: string[];
  pricePerNight: number;
  desc: string;
  phone?: string;
}

export interface LocalTransport {
  id: string;
  dest: string;
  icon: string;
  name: string;
  desc: string;
  tags: Array<{ text: string; color: string }>;
  price: number;
  unit: string;
  popular?: boolean;
}

export const DESTINATIONS = [
  { id: 'all', name: 'All Destinations', icon: '🗺️', count: '55+ spots' },
  { id: 'cox', name: "Cox's Bazar", icon: '🏖️', count: '34 spots' },
  { id: 'bandarban', name: 'Bandarban', icon: '🌿', count: '18 spots' },
  { id: 'rangamati', name: 'Rangamati', icon: '💧', count: '14 spots' },
  { id: 'khagra', name: 'Khagrachhari', icon: '🌄', count: '11 spots' },
  { id: 'ctg', name: 'Chattogram', icon: '🏙️', count: '10 spots' }
];

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔥' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'water', label: 'Water Sports', icon: '🌊' },
  { id: 'island', label: 'Islands', icon: '🏝️' },
  { id: 'wildlife', label: 'Wildlife', icon: '🐅' },
  { id: 'cultural', label: 'Cultural', icon: '🏛️' },
  { id: 'religious', label: 'Religious', icon: '🛕' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'trek', label: 'Trekking', icon: '⛰️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'photo', label: 'Photo/Video', icon: '📸' },
  { id: 'food', label: 'Food', icon: '🍽️' },
];

export const TIPS: Record<string, string> = {
  all: "Cox's Bazar + Bandarban combo is our most popular 4-night itinerary for couples.",
  cox: "Best time: Nov–Mar. Ramu's Buddhist temples are only 10km from the beach — perfect half-day add-on.",
  bandarban: "Nilgiri + Nafakhum is the ultimate 3-day adventure combo. Book 2 weeks in advance.",
  rangamati: "Kaptai Lake boat + integrity Shuvolong waterfall can be done in one full day.",
  khagra: "Alutila cave + Richhang waterfall is a perfect 4hr morning combo.",
  ctg: "Combine Patenga sunset with a Mezzanine seafood dinner for a great evening."
};

export const BUS_TYPES = [
  {
    id: 'ac', icon: '❄️', name: 'AC Chair Coach',
    desc: 'Air-conditioned recliner seats with ample legroom. Most popular choice for couples and professionals. Arrives in 9–10 hrs.',
    features: ['Air conditioning', 'Recliner seats', 'USB charging', 'Blanket', 'TV entertainment', 'On-board snacks'],
    priceRange: { 'dhaka-cox': 1200, 'dhaka-bandarban': 1000, 'dhaka-rangamati': 1100, 'ctg-cox': 500, 'dhaka-ctg': 700 } as Record<string, number>,
    popular: true, label: 'Most Popular',
  },
  {
    id: 'sleeper', icon: '🛏️', name: 'AC Sleeper / Double Cabin',
    desc: 'Fully flat sleeper berths — upper and lower. Ideal for overnight journeys so you arrive fresh. Book early, limited berths.',
    features: ['Full flat berth', 'AC', 'Curtain privacy', 'USB port', 'Blanket + pillow', 'Overnight route'],
    priceRange: { 'dhaka-cox': 1800, 'dhaka-bandarban': 1600, 'dhaka-rangamati': 1700, 'ctg-cox': 800, 'dhaka-ctg': 1100 } as Record<string, number>,
    popular: false, label: 'Best for overnight',
  },
  {
    id: 'business', icon: '💺', name: 'Business Class',
    desc: 'Wide luxury seats with extra recline, premium amenities, and fewer seats per coach. For a premium travel experience.',
    features: ['Wide luxury seat', 'Fully reclining', 'Premium snack box', 'AC', 'Charging port', 'Less crowded coach'],
    priceRange: { 'dhaka-cox': 1600, 'dhaka-bandarban': 1400, 'dhaka-rangamati': 1500, 'ctg-cox': 700, 'dhaka-ctg': 900 } as Record<string, number>,
    popular: false, label: 'Premium comfort',
  },
  {
    id: 'nonac', icon: '🚌', name: 'Non-AC / Economy',
    desc: 'Budget-friendly regular bus. No air conditioning but ventilated windows. Best for budget travelers and short hops.',
    features: ['Open windows', 'Standard seats', 'Frequent stops', 'Most departures', 'Budget option', 'No booking needed'],
    priceRange: { 'dhaka-cox': 600, 'dhaka-bandarban': 550, 'dhaka-rangamati': 580, 'ctg-cox': 250, 'dhaka-ctg': 400 } as Record<string, number>,
    popular: false, label: 'Budget',
  },
];

export const BUS_OPERATORS: Record<string, Array<{ name: string; type: string; price: string }>> = {
  'dhaka-cox': [
    { name: 'Shyamoli Paribahan', type: 'AC + Sleeper', price: '৳1,200+' },
    { name: 'Hanif Enterprise', type: 'AC + Non-AC', price: '৳700+' },
    { name: 'Green Line', type: 'AC Business', price: '৳1,600+' },
    { name: 'S.Alam Paribahan', type: 'Sleeper', price: '৳1,800+' },
  ],
  'dhaka-bandarban': [
    { name: 'Shyamoli Paribahan', type: 'AC + Non-AC', price: '৳700+' },
    { name: 'Hanif Enterprise', type: 'AC', price: '৳1,000+' },
    { name: 'Saint Martin Travel', type: 'Non-AC', price: '৳550+' },
    { name: 'Unique Bus Service', type: 'AC', price: '৳1,100+' },
  ],
  'dhaka-rangamati': [
    { name: 'BRTC', type: 'AC + Non-AC', price: '৳580+' },
    { name: 'Shyamoli', type: 'AC', price: '৳1,100+' },
    { name: 'Eagle Paribahan', type: 'Non-AC', price: '৳580+' },
    { name: 'Hanif Express', type: 'AC', price: '৳1,000+' },
  ],
  'ctg-cox': [
    { name: 'S.Alam Paribahan', type: 'AC + Non-AC', price: '৳250+' },
    { name: 'Soudia Paribahan', type: 'Non-AC', price: '৳250+' },
    { name: 'Unique Bus', type: 'AC', price: '৳500+' },
    { name: 'Local Minibus', type: 'Non-AC', price: '৳200+' },
  ],
  'dhaka-ctg': [
    { name: 'Green Line', type: 'AC Business', price: '৳900+' },
    { name: 'Shyamoli', type: 'AC', price: '৳700+' },
    { name: 'Hanif Enterprise', type: 'AC + Non-AC', price: '৳500+' },
    { name: 'BRTC', type: 'AC', price: '৳600+' },
  ],
};

export const ROUTE_LABELS: Record<string, string> = {
  'dhaka-cox': "Dhaka → Cox's Bazar (9–10 hrs)",
  'dhaka-bandarban': 'Dhaka → Bandarban (8–9 hrs)',
  'dhaka-rangamati': 'Dhaka → Rangamati (7–8 hrs)',
  'ctg-cox': "Chattogram → Cox's Bazar (2.5–3 hrs)",
  'dhaka-ctg': 'Dhaka → Chattogram (5–6 hrs)',
};

export const HOTELS: Hotel[] = [
  // COX'S BAZAR
  { id: '1', name: 'Hotel Sea Palace', dest: 'cox', tier: 'premium', icon: '🏨', stars: 4, bg: 'linear-gradient(135deg,#0ea5e9,#1a7c6e)',
    loc: "Kolatali, Cox's Bazar", specialty: 'Sea-view rooms & infinity pool',
    amenities: ['Sea view', 'Pool', 'AC', 'Wi-Fi', 'Restaurant', 'Parking'],
    pricePerNight: 5500, desc: "One of Cox's Bazar's most iconic properties — all rooms face the Bay of Bengal. The infinity pool at sunset is a highlight.", phone: "+88-0341-64146" },
  { id: '2', name: 'Long Beach Hotel', dest: 'cox', tier: 'luxury', icon: '🌊', stars: 5, bg: 'linear-gradient(135deg,#0891b2,#0e7490)',
    loc: "Marine Drive, Cox's Bazar", specialty: '5-star beachfront luxury',
    amenities: ['Beachfront', 'Spa', 'Pool', 'Fine dining', 'AC', 'Conference'],
    pricePerNight: 9800, desc: "Cox's Bazar's premium luxury hotel — beachfront position on Marine Drive with a full spa, multiple restaurants and a stunning pool." },
  { id: '3', name: 'Hotel Sayeman', dest: 'cox', tier: 'premium', icon: '🏖️', stars: 4, bg: 'linear-gradient(135deg,#d97706,#b45309)',
    loc: "Sugandha Beach, Cox's Bazar", specialty: 'Rooftop restaurant & beach access',
    amenities: ['Beach access', 'Rooftop', 'AC', 'Wi-Fi', 'Gym', 'Restaurant'],
    pricePerNight: 4800, desc: "Well-established 4-star hotel at Sugandha beach. The rooftop restaurant has one of the best views in Cox's Bazar." },
  { id: '4', name: 'Neeshorgo Resort', dest: 'cox', tier: 'midrange', icon: '🌴', stars: 3, bg: 'linear-gradient(135deg,#16a34a,#15803d)',
    loc: "Inani, Cox's Bazar", specialty: 'Eco resort near Inani coral beach',
    amenities: ['Eco design', 'Garden', 'AC', 'Wi-Fi', 'Local food', 'Peaceful'],
    pricePerNight: 2800, desc: "A beautifully designed eco-resort at Inani — quieter than Kolatoli, close to the rocky coral beach. Great for nature lovers." },
  { id: '5', name: 'Hotel Saint Martin', dest: 'cox', tier: 'budget', icon: '🛖', stars: 2, bg: 'linear-gradient(135deg,#f5efe6,#d4a843)',
    loc: "Cox's Bazar Town", specialty: 'Central location, best budget value',
    amenities: ['Central', 'AC rooms', 'Wi-Fi', 'Clean', 'Affordable', 'Tour desk'],
    pricePerNight: 1400, desc: "Best value budget hotel in Cox's Bazar town — clean, well-run, and close to Burmese Market and the beach strip." },
  { id: '10', name: 'Hotel The Cox Today', dest: 'cox', tier: 'luxury', icon: '🏨', stars: 5, bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    loc: "Kolatoli, Cox's Bazar", specialty: 'Epic modern comfort & business suite',
    amenities: ['Pool', 'AC', 'Wi-Fi', 'Restaurant', 'Gym', 'Spa'],
    pricePerNight: 8500, desc: "Award-winning hotel layout with rich ocean breeze, modern architecture, business facilities, and unmatched local cuisines.", phone: "+88-09638 999 999" },
  { id: '11', name: 'Green Nature Resort', dest: 'cox', tier: 'midrange', icon: '🌿', stars: 3, bg: 'linear-gradient(135deg,#10b981,#059669)',
    loc: "Kolatoli, Cox's Bazar", specialty: 'Quiet eco forest resort',
    amenities: ['Garden', 'AC', 'Wi-Fi', 'Restaurant', 'Eco design'],
    pricePerNight: 3200, desc: "Perched near the lush green hills of Cox's Bazar — quiet stay away from noisy crowds with dedicated nature guidelines.", phone: "+880 1889-641111" },
  { id: '12', name: 'Marine Plaza', dest: 'cox', tier: 'budget', icon: '⛺', stars: 2, bg: 'linear-gradient(135deg,#6b7280,#4b5563)',
    loc: "Kolatoli Beach Road, Cox's Bazar", specialty: 'Affordable family booking',
    amenities: ['AC', 'Wi-Fi', 'Restaurant', 'Central'],
    pricePerNight: 1800, desc: "A clean, basic budget accommodation highly rated by traveling families. Minutes walking distance to key beaches.", phone: "+880-341-64146" },
  { id: '13', name: 'Ocean Paradise Hotel', dest: 'cox', tier: 'luxury', icon: '🌊', stars: 5, bg: 'linear-gradient(135deg,#06b6d4,#0891b2)',
    loc: "Kolatali Road, Cox's Bazar", specialty: 'Panoramic ocean view banquet',
    amenities: ['Beachfront', 'Pool', 'AC', 'Wi-Fi', 'Gym', 'Helipad'],
    pricePerNight: 9200, desc: "One of the absolute top 5-star properties offering massive sea view suites, indoor pools, and stellar international buffers." },
  { id: '14', name: 'Royal Tulip Luxury Resort', dest: 'cox', tier: 'luxury', icon: '🏰', stars: 5, bg: 'linear-gradient(135deg,#d97706,#b45309)',
    loc: "Inani, Cox's Bazar", specialty: 'Exclusive private beach luxury',
    amenities: ['Beachfront', 'Pool', 'AC', 'Wi-Fi', 'Spa', 'Sports Center'],
    pricePerNight: 12000, desc: "A sprawling luxury paradise at Inani coral beach. Features independent private beachfront, massive pool corridors, and elite services." },
  { id: '15', name: 'Mermaid Beach Resort', dest: 'cox', tier: 'premium', icon: '🛖', stars: 4, bg: 'linear-gradient(135deg,#ec4899,#db2777)',
    loc: "Peardale Beach, Cox's Bazar", specialty: 'Organic private villas',
    amenities: ['Beach access', 'Eco design', 'Restaurant', 'AC', 'Pool'],
    pricePerNight: 7500, desc: "Famous for its organic grass-roof villas, local artwork, private pools, and deep peaceful serenity perfect for couples." },
  { id: '16', name: 'Divine Eco Resort', dest: 'cox', tier: 'midrange', icon: '🐢', stars: 3, bg: 'linear-gradient(135deg,#15803d,#166534)',
    loc: "Inani Beach, Cox's Bazar", specialty: 'Sustainable beachfront bungalows',
    amenities: ['Eco design', 'Beachfront', 'Local food', 'Fan/AC', 'Garden'],
    pricePerNight: 3500, desc: "An outstanding green initiative directly facing the Inani Sea. Handcrafted clay cottages and solar powered amenities." },
  { id: '17', name: 'White Orchid Hotel', dest: 'cox', tier: 'midrange', icon: '🌸', stars: 3, bg: 'linear-gradient(135deg,#a855f7,#8b5cf6)',
    loc: "Kolatoli Road, Cox's Bazar", specialty: 'Cozy boutique stay',
    amenities: ['AC', 'Wi-Fi', 'Restaurant', 'Clean', 'Affordable'],
    pricePerNight: 2600, desc: "A charming mid-range boutique hotel boasting minimalist white aesthetic, high-speed fiber internet and rooftop lounge." },
  { id: '18', name: 'Heavens Guest House', dest: 'cox', tier: 'budget', icon: '🚪', stars: 2, bg: 'linear-gradient(135deg,#f59e0b,#d97706)',
    loc: "Laboni Point, Cox's Bazar", specialty: 'Clean cheap comfort',
    amenities: ['Central', 'Wi-Fi', 'Fan/AC', 'Laundry'],
    pricePerNight: 1500, desc: "Clean guest house positioned exactly adjacent to the Burmese market. Budget friendly option with 24/7 security." },
  { id: '19', name: 'Seagull Hotel', dest: 'cox', tier: 'premium', icon: '🦅', stars: 4, bg: 'linear-gradient(135deg,#10b981,#047857)',
    loc: "Sugandha Beach, Cox's Bazar", specialty: 'Lush gardens and dual pools',
    amenities: ['Beachfront', 'Pool', 'AC', 'Wi-Fi', 'Restaurant', 'Tennis'],
    pricePerNight: 5800, desc: "A timeless premium landmark featuring sprawling botanical gardens, dual swimming pools, and dedicated private entry to Sugandha Beach." },
  { id: '20', name: 'Prime Park Hotel', dest: 'cox', tier: 'midrange', icon: '🅿️', stars: 3, bg: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    loc: "Kolatoli Crossing, Cox's Bazar", specialty: 'Contemporary modern city hotel',
    amenities: ['AC', 'Wi-Fi', 'Restaurant', 'Gym', 'Conference'],
    pricePerNight: 2900, desc: "Offers sleek contemporary rooms, great mountain views, high hospitality index, and a very good local buffet breakfast." },

  // BANDARBAN
  { id: '6', name: 'Hillside Resort Bandarban', dest: 'bandarban', tier: 'midrange', icon: '🌿', stars: 3, bg: 'linear-gradient(135deg,#16a34a,#166534)',
    loc: 'Bandarban Sadar', specialty: 'Hill views & tribal architecture',
    amenities: ['Hill view', 'Tribal decor', 'AC', 'Restaurant', 'Guide desk'],
    pricePerNight: 2500, desc: "Perched on the Bandarban hills with panoramic valley views. The resort organises local tribal tours and Nilgiri permits." },
  { id: '7', name: 'Hotel Purbani Bandarban', dest: 'bandarban', tier: 'budget', icon: '⛺', stars: 2, bg: 'linear-gradient(135deg,#86efac,#4ade80)',
    loc: 'Bandarban Town', specialty: 'Budget base for hill treks',
    amenities: ['Budget', 'Central', 'Trek info', 'Fan/AC', 'Simple meals'],
    pricePerNight: 1200, desc: "Simple but clean — the go-to budget option for trekkers heading to Nilgiri, Nafakhum or Boga Lake." },
  { id: '21', name: 'Sairu Hill Resort', dest: 'bandarban', tier: 'luxury', icon: '☁️', stars: 5, bg: 'linear-gradient(135deg,#ff7e5f,#feb47b)',
    loc: 'Chimbuk Road, Bandarban', specialty: 'Infinite clouds & ultra luxury',
    amenities: ['Hill view', 'Pool', 'AC', 'Wi-Fi', 'Fine dining', 'Spa'],
    pricePerNight: 11500, desc: "Nestled 1,500ft high on hill slopes. The signature infinity pool merges with the mountain mist during sunrise. Super luxury." },
  { id: '22', name: 'Hotel Plaza Bandarban', dest: 'bandarban', tier: 'premium', icon: '🏨', stars: 4, bg: 'linear-gradient(135deg,#4f46e5,#3730a3)',
    loc: 'Bandarban Sadar', specialty: 'Modern multi-story comfort',
    amenities: ['AC', 'Wi-Fi', 'Restaurant', 'Gym', 'Central'],
    pricePerNight: 4500, desc: "One of the most premium modern hotels in Bandarban town, offering soundproof rooms, excellent local guidance and business halls." },
  { id: '23', name: 'Green Peak Resort', dest: 'bandarban', tier: 'midrange', icon: '⛰️', stars: 3, bg: 'linear-gradient(135deg,#059669,#047857)',
    loc: 'Heichha, Bandarban', specialty: 'Stunning hill valley pool resort',
    amenities: ['Pool', 'Hill view', 'Garden', 'AC', 'Wi-Fi', 'Restaurant'],
    pricePerNight: 3500, desc: "Spans across private rolling hills with a gorgeous outdoor pool, tribal food stations and supreme quiet atmosphere." },
  { id: '24', name: 'The Blue-Venture Resort', dest: 'bandarban', tier: 'midrange', icon: '🚙', stars: 3, bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    loc: 'Nilgiri Road, Bandarban', specialty: 'Adventure base camp',
    amenities: ['Trek info', 'Restaurant', 'AC', 'Wi-Fi', 'Campfire'],
    pricePerNight: 2900, desc: "Perfect staging ground for mountaineers. Built on logs, with high ceiling spacing and majestic view of early clouds." },
  { id: '25', name: 'Boga Lake Eco-cottages', dest: 'bandarban', tier: 'budget', icon: '🛖', stars: 1, bg: 'linear-gradient(135deg,#b45309,#78350f)',
    loc: 'Boga Lake, Bandarban', specialty: 'Raw tribal community living',
    amenities: ['Tribal decor', 'Simple meals', 'Fan/AC', 'Lake proximity'],
    pricePerNight: 800, desc: "Authentic wooden tribal cottage directly overlooking the legendary Boga Lake crater. Clean, minimalist backpacker choice." },
  { id: '26', name: 'Venus Resort Bandarban', dest: 'bandarban', tier: 'midrange', icon: '🌲', stars: 3, bg: 'linear-gradient(135deg,#0284c7,#0369a1)',
    loc: 'Meghla, Bandarban', specialty: 'Adjacent to Meghla Eco Park',
    amenities: ['Garden', 'AC', 'Wi-Fi', 'Restaurant', 'Cable Car'],
    pricePerNight: 3000, desc: "Surrounded by forests right next to the famous Meghla lake and hanging bridge. Outstanding local authentic bamboo delicacies." },
  { id: '27', name: 'Hills & Clouds Resort', dest: 'bandarban', tier: 'premium', icon: '🌫️', stars: 4, bg: 'linear-gradient(135deg,#f472b6,#db2777)',
    loc: 'Nilgiri Mountain, Bandarban', specialty: 'Mist viewing open balcony',
    amenities: ['Hill view', 'AC', 'Wi-Fi', 'Restaurant', 'Outdoor activities'],
    pricePerNight: 5200, desc: "A luxury cabin retreat situated right into the high mountain clouds. Private balconies with 270 degrees open hill sight." },

  // RANGAMATI
  { id: '8', name: 'Kaptai Lake Resort', dest: 'rangamati', tier: 'midrange', icon: '⛵', stars: 3, bg: 'linear-gradient(135deg,#0891b2,#0369a1)',
    loc: 'Kaptai Lake, Rangamati', specialty: 'Overwater bungalow-style rooms',
    amenities: ['Lake view', 'Boat access', 'AC', 'Restaurant', 'Hammock'],
    pricePerNight: 3200, desc: "Stunning overwater-style cottages on Kaptai Lake. Wake up to mist over the water. Boat directly to Shuvolong from the dock." },
  { id: '9', name: 'Hotel Sufia International', dest: 'rangamati', tier: 'budget', icon: '🌉', stars: 2, bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    loc: 'Rangamati Town', specialty: 'Walking distance to Hanging Bridge',
    amenities: ['Central', 'Budget', 'AC', 'Wi-Fi', 'Restaurant'],
    pricePerNight: 1600, desc: "Well-located budget hotel minutes from the famous Hanging Bridge and Rajbari. Popular with backpackers." },
  { id: '28', name: 'Rangamati Sajek Resort', dest: 'rangamati', tier: 'luxury', icon: '🛖', stars: 5, bg: 'linear-gradient(135deg,#ef4444,#dc2626)',
    loc: 'Sajek Valley, Rangamati Boundary', specialty: 'High mountain cottage luxury',
    amenities: ['Hill view', 'AC', 'Wi-Fi', 'Fine dining', 'Balcony'],
    pricePerNight: 10500, desc: "Sajek Valley luxury wooden home. Experience sunrise above hills, custom indigenous dinners, and top quality room service." },
  { id: '29', name: 'Aroni Holiday Resort', dest: 'rangamati', tier: 'midrange', icon: '🏡', stars: 3, bg: 'linear-gradient(135deg,#14b8a6,#0d9488)',
    loc: 'Asambasti, Rangamati', specialty: 'Quiet forest lakeside resort',
    amenities: ['Lake view', 'Garden', 'AC', 'Wi-Fi', 'Restaurant'],
    pricePerNight: 2700, desc: "Perfect lakeside escape situated on the peaceful Asambasti road, highly popular for the fresh lake breeze and traditional herbal teas." },
  { id: '30', name: 'Hotel Prince Rangamati', dest: 'rangamati', tier: 'budget', icon: '🏬', stars: 2, bg: 'linear-gradient(135deg,#f43f5e,#e11d48)',
    loc: 'Old Bus Station, Rangamati', specialty: 'Backpacker core, highly economical',
    amenities: ['Wi-Fi', 'Fan/AC', 'Central', 'Affordable'],
    pricePerNight: 1300, desc: "Extremely tidy rooms with fantastic proximity to commercial docks, boat rentals, and the regional bus terminal." },
  { id: '31', name: 'Polwel Park & Resort', dest: 'rangamati', tier: 'premium', icon: '🎡', stars: 4, bg: 'linear-gradient(135deg,#f59e0b,#d97706)',
    loc: 'DC Bungalow Road, Rangamati', specialty: 'Sprawling lakeside theme park resort',
    amenities: ['Lake view', 'Pool', 'AC', 'Wi-Fi', 'Restaurant', 'Gym'],
    pricePerNight: 6200, desc: "Directly features honeymoon lake cottages, water parks, dynamic infinite lake borders, and outstanding boating experiences." },
  { id: '32', name: 'Parjatan Motel Rangamati', dest: 'rangamati', tier: 'midrange', icon: '🌉', stars: 3, bg: 'linear-gradient(135deg,#059669,#047857)',
    loc: 'Deers Park Area, Rangamati', specialty: 'Govt vetted security and standard stay',
    amenities: ['Lake view', 'AC', 'Wi-Fi', 'Restaurant', 'Parking'],
    pricePerNight: 3100, desc: "Government-run iconic motel positioned exact beside the Hanging Bridge. Features highly reliable safety guidelines and clean food." },
  { id: '33', name: 'Lake View Island Resort', dest: 'rangamati', tier: 'premium', icon: '🏝️', stars: 4, bg: 'linear-gradient(135deg,#e11d48,#be123c)',
    loc: 'Kaptai Channel Island, Rangamati', specialty: 'Private resort island',
    amenities: ['Lake view', 'Boat access', 'AC', 'Wi-Fi', 'Restaurant'],
    pricePerNight: 5500, desc: "Occupies a complete beautiful green private island. Reachable only by speed boat, offering deep privacy and organic tribal cuisine." },
  { id: '34', name: 'Ganga Sabuj Eco Resort', dest: 'rangamati', tier: 'budget', icon: '🌿', stars: 2, bg: 'linear-gradient(135deg,#10b981,#047857)',
    loc: 'Subhalong Road, Rangamati', specialty: 'Lush eco cabins near waterfall',
    amenities: ['Eco design', 'Lake view', 'Fan/AC', 'Simple meals'],
    pricePerNight: 1700, desc: "Charming traditional wooden cabins set near the Subhalong waterfalls, allowing a wonderful morning hike through the green hills." }
];

export const LOCAL_TRANSPORT: LocalTransport[] = [
  { id: 'lt1', dest: 'cox', icon: '🛺', name: 'CNG Auto-rickshaw — Full Day', desc: "Hire a CNG for a full day in Cox's Bazar. Visit multiple beach spots, Ramu, and the market in one go.",
    tags: [{ text: 'Flexible', color: '#0ea5e9' }, { text: 'Per day', color: '#6b7280' }], price: 1200, unit: 'per vehicle/day' },
  { id: 'lt2', dest: 'cox', icon: '🚗', name: "Private Car — Cox's Bazar Full Day", desc: 'AC private car with driver. Comfortable for couples and small groups. Door-to-door flexibility all day.',
    tags: [{ text: 'AC', color: '#1a7c6e' }, { text: 'Couple/Group', color: '#6b7280' }], price: 2500, unit: 'per vehicle/day', popular: true },
  { id: 'lt3', dest: 'cox', icon: '🛥️', name: 'Speed Boat — Marine Drive Cruise', desc: 'Private speed boat for 2 hrs along Marine Drive coast. Great for groups wanting a sea-side tour.',
    tags: [{ text: 'Scenic', color: '#0891b2' }, { text: 'Group', color: '#6b7280' }], price: 3000, unit: 'per boat (up to 8 pax)' },
  { id: 'lt4', dest: 'cox', icon: '🏍️', name: 'Motorbike Rental — Self Drive', desc: 'Rent a motorbike for independent exploration of Marine Drive, Inani and Teknaf road. Licence required.',
    tags: [{ text: 'Solo/Couple', color: '#d97706' }, { text: 'Self drive', color: '#6b7280' }], price: 700, unit: 'per day' },
  { id: 'lt5', dest: 'cox', icon: '🚌', name: "Local Bus — Cox's Bazar to Teknaf", desc: 'Take the scenic local bus along Marine Drive all the way to Teknaf — the jumping-off point for Saint Martin.',
    tags: [{ text: 'Budget', color: '#15803d' }, { text: 'Scenic route', color: '#6b7280' }], price: 150, unit: 'per person' },
  { id: 'lt6', dest: 'bandarban', icon: '🚙', name: 'Jeep — Chimbuk & Nilgiri', desc: '4WD jeep hire for the Chimbuk–Nilgiri mountain road. Standard vehicle for hill treks — army checkpoints require this vehicle type.',
    tags: [{ text: 'Required for hills', color: '#dc2626' }, { text: 'Group (up to 7)', color: '#6b7280' }], price: 4500, unit: 'per jeep/day', popular: true },
  { id: 'lt7', dest: 'bandarban', icon: '🛵', name: 'Motorbike — Bandarban Local', desc: 'Hire a motorbike for exploring Bandarban Sadar and nearby areas like Meghla Park and Tiger Para.',
    tags: [{ text: 'Solo', color: '#7c3aed' }, { text: 'Self drive', color: '#6b7280' }], price: 600, unit: 'per day' },
  { id: 'lt8', dest: 'rangamati', icon: '⛵', name: 'Private Boat — Kaptai Lake Full Day', desc: 'Exclusive private boat for the full day on Kaptai Lake. Visit Shuvolong, tribal villages, and sunset on the water.',
    tags: [{ text: 'Unmissable', color: '#0891b2' }, { text: 'Up to 12 pax', color: '#6b7280' }], price: 5000, unit: 'per boat/day', popular: true },
  { id: 'lt9', dest: 'rangamati', icon: '🚤', name: 'Shared Boat — Shuvolong Tour', desc: 'Join a shared boat service to Shuvolong Waterfall and back. Budget-friendly and social.',
    tags: [{ text: 'Budget', color: '#15803d' }, { text: 'Shared', color: '#6b7280' }], price: 600, unit: 'per person' },
  { id: 'lt10', dest: 'khagra', icon: '🚗', name: 'Car + Driver — Khagrachhari Day Tour', desc: 'Private car with driver for Alutila cave, Richhang falls, and tribal market — all in one comfortable day.',
    tags: [{ text: 'Full day', color: '#d97706' }, { text: 'All spots', color: '#6b7280' }], price: 2000, unit: 'per vehicle/day' },
  { id: 'lt11', dest: 'khagra', icon: '🚶', name: 'Guided Walking Tour — Alutila Circuit', desc: 'Guided walk covering Alutila cave, Richhang waterfall and the tribal bazaar. No vehicle needed — all walkable.',
    tags: [{ text: 'On foot', color: '#15803d' }, { text: 'Guide incl.', color: '#6b7280' }], price: 800, unit: 'per person' },
];

export const SPOTLIGHTS = [
  { name: 'Ramu Buddhist Village', dest: "Cox's Bazar", destColor: '#0ea5e9', destBg: 'white', icon: '🛕', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', desc: 'A 10km detour from the beach reveals 35 ancient monasteries, a 100ft golden Buddha, and the haunting Ramu Rubber Garden — all in one half-day.', type: 'Religious + Nature', entry: '৳300–500' },
  { name: 'Dulahazra Safari Park', dest: "Cox's Bazar", destColor: '#0ea5e9', destBg: 'white', icon: '🐅', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', desc: 'Bengal tigers, Asian elephants, hippos and 165 species in 900 hectares. Only 40km from Cox\'s Bazar town — most travelers skip it entirely.', type: 'Wildlife', entry: '৳1,800 (safari incl.)' },
  { name: 'Alutila Cave', dest: 'Khagrachhari', destColor: '#ca8a04', destBg: 'white', icon: '🕳️', bg: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', desc: 'Walk through a 350ft-long pitch-dark cave with a stream at your feet. Torches provided. One of Bangladesh\'s most unique natural experiences.', type: 'Adventure + Nature', entry: '৳300' },
  { name: 'Shuvolong Waterfall', dest: 'Rangamati', destColor: '#0891b2', destBg: 'white', icon: '🌊', bg: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', desc: 'Only accessible by boat across Kaptai Lake. The journey is as spectacular as the falls themselves — mist, forest, and total silence.', type: 'Nature', entry: '৳2,200 (boat incl.)' },
  { name: 'Saint Martin Island', dest: "Cox's Bazar", destColor: '#0ea5e9', destBg: 'white', icon: '🏝️', bg: 'linear-gradient(135deg,#ccfbf1,#99f6e4)', desc: "Bangladesh's only coral island — 9km² of turquoise water and coconut palms. The country's most-loved day tour. Book ferry tickets early.", type: 'Island Tour', entry: '৳3,500 (ferry incl.)' },
  { name: 'Nilgiri Sunrise Trek', dest: 'Bandarban', destColor: '#16a34a', destBg: 'white', icon: '🗻', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', desc: 'Wake up above the clouds at 2,200ft. Bangladesh\'s most iconic overnight trek — tribal villages, cloud forest, and a sunrise you\'ll never forget.', type: 'Trekking + Overnight', entry: '৳4,500' },
];

export const ACTIVITIES: Activity[] = [
  // COX'S BAZAR
  { id: 1, name: 'Laboni Beach Point — Sunrise Walk', cat: 'beach', dest: 'cox', icon: '🌅', price: 0, duration: '2 hrs', diff: 'easy', tags: ['Free', 'Scenic', 'Morning'], rating: 4.8, reviews: 312, loc: "Laboni Point, Cox's Bazar", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "The main beach point and heart of Cox's Bazar. Walk along the world's longest natural sandy beach at sunrise — a golden hour experience with fishermen launching their boats. Free and unmissable.",
    highlights: { Duration: '2 hours', Difficulty: 'Easy Walk', Entry: 'Free', BestTime: '5:30–7:30am' } },
  { id: 2, name: 'Inani Beach — Coral Stone Walk', cat: 'beach', dest: 'cox', icon: '🪸', price: 0, duration: '2 hrs', diff: 'easy', tags: ['Free', 'Unique', 'Peaceful'], rating: 4.9, reviews: 278, loc: "Inani Beach, 32km south", types: ['solo', 'couple', 'group'],
    desc: 'Inani is unlike the main beach — famous for its unique hexagonal coral stones (Pathorkhani). The beach is quieter, cleaner, and strikingly beautiful. A must-visit 32km south of Cox\'s Bazar town.',
    highlights: { Distance: '32km from town', Stones: 'Pathorkhani coral', Vibe: 'Quiet & pristine', Entry: 'Free' } },
  { id: 3, name: 'Shamlapur Beach — Hidden Gem', cat: 'beach', dest: 'cox', icon: '🌊', price: 0, duration: '3 hrs', diff: 'easy', tags: ['Free', 'Remote', 'Scenic'], rating: 4.7, reviews: 134, loc: "Shamlapur, Cox's Bazar", types: ['solo', 'couple'],
    desc: 'A secluded, lesser-visited beach at the southern end of the Marine Drive corridor. Crystal-clear water, no crowd, raw natural beauty.',
    highlights: { Crowd: 'Very low', Water: 'Crystal clear', Access: 'Car/CNG only', Entry: 'Free' } },
  { id: 4, name: 'Marine Drive Road Sunset Drive', cat: 'beach', dest: 'cox', icon: '🚗', price: 800, duration: '2 hrs', diff: 'easy', tags: ['Scenic', 'Sunset', 'Iconic'], rating: 4.8, reviews: 445, loc: "80km Marine Drive, Cox's Bazar", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "The 80km Marine Drive runs alongside the beach — the world's longest sea-side road. A private car ride at sunset is a quintessential Cox's Bazar experience.",
    highlights: { Length: '80km scenic drive', Vehicle: 'Private car incl.', BestTime: '4:00–6:30pm', Extras: 'Photo stops' } },
  { id: 5, name: 'Himchari National Park & Waterfall', cat: 'nature', dest: 'cox', icon: '🏞️', price: 600, duration: '3 hrs', diff: 'moderate', tags: ['Waterfall', 'Forest', 'Scenic'], rating: 4.7, reviews: 198, loc: 'Himchari, 12km south', types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Himchari is 12km south of Cox's Bazar and features a beautiful seasonal waterfall, lush rainforest walking trails, and a Buddhist temple on the hilltop.",
    highlights: { Entry: '৳50 + guide', Waterfall: 'Best: Jun–Oct', Hilltop: 'Buddhist temple', Walk: '~2km trail' } },
  
  // WATER SPORTS
  { id: 6, name: 'Parasailing — Marine Drive', cat: 'water', dest: 'cox', icon: '🛂', price: 1200, duration: '15 min', diff: 'easy', tags: ['Thrill', 'Aerial', 'Views'], rating: 4.9, reviews: 534, loc: 'Marine Drive Beach', types: ['solo', 'couple', 'group'],
    desc: 'Soar 100ft above the Bay of Bengal strapped to a colorful parachute towed by a speedboat. The aerial view of the endless beach is breathtaking.',
    highlights: { Height: '~100 feet', Duration: '15 minutes', Safety: 'Life jacket incl.', Weight: '40–100kg' } },
  { id: 7, name: 'Jet Ski — Cox\'s Bazar Beach', cat: 'water', dest: 'cox', icon: '🛥️', price: 1500, duration: '20 min', diff: 'easy', tags: ['Speed', 'Thrill', 'Fun'], rating: 4.8, reviews: 389, loc: 'Laboni Beach Area', types: ['solo', 'couple', 'group'],
    desc: 'Ride the waves of the Bay of Bengal at full speed. Jet ski operators are stationed at multiple points along the beach.',
    highlights: { Duration: '20 minutes', Speed: 'Up to 80km/h', Safety: 'Life vest incl.', Age: 'Min 16 years' } },
  { id: 8, name: 'Surfing Lesson — Inani Beach', cat: 'water', dest: 'cox', icon: '🏄', price: 1800, duration: '2 hrs', diff: 'moderate', tags: ['Surfing', 'Learn', 'Adventure'], rating: 4.6, reviews: 87, loc: 'Inani Beach', types: ['solo', 'couple'],
    desc: "Bangladesh's emerging surf scene is centered at Inani. Certified instructors run beginner lessons on the gentle shore break.",
    highlights: { Level: 'Beginner friendly', Board: 'Included', Instructor: 'Certified', BestSeason: 'Oct–Mar' } },
  { id: 9, name: 'Speed Boat — Maheshkhali Island', cat: 'water', dest: 'cox', icon: '⚡', price: 900, duration: '45 min', diff: 'easy', tags: ['Boat', 'Island', 'Fast'], rating: 4.6, reviews: 213, loc: "Cox's Bazar Port", types: ['couple', 'group'],
    desc: "A thrilling speed boat ride across the channel from Cox's Bazar to Maheshkhali Island.",
    highlights: { Distance: '12km offshore', Time: '45 minutes', Boats: 'Shared/Private', Included: 'Life jacket' } },
  { id: 10, name: 'Snorkeling — Offshore Coral', cat: 'water', dest: 'cox', icon: '🤿', price: 2200, duration: '3 hrs', diff: 'moderate', tags: ['Underwater', 'Marine', 'Coral'], rating: 4.7, reviews: 134, loc: "Cox's Bazar offshore", types: ['solo', 'couple', 'group'],
    desc: 'Explore coral formations and tropical fish off the Cox\'s Bazar coast. gear provided. Best done on calm, clear days.',
    highlights: { Gear: 'Mask + fins incl.', Boat: 'Included', BestSeason: 'Nov–Mar', Guide: 'Underwater guide' } },

  // ISLAND TOURS
  { id: 11, name: 'Saint Martin Island — Full Day', cat: 'island', dest: 'cox', icon: '🏝️', price: 3500, duration: 'Full day', diff: 'easy', tags: ['Island', 'Snorkeling', 'Iconic', 'Must-do'], rating: 4.9, reviews: 812, loc: "Saint Martin Island (Narikel Jinjira)", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Bangladesh's only coral island — 9km² of paradise with turquoise water, coral reefs, and swaying coconut palms. The ferry from Teknaf takes 2.5hrs. Absolutely unmissable.",
    highlights: { Ferry: 'Teknaf → St. Martin', Duration: 'Full day', Snorkeling: 'Gear incl.', Overnight: 'Option available' } },
  { id: 12, name: 'Chera Dwip — Sandbar Day Tour', cat: 'island', dest: 'cox', icon: '🌴', price: 1800, duration: 'Half day', diff: 'easy', tags: ['Sandbar', 'Remote', 'Beautiful'], rating: 4.8, reviews: 267, loc: 'South of Saint Martin Island', types: ['couple', 'group'],
    desc: 'Chera Dwip is a tiny sandbar island off the southern tip of Saint Martin — emerald water, zero development, pure nature. Accessible by local boat.',
    highlights: { Access: 'Local boat from St. Martin', Facilities: 'None (bring water)', Water: 'Crystal emerald', Best: 'Oct–Feb' } },
  { id: 13, name: 'Maheshkhali Island — Adinath Temple', cat: 'island', dest: 'cox', icon: '⛩️', price: 1200, duration: 'Half day', diff: 'easy', tags: ['Island', 'Temple', 'Culture', 'Hilltop'], rating: 4.6, reviews: 198, loc: 'Maheshkhali Island', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'The only hilly island in Bangladesh. The Adinath temple on Mainak hill is dedicated to Lord Shiva and offers stunning views.',
    highlights: { Transport: 'Bridge or boat', Temple: 'Hilltop Adinath', Local: 'Betel leaf farms', Distance: "12km from Cox's" } },
  { id: 14, name: 'Sonadia Island — Eco Tour', cat: 'island', dest: 'cox', icon: '🐦', price: 2500, duration: 'Full day', diff: 'easy', tags: ['Eco', 'Birds', 'Sea turtles', 'Remote'], rating: 4.7, reviews: 89, loc: 'Sonadia Island', types: ['solo', 'couple'],
    desc: 'A small ecologically rich island famous for migratory birds and sea turtle nesting at evening. Off the usual tourist trail.',
    highlights: { Famous: 'Sea turtles at dusk', Birds: 'Migratory species', Camping: 'Possible', Access: 'Charter boat only' } },
  { id: 15, name: 'Kutubdia Island — Lighthouse', cat: 'island', dest: 'cox', icon: '🔆', price: 2800, duration: 'Full day', diff: 'easy', tags: ['Lighthouse', 'Remote', 'Historic'], rating: 4.5, reviews: 67, loc: 'Kutubdia Island', types: ['solo', 'couple'],
    desc: 'A remote offshore island with a historic lighthouse and Bangladesh\'s first wind power station. Peaceful, undeveloped, and raw.',
    highlights: { Lighthouse: 'Historic landmark', WindPower: 'Bangladesh first', Vibe: 'Off the beaten track', Access: 'Boat from Maheshkhali' } },

  // WILDLIFE
  { id: 16, name: 'Dulahazra Safari Park (Bangabandhu)', cat: 'wildlife', dest: 'cox', icon: '🐅', price: 1800, duration: '4 hrs', diff: 'easy', tags: ['Safari', 'Tigers', 'Elephants', 'Family'], rating: 4.8, reviews: 567, loc: 'Dulahazra, Chakaria (40km north)', types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Bangladesh's most famous wildlife park — 900 hectares of hills and forest home to Bengal tigers, Asian elephants, hippopotamuses, and deer.",
    highlights: { Animals: '165 species', Area: '900 hectares', Drive: "40km from Cox's", Jeep: 'Safari jeep incl.' } },
  { id: 17, name: 'Elephant Ride — Safari Park', cat: 'wildlife', dest: 'cox', icon: '🐘', price: 600, duration: '30 min', diff: 'easy', tags: ['Elephant', 'Unique', 'Kids'], rating: 4.6, reviews: 234, loc: 'Dulahazra Safari Park', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Ride a domesticated Asian elephant through the Safari Park\'s forest paths. A rare and memorable experience.',
    highlights: { Duration: '30 minutes', Safety: 'Mahout guide', Age: 'All ages', BookWith: 'Safari Park entry' } },

  // RELIGIOUS & CULTURAL (RAMU)
  { id: 18, name: 'Ramu Buddhist Village — Temple Trail', cat: 'religious', dest: 'cox', icon: '🛕', price: 500, duration: '3 hrs', diff: 'easy', tags: ['Buddhist', 'Ancient', 'Culture', 'Ramu'], rating: 4.8, reviews: 345, loc: "Ramu (10km from Cox's Bazar)", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Ramu is a historic Buddhist village named after the Royal Ramu Dynasty of Arakan. Home to 35 Buddhist temples and shrines.",
    highlights: { Distance: '10km from town', Temples: '35 in total', History: 'Since 1666', Guide: 'Local Buddhist monk guide' } },
  { id: 19, name: 'Uttar Mithachari — 100ft Buddha Statue', cat: 'religious', dest: 'cox', icon: '☸️', price: 300, duration: '2 hrs', diff: 'easy', tags: ['Buddhist', 'Iconic', '100ft statue', 'Ramu'], rating: 4.9, reviews: 412, loc: 'Uttar Mithachari, Ramu', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'A magnificent 100-foot golden lion-bed statue of Gautam Buddha on a hilltop north of Ramu.',
    highlights: { Height: '100 feet', Material: 'Stone Buddha', Setting: 'Hilltop temple', Nearby: 'Ramu town' } },
  { id: 20, name: 'Ramu Seema Vihar & Lamar Para', cat: 'religious', dest: 'cox', icon: '🏯', price: 300, duration: '2 hrs', diff: 'easy', tags: ['Monastery', 'Buddhist', 'Historic', 'Ramu'], rating: 4.7, reviews: 189, loc: 'Ramu Buddhist Monastery Complex', types: ['solo', 'couple', 'group'],
    desc: 'The Ramu Seema Vihar is the main monastery with intricate carvings and wood panels. Lamar Para Vihara nearby has a uniquely designed pagoda.',
    highlights: { Age: '200+ years', Architecture: 'Burmese-Bangladeshi', Monks: 'Active monastery', Hours: '6am–6pm' } },
  { id: 21, name: 'Rankoot Buddhist Vihar & Hills', cat: 'religious', dest: 'cox', icon: '⛪', price: 200, duration: '1.5 hrs', diff: 'easy', tags: ['Buddhist', 'Scenic', 'Ramu'], rating: 4.6, reviews: 134, loc: 'Ramu Jadi Hills', types: ['solo', 'couple', 'group'],
    desc: 'The Rankoot Vihar is set dramatically into the Ramu Jadi Hills, offering excellent views of the valley.',
    highlights: { Setting: 'Hillside', Views: 'Valley panorama', Photo: 'Excellent angles', Combo: 'With Ramu trail' } },
  { id: 22, name: 'Ramu Rubber Garden Walk', cat: 'nature', dest: 'cox', icon: '🌳', price: 200, duration: '1.5 hrs', diff: 'easy', tags: ['Rubber plantation', 'Scenic', 'Peaceful', 'Ramu'], rating: 4.5, reviews: 156, loc: 'Ramu Rubber Garden', types: ['solo', 'couple', 'group'],
    desc: 'A unique walk through the Ramu rubber garden — tall dark trees, green rubber tapping, mountain backdrop and total tranquility.',
    highlights: { Trees: 'Rubber tree plantation', Views: 'Mountains & hills', Adjacent: 'Buddhist temples', Vibe: 'Meditative & green' } },
  { id: 23, name: 'Ramu Tea Garden Visit', cat: 'nature', dest: 'cox', icon: '🍵', price: 300, duration: '2 hrs', diff: 'easy', tags: ['Tea garden', 'Scenic', 'Unique', 'Ramu'], rating: 4.6, reviews: 98, loc: 'Ramu Tea Gardens', types: ['solo', 'couple', 'group'],
    desc: 'Walk through the tea rows, watch plucking, and enjoy fresh-brewed local tea. A hidden delight in the hills surrounding Ramu.',
    highlights: { Tea: 'Fresh local brew incl.', Walk: 'Through tea rows', Picking: 'Seasonal demonstration', Combo: 'Perfect with Ramu temples' } },

  // CULTURAL, SHOPPING & FOOD
  { id: 24, name: 'Burmese Market — Shopping Tour', cat: 'shopping', dest: 'cox', icon: '🛍️', price: 300, duration: '2 hrs', diff: 'easy', tags: ['Shopping', 'Burmese', 'Local crafts', 'Souvenirs'], rating: 4.5, reviews: 456, loc: "Burmese Market, Cox's Bazar Town", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Cox's Bazar's famous Burmese Market is run by the Rakhaine community. Find hand-woven textiles, seashell crafts, and souvenirs.",
    highlights: { Products: 'Burmese crafts', Bargaining: 'Essential', Entry: 'Free', Guide: 'Negotiation tips incl.' } },
  { id: 25, name: 'Rakhaine Village & Cultural Experience', cat: 'cultural', dest: 'cox', icon: '🏘️', price: 800, duration: '3 hrs', diff: 'easy', tags: ['Tribal', 'Rakhaine', 'Culture', 'Authentic'], rating: 4.7, reviews: 112, loc: "Rakhaine Para, Cox's Bazar", types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Experience the unique culture of the Rakhaine people — Myanmar-origin Buddhist community with distinctive dress and weaving.',
    highlights: { Festival: 'Baishabi (April)', Crafts: 'Handloom weaving', Food: 'Local Rakhaine snacks', Guide: 'Rakhaine community guide' } },
  { id: 26, name: 'Aggmeda Khyang Monastery', cat: 'religious', dest: 'cox', icon: '🏛️', price: 0, duration: '1.5 hrs', diff: 'easy', tags: ['Monastery', 'Bronze Buddha', 'Historic', 'Free'], rating: 4.8, reviews: 267, loc: "Cox's Bazar Town", types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'The main Buddhist monastery right in town. Houses centuries-old handwritten manuscripts and ancient bronze Buddha statues.',
    highlights: { Entry: 'Free', Manuscripts: 'Ancient Buddhist scrolls', Buddha: 'Bronze statues', Active: 'Monks in residence' } },
  { id: 27, name: "Cox's Bazar Central Mosque (Eidgah)", cat: 'religious', dest: 'cox', icon: '🕌', price: 0, duration: '1 hr', diff: 'easy', tags: ['Mosque', 'Historic', 'Architecture', 'Free'], rating: 4.4, reviews: 134, loc: "Cox's Bazar Town", types: ['solo', 'couple', 'group'],
    desc: 'The oldest and architecturally unique mosque in town — notable for its distinct non-communal history.',
    highlights: { Age: 'Historic mosque', Architecture: 'Unique design', Entry: 'Free', Dress: 'Modest dress required' } },
  { id: 28, name: 'Drone Footage Package', cat: 'photo', dest: 'cox', icon: '🚁', price: 3500, duration: '2 hrs', diff: 'easy', tags: ['Drone', 'Aerial', '4K', 'Memory'], rating: 4.9, reviews: 156, loc: "Cox's Bazar (multiple spots)", types: ['couple', 'group', 'corporate'],
    desc: 'Professional drone cinematography package covering the beach, Marine Drive, and your chosen spots. 4K edited video provided.',
    highlights: { Output: '4K edited video + photos', Locations: 'Up to 3 spots', Delivery: '48 hours', License: 'Personal use incl.' } },
  { id: 29, name: 'Professional Beach Photography', cat: 'photo', dest: 'cox', icon: '📸', price: 2500, duration: '1.5 hrs', diff: 'easy', tags: ['Portrait', 'Couple', 'Beach', 'Photos'], rating: 4.8, reviews: 312, loc: "Cox's Bazar Beach", types: ['couple'],
    desc: 'A professional photographer meets you at the beach at golden hour for a 90-minute portrait session.',
    highlights: { Photos: '50+ edited images', Duration: '90 minutes', Golden: 'Hour timing', Delivery: '3–5 days' } },
  { id: 30, name: 'Seafood Dinner — Marine Drive', cat: 'food', dest: 'cox', icon: '🦞', price: 1200, duration: '2 hrs', diff: 'easy', tags: ['Seafood', 'Local', 'Fresh', 'Dinner'], rating: 4.7, reviews: 534, loc: 'Marine Drive Restaurant Row', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Sit with the sea breeze on Marine Drive and feast on fresh Bay of Bengal seafood — lobster, crab, king prawns, and squid.',
    highlights: { Menu: 'Daily fresh catch', Setting: 'Sea-facing', Reservation: 'Pre-booked', Avg: '৳1,200–2,000/person' } },
  { id: 31, name: 'Dried Fish Market (Shutki Market) Tour', cat: 'cultural', dest: 'cox', icon: '🐟', price: 400, duration: '2 hrs', diff: 'easy', tags: ['Local', 'Authentic', 'Market', 'Unique'], rating: 4.4, reviews: 189, loc: "Shutki Palli, Cox's Bazar", types: ['solo', 'couple', 'group'],
    desc: "A guided walk through the shutki market — a raw, authentic and very local experience. TourCartBD takes you behind the scenes.",
    highlights: { Type: 'Cultural/food tour', Guide: 'Local guide, informative', Pungency: 'Strong but authentic', Entry: 'Free' } },

  // BANDARBAN
  { id: 32, name: 'Nilgiri Peak Sunrise Trek', cat: 'trek', dest: 'bandarban', icon: '🗻', price: 4500, duration: '2 days', diff: 'hard', tags: ['Trek', 'Sunrise', 'Peak', 'Overnight'], rating: 4.9, reviews: 445, loc: 'Nilgiri, Bandarban', types: ['solo', 'group'],
    desc: "Bangladesh's most iconic mountain trek. Nilgiri (2,200ft+) offers stunning cloud-sea views. Overnight camping included.",
    highlights: { Height: '2,200ft+', Overnight: 'Camp at peak', Permit: 'Army permit incl.', Guide: 'Tribal guide' } },
  { id: 33, name: 'Chimbuk Hill — Jeep Safari', cat: 'trek', dest: 'bandarban', icon: '🚙', price: 2500, duration: 'Half day', diff: 'easy', tags: ['Jeep', 'Hills', 'Scenic', 'Clouds'], rating: 4.7, reviews: 312, loc: 'Chimbuk, Bandarban', types: ['couple', 'group', 'corporate'],
    desc: 'The second highest point accessible by jeep in Bangladesh. Climb through the clouds in a 4WD open jeep.',
    highlights: { Height: 'Second highest by road', Jeep: '4WD included', Views: '360° valley panorama', Tribal: 'Village stops' } },
  { id: 34, name: 'Boga Lake — Day Trek', cat: 'trek', dest: 'bandarban', icon: '🏔️', price: 3800, duration: 'Full day', diff: 'hard', tags: ['Lake', 'Crater lake', 'Trek', 'Tribal'], rating: 4.8, reviews: 267, loc: 'Ruma Upazila, Bandarban', types: ['solo', 'group'],
    desc: 'A stunning volcanic crater lake at 1,246ft altitude. Trek passes through Bom tribal villages and bamboo forest.',
    highlights: { Altitude: '1,246 feet', Lake: 'Volcanic crater', Tribal: 'Bom village visit', Permit: 'Required — incl.' } },
  { id: 35, name: 'Nafakhum Waterfall Expedition', cat: 'trek', dest: 'bandarban', icon: '💦', price: 6500, duration: '3 days', diff: 'hard', tags: ['Waterfall', 'Remote', 'Camping', 'Epic'], rating: 4.9, reviews: 198, loc: 'Remakri, Bandarban', types: ['solo', 'group'],
    desc: "A remote expedition through deep hills. Cross rivers by bamboo raft, camp under stars, and reach Nafakhum falls.",
    highlights: { Days: '3 days / 2 nights', Camping: 'Bamboo raft crossing', Remote: '4hr trek', Difficulty: 'Challenging' } },
  { id: 36, name: 'Meghla Eco Park & Hanging Bridge', cat: 'nature', dest: 'bandarban', icon: '🌳', price: 300, duration: '2 hrs', diff: 'easy', tags: ['Park', 'Hanging bridge', 'Easy', 'Family'], rating: 4.3, reviews: 345, loc: 'Bandarban Town', types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Bandarban's most accessible nature park — easy walking paths, a suspension bridge, cable car ride, and quiet lake.",
    highlights: { Entry: '৳50+', CableCar: 'Optional ৳150', Bridge: 'Hanging suspension', Family: 'Kid-friendly' } },
  { id: 37, name: 'Hill Tribe Lunch Experience', cat: 'food', dest: 'bandarban', icon: '🍲', price: 800, duration: '1.5 hrs', diff: 'easy', tags: ['Tribal food', 'Authentic', 'Cultural'], rating: 4.8, reviews: 145, loc: 'Bandarban Tribal Village', types: ['solo', 'couple', 'group'],
    desc: 'Eat a traditional meal prepared by a local Bom or Marma family in their elevated bamboo home.',
    highlights: { Menu: 'Tribal traditional meal', Setting: 'Family home', Host: 'Bom/Marma family', Booking: 'Must pre-book' } },

  // RANGAMATI
  { id: 38, name: 'Kaptai Lake Boat Cruise', cat: 'nature', dest: 'rangamati', icon: '⛵', price: 1800, duration: '3 hrs', diff: 'easy', tags: ['Lake', 'Boat', 'Relaxing', 'Scenic'], rating: 4.8, reviews: 412, loc: 'Kaptai Lake, Rangamati', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'The largest man-made lake in Asia. Cruise weaves through submerged hills, islands, tribal fishing villages and forest.',
    highlights: { Lake: 'Largest man-made in Asia', Boat: 'Private/shared', Duration: '3 hours', Sunset: 'Option available' } },
  { id: 39, name: 'Shuvolong Waterfall — Boat Tour', cat: 'nature', dest: 'rangamati', icon: '🌊', price: 2200, duration: 'Half day', diff: 'easy', tags: ['Waterfall', 'Boat', 'Spectacular'], rating: 4.9, reviews: 512, loc: 'Shuvolong, Rangamati', types: ['couple', 'group', 'corporate'],
    desc: 'A gorgeous waterfall in Rangamati, accessible only by boat across Kaptai Lake. Serene and majestic.',
    highlights: { Access: 'Boat only', Falls: 'Multiple tiers', Combined: 'With Kaptai cruise', BestTime: 'Jul–Nov' } },
  { id: 40, name: 'Hanging Bridge & Rajbari', cat: 'cultural', dest: 'rangamati', icon: '🌉', price: 400, duration: '2 hrs', diff: 'easy', tags: ['Historic', 'Bridge', 'Cultural', 'Landmark'], rating: 4.6, reviews: 289, loc: 'Rangamati Town', types: ['solo', 'couple', 'group', 'corporate'],
    desc: "Rangamati's iconic suspension bridge over Kaptai Lake. The adjacent Rajbari (royal palace) complex adds historical depth.",
    highlights: { Bridge: 'Suspension over lake', Rajbari: 'Historic palace', Photo: 'Iconic viewpoint', Entry: '৳20' } },
  { id: 41, name: 'Tribal Village Cultural Walk', cat: 'cultural', dest: 'rangamati', icon: '🏘️', price: 1500, duration: '3 hrs', diff: 'easy', tags: ['Tribal', 'Chakma', 'Authentic', 'Culture'], rating: 4.7, reviews: 167, loc: 'Rangamati Tribal Villages', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'A guided walk through Chakma and Marma tribal villages. See traditional bamboo homes and weaving.',
    highlights: { Tribe: 'Chakma & Marma', Craft: 'Handloom weaving', Language: 'Guide translates', Authentic: 'Community-approved' } },

  // KHAGRACHHARI
  { id: 42, name: 'Alutila Cave Exploration', cat: 'nature', dest: 'khagra', icon: '🕳️', price: 300, duration: '1.5 hrs', diff: 'moderate', tags: ['Cave', 'Adventure', 'Historic', 'Must-do'], rating: 4.7, reviews: 345, loc: 'Alutila, Khagrachhari', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Walk through a fascinating 350ft-long natural cave with a stream running through it — lit by hand-held organic torches.',
    highlights: { Length: '350 feet', Water: 'Knee-high stream', Torch: 'Provided', Duration: '~45 min walk' } },
  { id: 43, name: 'Richhang Waterfall Trek', cat: 'nature', dest: 'khagra', icon: '🏞️', price: 800, duration: '2.5 hrs', diff: 'easy', tags: ['Waterfall', 'Easy', 'Scenic', 'Popular'], rating: 4.6, reviews: 212, loc: 'Khagrachhari Town', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Trek to the most famous and scenic waterfall in Khagrachhari. Set in gorgeous natural surroundings.',
    highlights: { Walk: '40 min each way', Falls: 'Multi-tiered', Bamboo: 'Forest walk', BestTime: 'Jul–Nov' } },
  { id: 44, name: 'Tribal Morning Market Visit', cat: 'cultural', dest: 'khagra', icon: '🛖', price: 0, duration: '2 hrs', diff: 'easy', tags: ['Market', 'Tribal', 'Free', 'Authentic'], rating: 4.5, reviews: 123, loc: 'Khagrachhari Bazaar', types: ['solo', 'couple', 'group'],
    desc: 'Early morning tribal bazaar where Marma, Tripura, and Chakma communities trade fresh jungle produce and crafts.',
    highlights: { Time: '6am–9am', Entry: 'Free', Products: 'Wild honey, bamboo crafts', Tribes: 'Marma, Tripura, Chakma' } },

  // CHATTOGRAM
  { id: 45, name: 'Foy\'s Lake Eco Park', cat: 'nature', dest: 'ctg', icon: '🌲', price: 500, duration: '3 hrs', diff: 'easy', tags: ['Lake', 'Park', 'Rides', 'Family'], rating: 4.4, reviews: 678, loc: "Foy's Lake, Chattogram", types: ['solo', 'couple', 'group', 'corporate'],
    desc: "A beautiful theme park around a natural lake. High hills, boating, and fun rides make it a great family stop.",
    highlights: { Entry: '৳80–150', CableCar: '৳150 extra', Boats: 'Paddle boats available', Weekend: 'Gets crowded' } },
  { id: 46, name: 'Patenga Beach Sunset', cat: 'beach', dest: 'ctg', icon: '🌇', price: 0, duration: '2 hrs', diff: 'easy', tags: ['Free', 'Sunset', 'Beach', 'Seafood'], rating: 4.6, reviews: 789, loc: 'Patenga Beach, Chattogram', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Famous sunset spot lining the estuary with cargo ships crossing against the deep orange horizon.',
    highlights: { Entry: 'Free', Sunset: 'Spectacular industrial port view', Food: 'Street seafood stalls', Access: 'Easy from city' } },
  { id: 47, name: 'Chattogram Heritage Walk', cat: 'cultural', dest: 'ctg', icon: '🏛️', price: 700, duration: '3 hrs', diff: 'easy', tags: ['Heritage', 'Colonial', 'History', 'Architecture'], rating: 4.6, reviews: 234, loc: 'Chattogram Old Town', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'A guided historical tour of Old Chattogram including historical Portuguese and British landmarks.',
    highlights: { Period: 'Portuguese to British', Buildings: 'Colonial architecture', Guide: 'History scholar guide', Duration: '3 hours' } },
  { id: 48, name: 'Ethnological Museum — Chattogram', cat: 'cultural', dest: 'ctg', icon: '🏺', price: 200, duration: '2 hrs', diff: 'easy', tags: ['Museum', 'Tribal culture', 'Educational'], rating: 4.4, reviews: 156, loc: 'Agrabad, Chattogram', types: ['solo', 'couple', 'group', 'corporate'],
    desc: 'Bangladesh\'s only ethnological museum highlighting lifestyle and artifacts of indigenous communities.',
    highlights: { Tribes: 'All 11 hill communities', Entry: '৳20', Guide: 'Audio guide available', Duration: '1.5–2 hours' } },
];
