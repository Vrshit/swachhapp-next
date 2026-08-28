import {
  User,
  Report,
  Facility,
  TrainingQuestion,
  UserRole,
  RewardVoucher,
  WardRanking,
  WasteItemGuide,
  ScrapRate,
  TipperVehicle,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import {
  insertReportToSupabase,
  updateReportInSupabase,
  fetchReportsFromSupabase,
  isSupabaseConfigured,
} from './supabase';

// ──── Seed Facilities ────

const SEED_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Hyderabad Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 17.385,
    lng: 78.4867,
    address: 'Jawaharlal Nehru Road, Hyderabad',
    contact: '+91-40-1234-5678',
    operatingHours: '8:00 AM – 6:00 PM',
    capacityUtilization: 68,
  },
  {
    id: '2',
    name: 'Delhi Waste-to-Energy Facility',
    type: 'waste-to-energy',
    lat: 28.6139,
    lng: 77.209,
    address: 'Okhla Phase III, New Delhi',
    contact: '+91-11-9876-5432',
    operatingHours: '24/7',
    capacityUtilization: 84,
  },
  {
    id: '3',
    name: 'Bangalore Recycling Centre',
    type: 'recycling',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Koramangala, Bengaluru',
    contact: '+91-80-5555-1234',
    operatingHours: '9:00 AM – 5:00 PM',
    capacityUtilization: 52,
  },
  {
    id: '4',
    name: 'Mumbai Scrap Collection Hub',
    type: 'scrap-collection',
    lat: 19.076,
    lng: 72.8777,
    address: 'Dharavi, Mumbai',
    contact: '+91-22-4444-7890',
    operatingHours: '7:00 AM – 8:00 PM',
    capacityUtilization: 75,
  },
  {
    id: '5',
    name: 'Chennai Recycling Centre',
    type: 'recycling',
    lat: 13.0827,
    lng: 80.2707,
    address: 'Guindy, Chennai',
    contact: '+91-44-3333-2222',
    operatingHours: '9:00 AM – 6:00 PM',
    capacityUtilization: 60,
  },
  {
    id: '6',
    name: 'Pune Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 18.5204,
    lng: 73.8567,
    address: 'Hadapsar, Pune',
    contact: '+91-20-6666-5555',
    operatingHours: '8:00 AM – 5:00 PM',
    capacityUtilization: 70,
  },
  {
    id: '7',
    name: 'Kolkata Waste-to-Energy Plant',
    type: 'waste-to-energy',
    lat: 22.5726,
    lng: 88.3639,
    address: 'Salt Lake, Kolkata',
    contact: '+91-33-7777-8888',
    operatingHours: '24/7',
    capacityUtilization: 91,
  },
  {
    id: '8',
    name: 'Jaipur Recycling Centre',
    type: 'recycling',
    lat: 26.9124,
    lng: 75.7873,
    address: 'Mansarovar, Jaipur',
    contact: '+91-141-9999-1111',
    operatingHours: '9:00 AM – 5:30 PM',
    capacityUtilization: 45,
  },
];

// ──── AI Waste Segregation Database (30+ Common Items) ────

