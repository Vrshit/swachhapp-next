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
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/training', label: 'Training', icon: GraduationCap },
  { href: '/report', label: 'Report Dump', icon: Camera },
  { href: '/facilities', label: 'Facilities', icon: MapPin },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Recycle size={28} /> SwachhApp
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
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
            <button onClick={handleLogout} className="ml-4 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition">
              <LogOut size={16} /> Logout
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/20 px-4 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10"
              >
                <item.icon size={16} /> {item.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 w-full">
              <LogOut size={16} /> Logout
            </button>
          </nav>
        )}
      </header>

      {/* ── Main ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-gray-800 text-gray-400 text-center text-xs py-4">
        © 2026 SwachhApp — Built for India's Waste Management Hackathon
      </footer>
    </div>
  );
}
