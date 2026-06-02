import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, Hotel, LocalTransport, ACTIVITIES, HOTELS, LOCAL_TRANSPORT, BUS_TYPES } from '../data';

export interface CartItem {
  id: string | number; // e.g. activity normal ID, hotel ID (string), bus ID, lt ID
  name: string;
  price: number;
  icon: string;
  cat: 'beach' | 'water' | 'island' | 'wildlife' | 'cultural' | 'religious' | 'nature' | 'trek' | 'shopping' | 'photo' | 'food' | 'hotel' | 'bus' | 'transport';
  dest?: string;
}

export interface BookingPayload {
  ref: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  travellers: number;
  checkin: string;
  checkout: string;
  items: string;
  total: number;
  deposit: number;
  paymentMethod: string;
  requests: string;
  source: string;
  status: string;
  timestamp: string;
}

export interface CorporatePayload {
  company: string;
  contact: string;
  designation?: string;
  phone: string;
  email: string;
  size: number;
  dest: string;
  budget?: string;
  dates?: string;
  proposalEmail?: string;
  requirements?: string;
  status: string;
  timestamp: string;
}

interface TourCartContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string | number) => void;
  clearCart: () => void;
  isInCart: (itemId: string | number) => boolean;

  // Filter conditions
  activeDest: string;
  setActiveDest: (dest: string) => void;
  activeCat: string;
  setActiveCat: (cat: string) => void;
  activeType: string;
  setActiveType: (type: string) => void;
  activeDiff: string;
  setActiveDiff: (diff: string) => void;
  priceMax: number;
  setPriceMax: (price: number) => void;

  // Hotles state
  hotelTierFilter: string;
  setHotelTierFilter: (tier: string) => void;
  hotelDestFilter: string;
  setHotelDestFilter: (dest: string) => void;
  nightsCount: number;
  setNightsCount: (nights: number) => void;

  // Bus transport state
  selectedRoute: string;
  setSelectedRoute: (route: string) => void;
  selectedBusType: string | null;
  setSelectedBusType: (id: string | null) => void;

  // Local transport state
  ltDestFilter: string;
  setLtDestFilter: (dest: string) => void;

  // Modals visibilities
  detailModalId: number | null;
  setDetailModalId: (id: number | null) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  corpModalOpen: boolean;
  setCorpModalOpen: (open: boolean) => void;
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;

  // Checkout modal state flow
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  checkoutForm: {
    name: string;
    phone: string;
    email: string;
    type: string;
    checkin: string;
    checkout: string;
    travellers: number;
    requests: string;
    source: string;
  };
  setCheckoutForm: React.Dispatch<React.SetStateAction<any>>;

  // Corporate inquiry form
  corpForm: {
    company: string;
    contact: string;
    designation: string;
    phone: string;
    email: string;
    size: string;
    dest: string;
    budget: string;
    dates: string;
    proposalEmail: string;
    requirements: string;
  };
  setCorpForm: React.Dispatch<React.SetStateAction<any>>;
  corpSubmittedSuccess: boolean;
  setCorpSubmittedSuccess: (success: boolean) => void;

  // Settings & Administrative Data
  settingsApiUrl: string;
  setSettingsApiUrl: (url: string) => void;
  settingsWA: string;
  setSettingsWA: (wa: string) => void;
  activeAdminTab: 'bookings' | 'corporate' | 'analytics' | 'settings';
  setActiveAdminTab: (tab: 'bookings' | 'corporate' | 'analytics' | 'settings') => void;
  bookings: BookingPayload[];
  setBookings: React.Dispatch<React.SetStateAction<BookingPayload[]>>;
  corporateInquiries: CorporatePayload[];
  setCorporateInquiries: React.Dispatch<React.SetStateAction<CorporatePayload[]>>;
  activities: Activity[];
  refreshActivities: () => void;
  hotels: Hotel[];
  refreshHotels: () => void;
  busClasses: typeof BUS_TYPES;
  refreshBusClasses: () => void;
  localTransport: LocalTransport[];
  refreshLocalTransport: () => void;

  // Toast status
  toastText: string;
  showToast: (text: string) => void;
  
  // Helpers
  bookedRef: string;
  setBookedRef: (ref: string) => void;
  lastSubmitPayload: BookingPayload | null;
  setLastSubmitPayload: (payload: BookingPayload | null) => void;
}

const TourCartContext = createContext<TourCartContextType | undefined>(undefined);

