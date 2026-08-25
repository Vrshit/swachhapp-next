export type UserRole = 'citizen' | 'green_champion' | 'ward_officer' | 'admin';

export type WasteCategory =
  | 'wet_organic'
  | 'dry_recyclable'
  | 'hazardous'
  | 'e_waste'
  | 'construction'
  | 'mixed';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type Language = 'en' | 'hi' | 'kn';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  trainingCompleted: boolean;
  trainingScore: number;
  reportsCount: number;
  civicPoints?: number;
  badge: 'none' | 'reporter' | 'champion' | 'hero';
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  photoDataUrl: string;
  audioDataUrl?: string; // Voice note landmark recording
  resolvedPhotoDataUrl?: string; // "After Cleanup" evidence
  lat: number;
  lng: number;
  description: string;
  wasteCategory: WasteCategory;
  severity: ReportSeverity;
  status: 'pending' | 'reviewed' | 'resolved';
  assignedTipper?: string; // e.g. "Tipper-KA33-104"
  etaMinutes?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'biomethanisation' | 'waste-to-energy' | 'recycling' | 'scrap-collection';
  lat: number;
  lng: number;
  address: string;
  contact: string;
  operatingHours?: string;
  capacityUtilization?: number; // percentage (e.g. 68%)
}

export interface TrainingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  category: 'tax_rebate' | 'compost' | 'metro_pass' | 'bin_kit';
  pointsCost: number;
  description: string;
  discountValue: string;
  code: string;
  expiresAt: string;
  icon: string;
}

export interface WardRanking {
  id: string;
  wardNumber: number;
  name: string;
  zone: string;
  cleanlinessIndex: number; // e.g. 4.8 / 5.0
  cleanupRate: number; // percentage (e.g. 96%)
  avgResponseHours: number; // e.g. 2.8 hrs
  activeChampions: number;
  rank: number;
}

export interface WasteItemGuide {
  id: string;
  name: string;
  category: WasteCategory;
  binColor: 'green' | 'blue' | 'red' | 'black';
  binName: string;
  decompositionTime: string;
  disposalTip: string;
  icon: string;
}

export interface ScrapRate {
  id: string;
  material: string;
  pricePerKg: number;
  trend: 'up' | 'stable' | 'down';
  icon: string;
}

export interface TipperVehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  currentLat: number;
  currentLng: number;
  status: 'en_route' | 'collecting' | 'unloading' | 'standby';
  assignedWard: string;
  batteryLevel: number;
}

