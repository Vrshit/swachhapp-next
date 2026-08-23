export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'biomethanisation' | 'waste-to-energy' | 'recycling' | 'scrap-collection';
  lat: number;
  lng: number;
  address: string;
  contact: string;
}

export interface TrainingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}