export const WASTE_GUIDE_DATABASE: WasteItemGuide[] = [
  {
    id: '1',
    name: 'Coconut Shell & Husk',
    category: 'wet_organic',
    binColor: 'green',
    binName: 'Green Bin (Wet / Organic)',
    decompositionTime: '5 – 6 months',
    disposalTip: 'Chop into smaller pieces for faster home or municipal biomethanisation composting.',
    icon: '🥥',
  },
  {
    id: '2',
    name: 'Milk Pouch / Polybag',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '400 – 500 years',
    disposalTip: 'Rinse with clean water, cut corner without detaching small tip to prevent microplastic litter, drop in dry bin.',
    icon: '🥛',
  },
  {
    id: '3',
    name: 'Medicines & Blister Packs',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Domestic Hazardous)',
    decompositionTime: 'Non-biodegradable',
    disposalTip: 'Wrap expired pills in paper and place in Red Hazardous bin. Never flush down sink or toilet.',
    icon: '💊',
  },
  {
    id: '4',
    name: 'Batteries & Lithium Cells',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Hazardous)',
    decompositionTime: '100+ years (toxic leaching)',
    disposalTip: 'Tape battery terminals and deposit at designated municipal e-hazard collection booths.',
    icon: '🔋',
  },
  {
    id: '5',
    name: 'Smartphone / Charger / E-Waste',
    category: 'e_waste',
    binColor: 'black',
    binName: 'Black Bin (E-Waste Recovery)',
    decompositionTime: '1,000+ years',
    disposalTip: 'Hand over to authorized scrap recovery centres or e-waste deposit kiosks for precious metal extraction.',
    icon: '📱',
  },
  {
    id: '6',
    name: 'Cardboard Box & Delivery Cartons',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '2 – 3 months',
    disposalTip: 'Flatten boxes to save space in collection vehicles and ensure paper is kept dry.',
    icon: '📦',
  },
  {
    id: '7',
    name: 'Tea Leaves & Coffee Grounds',
    category: 'wet_organic',
    binColor: 'green',
    binName: 'Green Bin (Wet Waste)',
    decompositionTime: '2 – 4 weeks',
    disposalTip: 'Excellent nitrogen booster for home compost pits and municipal aerobic digesters.',
    icon: '🍵',
  },
  {
    id: '8',
    name: 'Thermocol / EPS Styrofoam',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Waste)',
    decompositionTime: '500+ years',
    disposalTip: 'Never burn thermocol (releases carcinogenic dioxins). Store in dry bin for specialized compaction.',
    icon: '📦',
  },
  {
    id: '9',
    name: 'Broken Glass Bottles',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Glass)',
    decompositionTime: '1 million years',
    disposalTip: 'Wrap in thick newspaper and label "Sharp Glass" to protect sanitation workers during manual sorting.',
    icon: '🍾',
  },
  {
    id: '10',
    name: 'Plastic Water Bottles (PET)',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '450 years',
    disposalTip: 'Crush the bottle and recap before disposing in dry bin to prevent unauthorized reuse.',
    icon: '🧴',
  },
  {
    id: '11',
    name: 'Diapers & Sanitary Napkins',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Sanitary / Hazardous)',
    decompositionTime: '500+ years',
    disposalTip: 'Wrap securely in newspaper marked with red dot (●) as mandated under MSW Rules 2016.',
    icon: '🩹',
  },
  {
    id: '12',
    name: 'Construction Debris & Bricks',
    category: 'construction',
    binColor: 'black',
    binName: 'C&D Debris Pickup',
    decompositionTime: 'Indefinite',
    disposalTip: 'Book specialized municipal tipper on SwachhApp. Never dump near open drains or public roadsides.',
    icon: '🧱',
  },
];

export function lookupWasteItem(query: string): WasteItemGuide | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return (
    WASTE_GUIDE_DATABASE.find(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.disposalTip.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ) || null
  );
}

// ──── Rewards Voucher Catalog ────

export const SEED_REWARDS: RewardVoucher[] = [
  {
    id: 'rew_1',
    title: '5% Property Tax Rebate Token',
    category: 'tax_rebate',
    pointsCost: 150,
    description: 'Direct deduction voucher valid for annual urban municipal property tax filing.',
    discountValue: '5% OFF (Max ₹500)',
    code: 'SWACHH-TAX-5OFF',
    expiresAt: '31 Dec 2026',
    icon: '🏛️',
  },
  {
    id: 'rew_2',
    title: '5kg Bio-Compost Organic Bag',
    category: 'compost',
    pointsCost: 80,
    description: 'Free collection token for nutrient-rich organic compost from municipal biomethanisation plants.',
    discountValue: '100% Free (1 Bag)',
    code: 'SWACHH-COMPOST-FREE',
    expiresAt: '30 Nov 2026',
    icon: '🪴',
  },
  {
    id: 'rew_3',
    title: 'City Metro / Green Bus Pass',
    category: 'metro_pass',
    pointsCost: 120,
    description: 'Discount coupon for urban electric public transit and metro smart card recharge.',
    discountValue: '₹100 Transit Credit',
    code: 'SWACHH-METRO-100',
    expiresAt: '15 Jan 2027',
    icon: '🚌',
  },
  {
    id: 'rew_4',
    title: 'Dual-Bin Home Segregation Kit',
    category: 'bin_kit',
    pointsCost: 200,
    description: 'Color-coded Green & Blue household pedal bin set delivered by ward committee.',
    discountValue: 'Free Dual-Bin Kit',
    code: 'SWACHH-DUALBIN-2026',
    expiresAt: '28 Feb 2027',
    icon: '🪣',
  },
];