export const TourCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tcbd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Filters
  const [activeDest, setActiveDest] = useState('all');
  const [activeCat, setActiveCat] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeDiff, setActiveDiff] = useState('all');
  const [priceMax, setPriceMax] = useState(10000);

  // Hotels
  const [hotelTierFilter, setHotelTierFilter] = useState('all');
  const [hotelDestFilter, setHotelDestFilter] = useState('all');
  const [nightsCount, setNightsCount] = useState(2);

  // Bus
  const [selectedRoute, setSelectedRoute] = useState('dhaka-cox');
  const [selectedBusType, setSelectedBusType] = useState<string | null>(null);

  // Local transport filter
  const [ltDestFilter, setLtDestFilter] = useState('all');

  // Modals
  const [detailModalId, setDetailModalId] = useState<number | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [corpModalOpen, setCorpModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Checkout flow
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('bKash');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: '',
    checkin: todayStr,
    checkout: nextWeekStr,
    travellers: 2,
    requests: '',
    source: ''
  });

  // Corporate Proposal
  const [corpForm, setCorpForm] = useState({
    company: '',
    contact: '',
    designation: '',
    phone: '',
    email: '',
    size: '25',
    dest: '',
    budget: '',
    dates: '',
    proposalEmail: '',
    requirements: ''
  });
  const [corpSubmittedSuccess, setCorpSubmittedSuccess] = useState(false);

  // Local Administrative Config
  const [settingsApiUrl, setSettingsApiUrl] = useState(() => localStorage.getItem('tcbd_api_url') || '');
  const [settingsWA, setSettingsWA] = useState(() => localStorage.getItem('tcbd_wa') || '8801740902857');
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'corporate' | 'analytics' | 'settings'>('bookings');
  
  const [bookings, setBookings] = useState<BookingPayload[]>(() => {
    return JSON.parse(localStorage.getItem('tcbd_bookings') || '[]');
  });

  const [corporateInquiries, setCorporateInquiries] = useState<CorporatePayload[]>(() => {
    return JSON.parse(localStorage.getItem('tcbd_corporate') || '[]');
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('tcbd_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tcbd_activities:", e);
      }
    }
    localStorage.setItem('tcbd_activities', JSON.stringify(ACTIVITIES));
    return ACTIVITIES;
  });

  const refreshActivities = () => {
    const saved = localStorage.getItem('tcbd_activities');
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tcbd_activities on refresh:", e);
      }
    }
  };

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem('tcbd_hotels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tcbd_hotels:", e);
      }
    }
    localStorage.setItem('tcbd_hotels', JSON.stringify(HOTELS));
    return HOTELS;
  });

  const refreshHotels = () => {
    const saved = localStorage.getItem('tcbd_hotels');
    if (saved) {
      try {
        setHotels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tcbd_hotels on refresh:", e);
      }
    }
  };

  const [busClasses, setBusClasses] = useState<typeof BUS_TYPES>(() => {
    const saved = localStorage.getItem('tcbd_bus_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tcbd_bus_classes:", e);
      }
    }
    localStorage.setItem('tcbd_bus_classes', JSON.stringify(BUS_TYPES));
    return BUS_TYPES;
  });

  const refreshBusClasses = () => {
    const saved = localStorage.getItem('tcbd_bus_classes');
    if (saved) {
      try {
        setBusClasses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tcbd_bus_classes on refresh:", e);
      }
    }
  };

  const [localTransport, setLocalTransport] = useState<LocalTransport[]>(() => {
    const saved = localStorage.getItem('tcbd_local_transport');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tcbd_local_transport:", e);
      }
    }
    localStorage.setItem('tcbd_local_transport', JSON.stringify(LOCAL_TRANSPORT));
    return LOCAL_TRANSPORT;
  });

  const refreshLocalTransport = () => {
    const saved = localStorage.getItem('tcbd_local_transport');
    if (saved) {
      try {
        setLocalTransport(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tcbd_local_transport on refresh:", e);
      }
    }
  };

  // System Toast
  const [toastText, setToastText] = useState('');
  const [toastTimer, setToastTimer] = useState<any>(null);

  // Last Booked Details
  const [bookedRef, setBookedRef] = useState('');
  const [lastSubmitPayload, setLastSubmitPayload] = useState<BookingPayload | null>(null);

  useEffect(() => {
    localStorage.setItem('tcbd_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (text: string) => {
    setToastText(text);
    if (toastTimer) clearTimeout(toastTimer);
    const timer = setTimeout(() => setToastText(''), 2500);
    setToastTimer(timer);
  };

  const addToCart = (item: CartItem) => {
    // If it's a hotel or custom bus we want to replace existing of similar category
    setCart(prev => {
      // Avoid duplicate adding of identical ID items
      if (prev.some(x => x.id === item.id)) return prev;
      return [...prev, item];
    });
    showToast(`Added to Tour: ${item.name}`);
  };

  const removeFromCart = (itemId: string | number) => {
    setCart(prev => prev.filter(x => x.id !== itemId));
    showToast(`Removed from Tour`);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedBusType(null);
    showToast('Tour cart cleared!');
  };

  const isInCart = (itemId: string | number) => {
    return cart.some(x => x.id === itemId);
  };

  return (
    <TourCartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, isInCart,
      activeDest, setActiveDest, activeCat, setActiveCat,
      activeType, setActiveType, activeDiff, setActiveDiff,
      priceMax, setPriceMax,
      hotelTierFilter, setHotelTierFilter, hotelDestFilter, setHotelDestFilter, nightsCount, setNightsCount,
      selectedRoute, setSelectedRoute, selectedBusType, setSelectedBusType,
      ltDestFilter, setLtDestFilter,
      detailModalId, setDetailModalId, checkoutModalOpen, setCheckoutModalOpen, corpModalOpen, setCorpModalOpen, adminOpen, setAdminOpen,
      checkoutStep, setCheckoutStep, selectedPayment, setSelectedPayment, checkoutForm, setCheckoutForm,
      corpForm, setCorpForm, corpSubmittedSuccess, setCorpSubmittedSuccess,
      settingsApiUrl, setSettingsApiUrl, settingsWA, setSettingsWA, activeAdminTab, setActiveAdminTab,
      bookings, setBookings, corporateInquiries, setCorporateInquiries,
      activities, refreshActivities,
      hotels, refreshHotels,
      busClasses, refreshBusClasses,
      localTransport, refreshLocalTransport,
      toastText, showToast, bookedRef, setBookedRef, lastSubmitPayload, setLastSubmitPayload
    }}>
      {children}
    </TourCartContext.Provider>
  );
};

export const useTourCart = () => {
  const context = useContext(TourCartContext);
  if (!context) throw new Error('useTourCart must be used within a TourCartProvider');
  return context;
};
