export type UserRole = 'citizen' | 'green_champion' | 'ward_officer' | 'admin';

export type WasteCategory =
  | 'wet_organic'
  | 'dry_recyclable'
  | 'hazardous'
  | 'e_waste'
  | 'construction'
  | 'mixed';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  trainingCompleted: boolean;
  trainingScore: number;
  reportsCount: number;
  badge: 'none' | 'reporter' | 'champion' | 'hero';
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  photoDataUrl: string;
  lat: number;
  lng: number;
  description: string;
  wasteCategory: WasteCategory;
  severity: ReportSeverity;
  status: 'pending' | 'reviewed' | 'resolved';
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
}

export interface TrainingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