// ──── Municipal Ward Leaderboard ────

export const SEED_WARD_RANKINGS: WardRanking[] = [
  {
    id: 'w1',
    wardNumber: 14,
    name: 'Koramangala Ward',
    zone: 'South Zone',
    cleanlinessIndex: 4.9,
    cleanupRate: 98,
    avgResponseHours: 2.3,
    activeChampions: 142,
    rank: 1,
  },
  {
    id: 'w2',
    wardNumber: 7,
    name: 'Indiranagar Ward',
    zone: 'East Zone',
    cleanlinessIndex: 4.8,
    cleanupRate: 95,
    avgResponseHours: 2.8,
    activeChampions: 118,
    rank: 2,
  },
  {
    id: 'w3',
    wardNumber: 22,
    name: 'Yadgir Central Model Ward',
    zone: 'North Zone',
    cleanlinessIndex: 4.7,
    cleanupRate: 94,
    avgResponseHours: 3.1,
    activeChampions: 96,
    rank: 3,
  },
  {
    id: 'w4',
    wardNumber: 3,
    name: 'Whitefield Tech Ward',
    zone: 'East Zone',
    cleanlinessIndex: 4.5,
    cleanupRate: 89,
    avgResponseHours: 3.8,
    activeChampions: 84,
    rank: 4,
  },
  {
    id: 'w5',
    wardNumber: 19,
    name: 'Jayanagar Heritage Ward',
    zone: 'South Zone',
    cleanlinessIndex: 4.4,
    cleanupRate: 87,
    avgResponseHours: 4.2,
    activeChampions: 72,
    rank: 5,
  },
];

// ──── Daily Scrap Buyback Rates ────

export const SEED_SCRAP_RATES: ScrapRate[] = [
  { id: 'sc_1', material: 'PET Plastic Bottles', pricePerKg: 18, trend: 'up', icon: '🧴' },
  { id: 'sc_2', material: 'Cardboard & Cartons', pricePerKg: 12, trend: 'stable', icon: '📦' },
  { id: 'sc_3', material: 'Aluminum Cans & Foil', pricePerKg: 110, trend: 'up', icon: '🥫' },
  { id: 'sc_4', material: 'Old Newspapers (ONP)', pricePerKg: 14, trend: 'stable', icon: '📰' },
  { id: 'sc_5', material: 'E-Waste (Circuit Boards)', pricePerKg: 85, trend: 'up', icon: '🔌' },
  { id: 'sc_6', material: 'Brass / Copper Scrap', pricePerKg: 420, trend: 'down', icon: '🪙' },
];

// ──── Live Tipper Vehicles Simulation ────

export const SEED_TIPPERS: TipperVehicle[] = [
  {
    id: 'tip_1',
    vehicleNumber: 'KA-33-E-1042',
    driverName: 'Ramesh Kumar',
    currentLat: 12.972,
    currentLng: 77.595,
    status: 'en_route',
    assignedWard: 'Ward 14',
    batteryLevel: 82,
  },
  {
    id: 'tip_2',
    vehicleNumber: 'DL-01-GB-4421',
    driverName: 'Suresh Patil',
    currentLat: 28.614,
    currentLng: 77.21,
    status: 'collecting',
    assignedWard: 'Ward 07',
    batteryLevel: 67,
  },
  {
    id: 'tip_3',
    vehicleNumber: 'TS-09-EV-8832',
    driverName: 'Mohammad Ali',
    currentLat: 17.386,
    currentLng: 78.487,
    status: 'unloading',
    assignedWard: 'Ward 22',
    batteryLevel: 94,
  },
];

