import { User, Report, Facility, TrainingQuestion } from './types';
import { v4 as uuidv4 } from 'uuid';

// ──── Seed data ────

const SEED_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Hyderabad Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 17.385,
    lng: 78.4867,
    address: 'Jawaharlal Nehru Road, Hyderabad',
    contact: '+91‑40‑1234‑5678',
  },
  {
    id: '2',
    name: 'Delhi Waste‑to‑Energy Facility',
    type: 'waste-to-energy',
    lat: 28.6139,
    lng: 77.209,
    address: 'Okhla Phase III, New Delhi',
    contact: '+91‑11‑9876‑5432',
  },
  {
    id: '3',
    name: 'Bangalore Recycling Centre',
    type: 'recycling',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Koramangala, Bengaluru',
    contact: '+91‑80‑5555‑1234',
  },
  {
    id: '4',
    name: 'Mumbai Scrap Collection Hub',
    type: 'scrap-collection',
    lat: 19.076,
    lng: 72.8777,
    address: 'Dharavi, Mumbai',
    contact: '+91‑22‑4444‑7890',
  },
  {
    id: '5',
    name: 'Chennai Recycling Centre',
    type: 'recycling',
    lat: 13.0827,
    lng: 80.2707,
    address: 'Guindy, Chennai',
    contact: '+91‑44‑3333‑2222',
  },
  {
    id: '6',
    name: 'Pune Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 18.5204,
    lng: 73.8567,
    address: 'Hadapsar, Pune',
    contact: '+91‑20‑6666‑5555',
  },
  {
    id: '7',
    name: 'Kolkata Waste‑to‑Energy Plant',
    type: 'waste-to-energy',
    lat: 22.5726,
    lng: 88.3639,
    address: 'Salt Lake, Kolkata',
    contact: '+91‑33‑7777‑8888',
  },
  {
    id: '8',
    name: 'Jaipur Recycling Centre',
    type: 'recycling',
    lat: 26.9124,
    lng: 75.7873,
    address: 'Mansarovar, Jaipur',
    contact: '+91‑141‑9999‑1111',
  },
];

export const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 1,
    question: 'Which bin should you use for vegetable peels and food scraps?',
    options: ['Dry Waste (Blue)', 'Wet Waste (Green)', 'Hazardous Waste (Red)', 'Any bin'],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which of the following is classified as domestic hazardous waste?',
    options: ['Newspaper', 'Banana peel', 'Used batteries', 'Cardboard box'],
    correctAnswer: 2,
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
  },
  {
    id: 4,
    question: 'Which of these can be composted at home?',
    options: ['Plastic bottles', 'Glass jars', 'Tea leaves and fruit peels', 'Styrofoam'],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: 'What percentage of India\'s waste is scientifically treated (2021‑22)?',
    options: ['About 25%', 'About 54%', 'About 75%', 'About 90%'],
    correctAnswer: 1,
  },
];

// ──── localStorage helpers ────

const USERS_KEY = 'wm_users';
const REPORTS_KEY = 'wm_reports';
const FACILITIES_KEY = 'wm_facilities';
const CURRENT_USER_KEY = 'wm_current_user';

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
  localStorage.setItem(key, JSON.stringify(value));
}

// ──── Users ────

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, []);
}

export function registerUser(name: string, email: string, password: string): User {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('Email already registered');
  }
  const user: User = {
    id: uuidv4(),
    name,
    email,
    password,
    trainingCompleted: false,
    trainingScore: 0,
    reportsCount: 0,
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

function computeBadge(reportsCount: number): User['badge'] {
  if (reportsCount >= 10) return 'hero';
  if (reportsCount >= 5) return 'champion';
  if (reportsCount >= 1) return 'reporter';
  return 'none';
}

export function completeTraining(score: number): User {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  user.trainingCompleted = true;
  user.trainingScore = score;
  updateUser(user);
  return user;
}

// ──── Reports ────

export function getReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, []);
}

export function addReport(data: Omit<Report, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>): Report {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const report: Report = {
    ...data,
    id: uuidv4(),
    userId: user.id,
    userName: user.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const reports = getReports();
  reports.push(report);
  setItem(REPORTS_KEY, reports);

  // Update user report count and badge
  user.reportsCount += 1;
  user.badge = computeBadge(user.reportsCount);
  updateUser(user);

  return report;
}

export function updateReportStatus(reportId: string, status: Report['status']): void {
  const reports = getReports().map((r) =>
    r.id === reportId ? { ...r, status } : r
  );
  setItem(REPORTS_KEY, reports);
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
