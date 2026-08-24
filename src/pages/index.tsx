import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/store';
import {
  Recycle,
  GraduationCap,
  Camera,
  MapPin,
  Users,
  Shield,
  ArrowRight,
  BarChart3,
  Leaf,
} from 'lucide-react';

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Mandatory Training',
    desc: 'Every citizen learns waste segregation, home composting, and plastic reuse through interactive modules with certification.',
  },
  {
    icon: Camera,
    title: 'Photo Reporting',
    desc: 'Snap geo-tagged photos of illegal dumps with waste classification and severity tagging. Inspired by Karnataka\'s Yadgir model.',
  },
  {
    icon: MapPin,
    title: 'Facility Locator',
    desc: 'Find nearby recycling centres, biomethanisation plants, waste-to-energy facilities, and scrap shops sorted by distance.',
  },
  {
    icon: Users,
    title: 'Green Champions',
    desc: 'Local area committees monitor every stage — from source segregation to final disposal with role-based dashboards.',
  },
  {
    icon: Shield,
    title: 'Incentives & Penalties',
    desc: 'Badge rewards (Reporter → Champion → Hero) for compliant citizens, fines and service denial for violators.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Dashboard',
    desc: 'Track reports, view waste analytics, monitor treatment metrics, and manage municipal operations at a glance.',
  },
];

const STATS = [
  { target: '1.7L', label: 'TPD Waste Generated' },
  { target: '54%', label: 'Treated Today' },
  { target: '37K', label: 'TPD Unaccounted Gap' },
  { target: '249+', label: 'W-to-E Plants' },
];

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-700 opacity-[0.03]" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Leaf size={16} /> Smart India Hackathon 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            <span className="text-primary-600">Swachh</span>App
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A digital platform to train citizens, monitor waste flow, and ensure every gram of waste
            reaches the right facility — not a landfill.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isLoggedIn ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary-200 transition"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'} <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-300 text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition"
            >
              Explore Features
            </a>
          </div>
        </div>
      </header>

      {/* ── Stats bar ── */}
      <section className="bg-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={mounted ? 'animate-count-up' : ''}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <p className="text-2xl md:text-3xl font-bold">{stat.target}</p>
              <p className="text-primary-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How SwachhApp Works</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary-600 text-white text-center py-16">
        <Recycle size={48} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold">Ready to make India cleaner?</h2>
        <p className="mt-2 text-primary-100 max-w-lg mx-auto">
          Join the movement. Complete your training, report illegal dumps, and earn your Green
          Champion badge.
        </p>
        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="mt-6 inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition"
        >
          {isLoggedIn ? 'Go to Dashboard' : 'Sign Up Now'} <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 SwachhApp — Built for India's Waste Management Hackathon | Smart India Hackathon
      </footer>
    </div>
  );
}