// ──── Training Questions ────

export const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 1,
    question: 'Which bin should you use for vegetable peels and food scraps?',
    options: ['Dry Waste (Blue)', 'Wet Waste (Green)', 'Hazardous Waste (Red)', 'Any bin'],
    correctAnswer: 1,
    explanation:
      'Vegetable peels and food scraps are biodegradable organic waste. They go into the Green (Wet Waste) bin for composting.',
  },
  {
    id: 2,
    question: 'Which of the following is classified as domestic hazardous waste?',
    options: ['Newspaper', 'Banana peel', 'Used batteries', 'Cardboard box'],
    correctAnswer: 2,
    explanation:
      'Used batteries contain toxic heavy metals (lead, cadmium, mercury) and must be disposed in the Red (Hazardous) bin, never mixed with regular waste.',
  },
  {
    id: 3,
    question: 'What is source segregation?',
    options: [
      'Collecting waste from multiple sources',
      'Separating waste at the point of generation into categories',
      'Dumping waste in landfills',
      'Burning waste in open areas',
    ],
    correctAnswer: 1,
    explanation:
      'Source segregation means separating waste into dry, wet, and hazardous categories right where it is generated (home, office, shop) before collection.',
  },
  {
    id: 4,
    question: 'Which of these can be composted at home?',
    options: ['Plastic bottles', 'Glass jars', 'Tea leaves and fruit peels', 'Styrofoam'],
    correctAnswer: 2,
    explanation:
      'Tea leaves and fruit peels are organic matter that decomposes naturally. A simple home compost pit or bin can convert them into nutrient-rich manure in 45-60 days.',
  },
  {
    id: 5,
    question: "What percentage of India's waste is scientifically treated (2021-22)?",
    options: ['About 25%', 'About 54%', 'About 75%', 'About 90%'],
    correctAnswer: 1,
    explanation:
      'According to the CPCB MSW Annual Report 2021-22, only about 54% (91,511 TPD out of 1,70,339 TPD) of India\'s municipal solid waste is scientifically treated or processed.',
  },
];

// ──── localStorage keys & helpers ────

const USERS_KEY = 'wm_users';
const REPORTS_KEY = 'wm_reports';
const FACILITIES_KEY = 'wm_facilities';
const CURRENT_USER_KEY = 'wm_current_user';
const REDEEMED_REWARDS_KEY = 'wm_redeemed_rewards';
const LANG_KEY = 'wm_lang';

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError') {
      const reports = getItem<Report[]>(REPORTS_KEY, []);
      if (reports.length > 5) {
        const trimmed = reports.slice(reports.length - 5);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(trimmed));
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
          console.error('Still unable to save to localStorage after cleanup.');
        }
      }
    }
  }
}

// ──── Image Compression ────

export function compressImage(dataUrl: string, maxWidth = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}

// ──── Distance Utility ────

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ──── Users ────

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, []);
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'citizen'
): User {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('Email already registered');
  }
  const user: User = {
    id: uuidv4(),
    name,
    email,
    password,
    role,
    trainingCompleted: false,
    trainingScore: 0,
    reportsCount: 0,
    civicPoints: 50, // Starter bonus
    badge: 'none',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setItem(USERS_KEY, users);
  return user;
}

