import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, logoutUser } from '@/lib/store';
import type { User } from '@/lib/types';
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Shield,
  LogOut,
  Menu,
  X,
  Leaf,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

const BADGE_EMOJI: Record<string, string> = {
  none: '🌱',
  reporter: '🏅',
  champion: '🏆',
  hero: '🌟',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

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

  // Loading skeleton
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
        <div className="flex items-center gap-3 text-emerald-700 bg-white/80 glass-pill px-6 py-4 rounded-2xl shadow-lg border border-emerald-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-spin">
            <Leaf size={18} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-gray-800">
            {t.loading}
          </span>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'ward_officer';

  const navItems = [
    { href: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { href: '/report', label: t.navReport, icon: Camera },
    { href: '/facilities', label: t.navFacilities, icon: MapPin },
    ...(isAdmin ? [{ href: '/admin', label: t.navAdmin, icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] text-[#192f1d] relative font-sans">
      {/* ── Background Ambient Spatial Glow ── */}
      <div
        className="fixed top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-200/30 via-lime-100/20 to-transparent blur-[130px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="fixed top-[40%] right-[-10%] w-[450px] h-[450px] bg-amber-200/20 blur-[140px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-700 focus:text-white focus:px-4 focus:py-2.5 focus:rounded-xl focus:shadow-xl font-bold text-xs"
      >
        Skip to content
      </a>

      {/* ── Floating Pill Navigation ── */}
      <div className="sticky top-4 z-50 px-4 flex justify-center w-full">
        <header className="glass-pill rounded-full px-4 py-2.5 max-w-6xl w-full flex items-center justify-between shadow-[0_10px_30px_rgba(22,101,52,0.08)] border border-white/80">
          {/* Logo & 3D Leaf Badge */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Leaf size={20} className="drop-shadow-sm rotate-[-12deg]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-emerald-950">
              {t.brandName}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-black/[0.04]">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)]'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-white/90'
                  }`}
                >
                  <item.icon size={14} /> {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Pill & Bilingual Language Selector (EN / हिन्दी) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Language Toggle: English / Hindi */}
            <div className="flex items-center bg-white/90 border border-gray-200/90 rounded-full p-0.5 text-[11px] font-black text-gray-700 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-emerald-800'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                  lang === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-emerald-800'
                }`}
                title="हिन्दी (Hindi)"
              >
                हिन्दी
              </button>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
              <span className="text-sm">{BADGE_EMOJI[user.badge] || '🌱'}</span>
              <span className="text-xs font-bold text-gray-800 max-w-[120px] truncate">
                {user.name}
              </span>
              <span className="text-[9px] font-extrabold tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full uppercase">
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title={t.navLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <LogOut size={13} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1"
            >
              <Globe size={13} />
              <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
            <button
              className="w-9 h-9 rounded-xl bg-white/80 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-emerald-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <div className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-2xl space-y-3">
              {/* User info card */}
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{BADGE_EMOJI[user.badge] || '🌱'}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Mobile Language Switcher */}
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 rounded-full ${lang === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('hi')}
                    className={`px-2.5 py-1 rounded-full ${lang === 'hi' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              {/* Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        active
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon size={18} /> {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition border border-red-100"
              >
                <LogOut size={16} /> {t.navLogout}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Main Content Container ── */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* ── 3D Themed Footer ── */}
      <footer className="border-t border-gray-200/80 py-8 px-4 text-center bg-white/40 backdrop-blur-md mt-16 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
              S
            </div>
            <span className="font-bold text-gray-800">{t.brandName} • {t.tagline}</span>
            <span>• {t.sihBadge}</span>
          </div>
          <p>© 2026 {t.brandName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
