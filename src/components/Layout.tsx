import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, logoutUser } from '@/lib/store';
import type { User } from '@/lib/types';
import {
  Recycle,
  LayoutDashboard,
  GraduationCap,
  Camera,
  MapPin,
  Shield,
  LogOut,
  Menu,
  X,
  Award,
} from 'lucide-react';

const BADGE_EMOJI: Record<string, string> = {
  none: '',
  reporter: '🏅',
  champion: '🏆',
  hero: '🌟',
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/training', label: 'Training', icon: GraduationCap },
  { href: '/report', label: 'Report Dump', icon: Camera },
  { href: '/facilities', label: 'Facilities', icon: MapPin },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.replace('/login');
  };

  // Loading skeleton to prevent auth flash
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-primary-600">
          <Recycle size={28} className="animate-spin" />
          <span className="font-semibold">Loading SwachhApp…</span>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'ward_officer';

  const allNavItems = [
    ...NAV_ITEMS,
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* ── Navbar ── */}
      <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Recycle size={28} /> SwachhApp
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon size={16} /> {item.label}
                </Link>
              );
            })}

            {/* User profile pill */}
            <div className="ml-3 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Award size={14} />
              <span className="text-xs font-medium">
                {user.name} {BADGE_EMOJI[user.badge]}
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase">
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="md:hidden relative z-50 border-t border-white/20 px-4 pb-3 space-y-1 bg-primary-700">
              {/* User info */}
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Award size={14} />
                <span className="font-medium">
                  {user.name} {BADGE_EMOJI[user.badge]}
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              {allNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10"
                >
                  <item.icon size={16} /> {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 w-full"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </>
        )}
      </header>

      {/* ── Main ── */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-gray-800 text-gray-400 text-center text-xs py-4">
        © 2026 SwachhApp — Built for India's Waste Management Hackathon | Smart India Hackathon
      </footer>
    </div>
  );
}
