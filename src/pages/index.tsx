import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, lookupWasteItem } from '@/lib/store';
import type { WasteItemGuide } from '@/lib/types';
import {
  Recycle,
  Camera,
  MapPin,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  Leaf,
  BarChart3,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function LandingPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Which Bin AI Search State
  const [searchWasteQuery, setSearchWasteQuery] = useState('coconut');
  const [foundGuide, setFoundGuide] = useState<WasteItemGuide | null>(() => lookupWasteItem('coconut'));

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getCurrentUser());
  }, []);

  const FEATURES = [
    {
      id: 'reporting',
      title: t.feature1Title,
      tag: lang === 'hi' ? 'यादगीर मॉडल आधारित' : 'Yadgir Model Powered',
      badge: lang === 'hi' ? '📸 लाइव जीपीएस और AI विज़न' : '📸 Real-time GPS & AI Tagging',
      color: 'from-amber-500/20 to-orange-600/10',
      border: 'border-amber-200/80',
      accentColor: 'text-amber-800',
      iconBg: 'bg-amber-100 text-amber-700',
      desc: t.feature1Desc,
      stats: lang === 'hi' ? '24 घंटे से कम में समाधान' : 'Under 24h Ward Dispatch',
      link: '/report',
      cta: t.navReport,
    },
    {
      id: 'facilities',
      title: t.feature2Title,
      tag: lang === 'hi' ? 'स्मार्ट GIS निकटता' : 'Smart GIS Proximity',
      badge: lang === 'hi' ? '📍 वास्तविक समय मार्ग अनुकूलन' : '📍 Real-Time Route Optimization',
      color: 'from-teal-500/20 to-cyan-600/10',
      border: 'border-teal-200/80',
      accentColor: 'text-teal-800',
      iconBg: 'bg-teal-100 text-teal-700',
      desc: t.feature2Desc,
      stats: lang === 'hi' ? '800 मीटर औसत सुविधा त्रिज्या' : '800m Avg. Facility Radius',
      link: '/facilities',
      cta: t.navFacilities,
    },
    {
      id: 'champions',
      title: t.feature3Title,
      tag: lang === 'hi' ? 'वार्ड स्तरीय प्रशासन' : 'Ward Level Governance',
      badge: lang === 'hi' ? '🏆 स्वच्छता कर्मी सशक्तिकरण' : '🏆 Sanitation Worker Empowerment',
      color: 'from-blue-500/20 to-indigo-600/10',
      border: 'border-blue-200/80',
      accentColor: 'text-blue-800',
      iconBg: 'bg-blue-100 text-blue-700',
      desc: t.feature3Desc,
      stats: lang === 'hi' ? '15,000+ सक्रिय वार्ड मॉनिटर' : '15,000+ Active Ward Monitors',
      link: '/dashboard',
      cta: t.navDashboard,
    },
    {
      id: 'incentives',
      title: t.feature4Title,
      tag: lang === 'hi' ? 'व्यवहार अर्थशास्त्र' : 'Behavioral Economics',
      badge: lang === 'hi' ? '🌟 स्तरबद्ध पुरस्कार एवं छूट' : '🌟 Tiered Badging & Penalties',
      color: 'from-purple-500/20 to-pink-600/10',
      border: 'border-purple-200/80',
      accentColor: 'text-purple-800',
      iconBg: 'bg-purple-100 text-purple-700',
      desc: t.feature4Desc,
      stats: lang === 'hi' ? 'नागरिक अनुपालन में 34% वृद्धि' : '34% Increase in Citizen Compliance',
      link: '/dashboard',
      cta: t.metricCivicPoints,
    },
  ];

  const METRICS_3D = [
    {
      value: '1,70,339',
      unit: 'TPD',
      label: lang === 'hi' ? 'कुल दैनिक कचरा' : 'Total Waste Generated',
      sub: 'Daily Municipal Load (CPCB 2022)',
      badge: lang === 'hi' ? '📊 राष्ट्रीय स्तर' : '📊 National Scale',
    },
    {
      value: '54.0%',
      unit: lang === 'hi' ? 'उपचारित' : 'Treated',
      label: lang === 'hi' ? 'वैज्ञानिक प्रसंस्करण' : 'Scientifically Processed',
      sub: 'Biomethanisation & W-to-E',
      badge: lang === 'hi' ? '⚡ ग्रिड रूपांतरण' : '⚡ Grid Conversion',
    },
    {
      value: '47,000+',
      unit: lang === 'hi' ? 'डंप स्थल' : 'Blackspots',
      label: lang === 'hi' ? 'साफ एवं बंद किए गए' : 'Remediated & Closed',
      sub: 'Yadgir Civic Protocol',
      badge: lang === 'hi' ? '🛡️ तीव्र समाधान' : '🛡️ Rapid Triage',
    },
    {
      value: '249+',
      unit: lang === 'hi' ? 'संयंत्र' : 'Plants',
      label: lang === 'hi' ? 'GIS बायोमेथेनेशन इकाइयां' : 'GIS Biomethanisation Units',
      sub: 'Connected in Spatial Network',
      badge: lang === 'hi' ? '📍 कनेक्टेड' : '📍 Connected',
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % FEATURES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#192f1d] selection:bg-primary-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* ── Background Ambient Spatial Lighting & Soft Orbs ── */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-200/40 via-lime-100/30 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] bg-amber-200/30 blur-[130px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute top-[60%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/25 blur-[150px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      {/* ── 1. Floating Pill Navigation ── */}
      <div className="fixed top-5 left-0 right-0 z-50 px-4 flex justify-center">
        <header className="glass-pill rounded-full px-4 py-2.5 max-w-5xl w-full flex items-center justify-between transition-all duration-300">
          {/* Logo & 3D Leaf Badge */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)] group-hover:scale-105 transition-transform duration-200">
              <Leaf size={22} className="drop-shadow-sm rotate-[-12deg]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-emerald-950 flex items-center gap-1">
                {t.brandName}
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  3D
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-black/[0.04]">
            <Link
              href="/report"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              {t.navReport}
            </Link>
            <Link
              href="/facilities"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              {t.navFacilities}
            </Link>
            <Link
              href="/admin"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              {t.navAdmin}
            </Link>
          </nav>

          {/* Language Switcher (EN / हिन्दी) + Launch App Button */}
          <div className="flex items-center gap-3">
            {/* Bilingual Switcher */}
            <div className="flex items-center bg-white/90 border border-gray-200 rounded-full p-0.5 text-[11px] font-black text-gray-700 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <Link
              href={isLoggedIn ? '/dashboard' : '/login'}
              className="clay-btn-green text-white text-xs md:text-sm font-bold px-5 py-2.5 flex items-center gap-2 shine-sweep-effect cursor-pointer"
            >
              <Zap size={15} className="fill-white" />
              <span>{isLoggedIn ? t.navDashboard : t.heroCtaGetStarted}</span>
            </Link>
          </div>
        </header>
      </div>

      {/* ── 2. Hero Section ── */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & Tactile CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Smart India Hackathon Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-sm glow-pill-badge">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span>{t.sihBadge} • {t.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12]">
              {t.heroTitlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 drop-shadow-sm">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.heroDesc}
            </p>

            {/* Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={isLoggedIn ? '/dashboard' : '/login'}
                className="w-full sm:w-auto clay-btn-green text-white font-bold px-8 py-4 text-base flex items-center justify-center gap-3 shine-sweep-effect"
              >
                <span>{isLoggedIn ? t.heroCtaDashboard : t.heroCtaGetStarted}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/facilities"
                className="w-full sm:w-auto glass-card-3d hover:bg-white/90 text-emerald-900 border border-emerald-200/80 font-bold px-7 py-3.5 text-base rounded-full flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <MapPin size={18} className="text-emerald-600" />
                <span>{t.heroCtaFacilities}</span>
              </Link>
            </div>

            {/* Social Trust & Champions Proof */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white font-bold text-[10px]">
                  VK
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white font-bold text-[10px]">
                  AS
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white font-bold text-[10px]">
                  RM
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-white font-bold text-[10px]">
                  +5k
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-800">
                  {lang === 'hi' ? '5,420+ प्रमाणित नागरिक चैंपियंस' : '5,420+ Certified Champions'}
                </span>
                <span className="text-[11px] text-gray-500">
                  {lang === 'hi' ? '48 शहरी स्थानीय निकायों में सक्रिय' : 'Active across 48 Urban Local Bodies'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Spatial Visual Artwork */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/30 via-lime-200/30 to-amber-200/30 rounded-3xl blur-2xl -z-10 scale-95" />

            <div className="relative w-full max-w-[560px] rounded-3xl p-3 bg-gradient-to-b from-white/90 via-white/70 to-emerald-50/60 border border-white/90 shadow-[0_25px_60px_-15px_rgba(22,101,52,0.15)] overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#eef7ee]">
                <img
                  src="/hero-3d.jpg"
                  alt="3D Green Champions and Smart Waste Eco-City"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute top-7 left-7 glass-card-3d rounded-2xl p-3 shadow-lg border border-white/90 flex items-center gap-3 animate-float-3d">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md">
                  <Activity size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">
                    {lang === 'hi' ? 'लाइव दक्षता' : 'Live Plant Telemetry'}
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    94.2% {lang === 'hi' ? 'दक्षता' : 'Efficiency'}
                  </span>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div
                className="absolute bottom-7 right-7 glass-card-3d rounded-2xl p-3.5 shadow-xl border border-white/90 flex items-center gap-3 animate-float-3d"
                style={{ animationDelay: '1.2s' }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">
                    {lang === 'hi' ? 'सक्रिय वार्ड' : 'Yadgir Protocol'}
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    {lang === 'hi' ? 'शून्य अवैध डंपिंग' : 'Zero Blackspot Target'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive AI Segregation Mini-Tool ("Which Bin?") ── */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="clay-card-3d p-6 sm:p-10 bg-white border-2 border-emerald-300 relative overflow-hidden space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              <Sparkles size={14} />
              <span>{lang === 'hi' ? 'त्वरित AI सहायता' : 'AI Instant Assistant'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{t.whichBinTitle}</h2>
            <p className="text-xs sm:text-sm text-gray-600">{t.whichBinSubtitle}</p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchWasteQuery}
              onChange={(e) => {
                setSearchWasteQuery(e.target.value);
                setFoundGuide(lookupWasteItem(e.target.value));
              }}
              placeholder={t.whichBinPlaceholder}
              className="w-full py-3.5 pl-4 pr-12 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-sm font-bold shadow-inner bg-gray-50/80"
            />
            <span className="absolute right-4 top-3.5 text-xl">🔍</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-gray-500 font-bold">{lang === 'hi' ? 'उदाहरण:' : 'Try:'}</span>
            {['Coconut shell', 'Milk pouch', 'Expired medicine', 'Battery', 'Pizza box', 'Glass bottle'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSearchWasteQuery(item);
                  setFoundGuide(lookupWasteItem(item));
                }}
                className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200 transition text-xs"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Guide Result Display */}
          {foundGuide && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-float-3d">
              <div className="sm:col-span-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {foundGuide.binColor === 'green' ? '🟢' : foundGuide.binColor === 'blue' ? '🔵' : '🔴'}
                  </span>
                  <div>
                    <h3 className="font-black text-base text-gray-900">{foundGuide.item}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {foundGuide.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 pt-1 font-medium">{foundGuide.handlingTip}</p>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-gray-200 text-center space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  {t.decompositionClock}
                </span>
                <span className="text-sm font-black text-amber-700">{foundGuide.decompositionTime}</span>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-gray-200 text-center space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  {t.binColor}
                </span>
                <span
                  className={`text-xs font-black uppercase px-2.5 py-1 rounded-full inline-block ${
                    foundGuide.binColor === 'green'
                      ? 'bg-emerald-100 text-emerald-800'
                      : foundGuide.binColor === 'blue'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {foundGuide.binColor.toUpperCase()} BIN
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. High-Contrast 3D Metric Stat Bar ── */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS_3D.map((m, idx) => (
            <div
              key={idx}
              className="clay-card-3d p-6 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {m.badge}
                </span>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {m.value}
                </span>
                <span className="text-sm font-bold text-emerald-700">{m.unit}</span>
              </div>
              <p className="text-sm font-extrabold text-gray-800 mt-2">{m.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Five Extruded Spatial Feature Cards ── */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
            <Sparkles size={14} className="text-emerald-600" />
            <span>{t.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            {t.featuresHeading}
          </h2>
          <p className="text-base text-gray-600">{t.featuresSubheading}</p>
        </div>

        {/* Dynamic Card Display */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {FEATURES.map((feat, idx) => {
              const isSelected = activeSlide === idx;
              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? `bg-white shadow-[0_20px_40px_rgba(22,101,52,0.1)] border-emerald-500 scale-[1.02]`
                      : `bg-white/60 hover:bg-white/90 border-transparent hover:border-gray-200`
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      {feat.tag}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{feat.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{feat.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs font-extrabold text-emerald-800">{feat.stats}</span>
                    <Link
                      href={feat.link}
                      className="clay-btn-green text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5"
                    >
                      <span>{feat.cta}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Visual Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="clay-card-3d p-8 bg-gradient-to-br from-emerald-700 to-green-900 text-white space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
                {lang === 'hi' ? 'विशेषता पूर्वावलोकन' : 'Feature Spotlight'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">{FEATURES[activeSlide].title}</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">{FEATURES[activeSlide].desc}</p>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                  {lang === 'hi' ? 'मापे गए परिणाम' : 'Measured Impact'}
                </span>
                <span className="text-lg font-black text-white">{FEATURES[activeSlide].stats}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Circular Economy Closed-Loop Timeline ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="glass-card-3d rounded-3xl p-8 sm:p-12 border border-white relative overflow-hidden bg-gradient-to-br from-white/90 via-emerald-50/40 to-lime-50/60 shadow-xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t.pipelineBadge}
            </span>
            <h2 className="text-3xl font-black text-gray-900">{t.pipelineTitle}</h2>
            <p className="text-sm sm:text-base text-gray-600">{t.pipelineDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">{t.pipelineStep1}</h3>
              <p className="text-xs text-gray-500">{t.pipelineStep1Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">{t.pipelineStep2}</h3>
              <p className="text-xs text-gray-500">{t.pipelineStep2Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-black mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">{t.pipelineStep3}</h3>
              <p className="text-xs text-gray-500">{t.pipelineStep3Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-black mb-3">
                4
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">{t.pipelineStep4}</h3>
              <p className="text-xs text-gray-500">{t.pipelineStep4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Call To Action ── */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="clay-card-3d p-10 sm:p-14 bg-gradient-to-br from-emerald-800 to-green-950 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-white/10 mx-auto flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <Leaf size={32} className="text-emerald-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {t.ctaHeading}
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
              {t.ctaSubheading}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="clay-btn-green text-white font-black px-9 py-4 text-base flex items-center justify-center gap-2.5 shine-sweep-effect"
              >
                <span>{t.ctaButton}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Footer ── */}
      <footer className="border-t border-gray-200/80 py-10 px-4 text-center bg-white/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-extrabold text-gray-800">{t.brandName} Platform</span>
            <span>• {t.sihBadge}</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <Link href="/report" className="hover:text-emerald-700">
              {t.navReport}
            </Link>
            <Link href="/facilities" className="hover:text-emerald-700">
              {t.navFacilities}
            </Link>
            <Link href="/admin" className="hover:text-emerald-700">
              {t.navAdmin}
            </Link>
          </div>
          <p>© 2026 {t.brandName}. {t.tagline}.</p>
        </div>
      </footer>
    </div>
  );
}