export function loginUser(email: string, password: string): User {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  setItem(CURRENT_USER_KEY, user);
  return user;
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(CURRENT_USER_KEY, null);
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUser(updated: User): void {
  const users = getUsers().map((u) => (u.id === updated.id ? updated : u));
  setItem(USERS_KEY, users);
  setItem(CURRENT_USER_KEY, updated);
}

function computeBadge(user: User): User['badge'] {
  if (user.reportsCount >= 10) return 'hero';
  if (user.reportsCount >= 5) return 'champion';
  if (user.reportsCount >= 1) return 'reporter';
  return 'none';
}

export function completeTraining(score: number): User {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const passed = score >= 3;
  user.trainingCompleted = passed;
  user.trainingScore = score;
  user.badge = computeBadge(user);
  updateUser(user);
  return user;
}

// ──── Demo Login Helpers ────

export function ensureDemoAccounts(): void {
  const users = getUsers();
  const citizenExists = users.find((u) => u.email === 'citizen@demo.in');
  const adminExists = users.find((u) => u.email === 'admin@demo.in');
  if (!citizenExists) {
    registerUser('Demo Citizen', 'citizen@demo.in', 'demo1234', 'citizen');
  }
  if (!adminExists) {
    registerUser('Ward Officer', 'admin@demo.in', 'admin1234', 'admin');
  }
}

// ──── Reports ────

export function getReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, []);
}

export async function syncReportsWithSupabase(): Promise<Report[]> {
  if (isSupabaseConfigured()) {
    const cloudReports = await fetchReportsFromSupabase();
    if (cloudReports && cloudReports.length > 0) {
      setItem(REPORTS_KEY, cloudReports);
      return cloudReports;
    }
  }
  return getReports();
}

export function addReport(
  data: Omit<Report, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>
): Report {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');

  const randomTipper = SEED_TIPPERS[Math.floor(Math.random() * SEED_TIPPERS.length)];

  const report: Report = {
    ...data,
    id: uuidv4(),
    userId: user.id,
    userName: user.name,
    status: 'pending',
    assignedTipper: randomTipper.vehicleNumber,
    etaMinutes: Math.floor(Math.random() * 30) + 20, // 20 - 50 mins
    createdAt: new Date().toISOString(),
  };
  const reports = getReports();
  reports.unshift(report);
  setItem(REPORTS_KEY, reports);

  // Sync with Supabase in background
  if (isSupabaseConfigured()) {
    insertReportToSupabase(report).catch((err) =>
      console.warn('Background Supabase insert error:', err)
    );
  }

  // Update user report count, civic points, and badge
  user.reportsCount = (user.reportsCount || 0) + 1;
  user.civicPoints = (user.civicPoints || 50) + 15;
  user.badge = computeBadge(user);
  updateUser(user);

  return report;
}

export function updateReportStatus(
  reportId: string,
  status: Report['status'],
  adminNotes?: string,
  resolvedPhotoDataUrl?: string
): void {
  const reports = getReports().map((r) =>
    r.id === reportId
      ? {
          ...r,
          status,
          adminNotes: adminNotes || r.adminNotes,
          resolvedPhotoDataUrl: resolvedPhotoDataUrl || r.resolvedPhotoDataUrl,
          updatedAt: new Date().toISOString(),
        }
      : r
  );
  setItem(REPORTS_KEY, reports);

  // Sync status update with Supabase in background
  if (isSupabaseConfigured()) {
    updateReportInSupabase(reportId, status, adminNotes, resolvedPhotoDataUrl).catch((err) =>
      console.warn('Background Supabase update error:', err)
    );
  }
}

// ──── Facilities ────

export function getFacilities(): Facility[] {
  const stored = getItem<Facility[]>(FACILITIES_KEY, []);
  if (stored.length === 0) {
    setItem(FACILITIES_KEY, SEED_FACILITIES);
    return SEED_FACILITIES;
  }
  return stored;
}

// ──── Rewards Redemption ────

export function getRedeemedRewards(): RewardVoucher[] {
  return getItem<RewardVoucher[]>(REDEEMED_REWARDS_KEY, []);
}

export function redeemReward(reward: RewardVoucher): void {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const userPoints = (user.reportsCount || 0) * 10 + 50;
  if (userPoints < reward.pointsCost) {
    throw new Error('Insufficient Civic Points to redeem this voucher.');
  }

  const existing = getRedeemedRewards();
  existing.push({
    ...reward,
    id: `red_${uuidv4().slice(0, 8)}`,
    code: `SWACHH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  });
  setItem(REDEEMED_REWARDS_KEY, existing);
}
