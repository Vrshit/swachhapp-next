import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, lookupWasteItem } from '@/lib/store';
import type { WasteItemGuide } from '@/lib/types';
import {
  Recycle,
  GraduationCap,
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
} from 'lucide-react';

const FEATURES = [
  {
    id: 'training',
    title: 'Mandatory Training',
    tag: 'Citizen Certification',
    badge: '🎓 3D Gamified Modules',
    color: 'from-emerald-500/20 to-green-600/10',
    border: 'border-emerald-200/80',
    accentColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-700',
    desc: 'Interactive 3-tier education covering wet vs dry segregation, home bio-composting, and hazardous handling with verifiable digital certificates.',
    stats: '100% Verified Segregation',
    link: '/training',
    cta: 'Start 5-Min Training',
  },
  {
    id: 'reporting',
    title: 'Geo-Tagged Photo Reporting',
    tag: 'Yadgir Model Powered',
    badge: '📸 Real-time GPS & AI Tagging',
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-200/80',
    accentColor: 'text-amber-800',
    iconBg: 'bg-amber-100 text-amber-700',
    desc: 'Instant dump reporting with compressed camera feeds, GPS auto-capture, waste categorization (Organic, E-Waste, Toxic), and critical severity triage.',
    stats: 'Under 24h Ward Dispatch',
    link: '/report',
    cta: 'Report Dump Site',
  },
  {
    id: 'facilities',
    title: 'Facility & Grid Locator',
    tag: 'Smart GIS Proximity',
    badge: '📍 Real-Time Route Optimization',
    color: 'from-teal-500/20 to-cyan-600/10',
    border: 'border-teal-200/80',
    accentColor: 'text-teal-800',
    iconBg: 'bg-teal-100 text-teal-700',
    desc: 'Locate 249+ municipal biomethanisation units, scrap aggregators, and waste-to-energy power plants with automated live Haversine distance calculations.',
    stats: '800m Avg. Facility Radius',
    link: '/facilities',
    cta: 'Find Nearby Plants',
  },
  {
    id: 'champions',
    title: 'Green Champions Network',
    tag: 'Ward Level Governance',
    badge: '🏆 Sanitation Worker Empowerment',
    color: 'from-blue-500/20 to-indigo-600/10',
    border: 'border-blue-200/80',
    accentColor: 'text-blue-800',
    iconBg: 'bg-blue-100 text-blue-700',
    desc: 'Connecting local sanitation officers and proactive citizens to coordinate doorstep collection, curb illegal blackspots, and supervise treatment.',
    stats: '15,000+ Active Ward Monitors',
    link: '/admin',
    cta: 'View Officer Panel',
  },
  {
    id: 'incentives',
    title: 'Incentives & Compliance',
    tag: 'Behavioral Economics',
    badge: '🌟 Tiered Badging & Penalties',
    color: 'from-purple-500/20 to-pink-600/10',
    border: 'border-purple-200/80',
    accentColor: 'text-purple-800',
    iconBg: 'bg-purple-100 text-purple-700',
    desc: 'Progressive social recognition (Reporter → Champion → Hero) paired with municipal tax rebates for zero-waste households and strict penalty audits.',
    stats: '34% Increase in Citizen Compliance',
    link: '/dashboard',
    cta: 'Check My Rank',
  },
];

const METRICS_3D = [
  {
    value: '1,70,339',
    unit: 'TPD',
    label: 'Total Waste Generated',
    sub: 'Daily Municipal Load (CPCB 2022)',
    badge: '📊 National Scale',
  },
  {
    value: '54.0%',
    unit: 'Treated',
    label: 'Scientifically Processed',
    sub: 'Biomethanisation & W-to-E',
    badge: '⚡ Grid Conversion',
  },
  {
    value: '47,000+',
    unit: 'Blackspots',
    label: 'Remediated & Closed',
    sub: 'Yadgir Civic Protocol',
    badge: '🛡️ Rapid Triage',
  },
  {
    value: '249+',
    unit: 'Plants',
    label: 'GIS Biomethanisation Units',
    sub: 'Connected in Spatial Network',
    badge: '📍 Connected',
  },
];

export default function LandingPage() {
  const router = useRouter();
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
                Swachh<span className="text-emerald-600">App</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  3D
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-black/[0.04]">
            <Link
              href="/training"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              Training
            </Link>
            <Link
              href="/report"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              Report Dump
            </Link>
            <Link
              href="/facilities"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              Facility Locator
            </Link>
            <Link
              href="/admin"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-emerald-800 hover:bg-white/90 transition-all duration-200"
            >
              Champions
            </Link>
          </nav>

          {/* Tactile 3D Green "Launch App" Button */}
          <div className="flex items-center gap-3">
            <Link
              href={isLoggedIn ? '/dashboard' : '/login'}
              className="clay-btn-green text-white text-xs md:text-sm font-bold px-5 py-2.5 flex items-center gap-2 shine-sweep-effect cursor-pointer"
            >
              <Zap size={15} className="fill-white" />
              <span>{isLoggedIn ? 'Dashboard' : 'Launch App'}</span>
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
              <span>Smart India Hackathon 2026 • Eco-Tech Spatial UI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12]">
              Transforming Waste into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 drop-shadow-sm">
                Clean Energy
              </span>
              , Citizen by Citizen.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A human-centric spatial platform empowering citizens, sanitation workers, and municipal
              councils to achieve 100% source segregation, geo-tagged reporting, and closed-loop bio-energy conversion.
            </p>

            {/* Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={isLoggedIn ? '/dashboard' : '/login'}
                className="w-full sm:w-auto clay-btn-green text-white font-bold px-8 py-4 text-base flex items-center justify-center gap-3 shine-sweep-effect"
              >
                <span>{isLoggedIn ? 'Enter Control Center' : 'Start Citizen Training'}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/facilities"
                className="w-full sm:w-auto glass-card-3d hover:bg-white/90 text-emerald-900 border border-emerald-200/80 font-bold px-7 py-3.5 text-base rounded-full flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <MapPin size={18} className="text-emerald-600" />
                <span>Explore 3D Facilities</span>
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
                <span className="font-bold text-gray-800">5,420+ Certified Champions</span>
                <span className="text-[11px] text-gray-500">Active across 48 Urban Local Bodies</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Spatial Visual Artwork with Floating Metric Badges */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/30 via-lime-200/30 to-amber-200/30 rounded-3xl blur-2xl -z-10 scale-95" />

            {/* Main 3D Composition Frame */}
            <div className="relative w-full max-w-[560px] rounded-3xl p-3 bg-gradient-to-b from-white/90 via-white/70 to-emerald-50/60 border border-white/90 shadow-[0_25px_60px_-15px_rgba(22,101,52,0.15)] overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#eef7ee]">
                {/* Embedded 4K 3D Render */}
                <img
                  src="/hero-3d.jpg"
                  alt="3D Green Champions and Smart Waste Eco-City"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized graphical mockup if image load fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              </div>

              {/* Floating Holographic Badge 1: Top Left */}
              <div className="absolute top-7 left-7 glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-3 animate-float-3d shadow-lg border border-white/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                      Live Metric
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-sm font-black text-gray-900">1.7L TPD Tracked</p>
                </div>
              </div>

              {/* Floating Holographic Badge 2: Top Right */}
              <div className="absolute top-8 right-7 glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-3 animate-float-reverse shadow-lg border border-white/80">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                    Efficiency
                  </span>
                  <p className="text-sm font-black text-gray-900">54% Scientifically Treated</p>
                </div>
              </div>

              {/* Floating Interactive Badge: Bottom Center */}
              <div className="absolute bottom-6 left-6 right-6 glass-card-3d rounded-2xl p-3 flex items-center justify-between border border-white/90 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">Yadgir Verification Model</p>
                    <p className="text-[10px] text-gray-600">Geo-fenced municipal dispatch active</p>
                  </div>
                </div>
                <Link
                  href="/report"
                  className="clay-btn-green text-[11px] font-bold text-white px-3.5 py-1.5"
                >
                  Report Dump
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Impact Metric Bar (4 Floating Extruded 3D Glass Tiles) ── */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Real-Time Municipal Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            National Waste Transformation Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS_3D.map((metric, idx) => (
            <div
              key={metric.label}
              className="clay-card-3d p-6 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300"
            >
              {/* Top Row: Badge & Unit */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold bg-emerald-100/90 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {metric.badge}
                </span>
                <span className="text-xs font-semibold text-gray-400">{metric.unit}</span>
              </div>

              {/* Big Glowing Extruded Number */}
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-4xl font-black text-gray-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {metric.value}
                </span>
              </div>

              {/* Labels */}
              <p className="text-sm font-bold text-gray-800">{metric.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{metric.sub}</p>

              {/* Subtle bottom glow accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 3.5 Instant "Which Bin?" AI Segregator Quick Search Tool ── */}
      <section className="py-8 px-4 max-w-5xl mx-auto">
        <div className="clay-card-3d p-8 sm:p-10 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 border-2 border-emerald-200/80 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
              <Sparkles size={14} className="text-emerald-700 animate-pulse" />
              <span>AI Source Segregation Guide</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
              Which Bin Does It Go In?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Type any common household item or tap a preset to get the target bin color, decomposition clock, and handling advice.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[
              { label: '🥥 Coconut Shell', q: 'coconut' },
              { label: '🥛 Milk Pouch', q: 'milk' },
              { label: '💊 Expired Pills', q: 'medicine' },
              { label: '🔋 Batteries', q: 'battery' },
              { label: '📦 Pizza Carton', q: 'cardboard' },
              { label: '🧴 Plastic Bottle', q: 'plastic' },
              { label: '🍾 Broken Glass', q: 'glass' },
            ].map((p) => (
              <button
                key={p.q}
                onClick={() => {
                  setSearchWasteQuery(p.q);
                  setFoundGuide(lookupWasteItem(p.q));
                }}
                className="text-xs font-bold bg-white/90 hover:bg-emerald-100 text-gray-700 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search item (e.g. thermocol, diaper, cables, banana peel)…"
              value={searchWasteQuery}
              onChange={(e) => {
                setSearchWasteQuery(e.target.value);
                setFoundGuide(lookupWasteItem(e.target.value));
              }}
              className="w-full pl-5 pr-12 py-3.5 bg-white rounded-2xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-500 text-sm font-medium shadow-inner"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          </div>

          {/* Found Result Card */}
          {foundGuide && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white border-2 border-emerald-300 shadow-md flex items-start gap-4 animate-float-3d">
              <span className="text-4xl p-2 bg-gray-50 rounded-2xl shadow-inner flex-shrink-0">
                {foundGuide.icon}
              </span>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-gray-900">{foundGuide.name}</h4>
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      foundGuide.binColor === 'green'
                        ? 'bg-emerald-100 text-emerald-800'
                        : foundGuide.binColor === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : foundGuide.binColor === 'red'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {foundGuide.binName}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  ⏳ Decomposition: <b>{foundGuide.decompositionTime}</b>
                </p>
                <p className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 font-medium mt-2">
                  💡 <b>Disposal Guideline:</b> {foundGuide.disposalTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ── 4. Feature Carousel (How It Works - 3D Claymorphic Slider) ── */}
      <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-3">
              <Sparkles size={14} />
              <span>How SwachhApp Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              5 Pillars of Smart Municipal Governance
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              From individual household segregation to automated bio-gas extraction and GIS dispatch.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous feature slide"
              className="w-12 h-12 rounded-2xl glass-card-3d flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next feature slide"
              className="w-12 h-12 rounded-2xl glass-card-3d flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Main Active Feature Card Display */}
          <div className="md:col-span-8">
            <div className="clay-card-3d p-8 sm:p-10 h-full relative overflow-hidden flex flex-col justify-between border-2 border-emerald-100">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full">
                    {FEATURES[activeSlide].tag}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    Step 0{activeSlide + 1} of 0{FEATURES.length}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  {FEATURES[activeSlide].title}
                </h3>

                <div className="inline-block mb-4 px-3 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700">
                  {FEATURES[activeSlide].badge}
                </div>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
                  {FEATURES[activeSlide].desc}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>{FEATURES[activeSlide].stats}</span>
                </div>

                <Link
                  href={FEATURES[activeSlide].link}
                  className="clay-btn-green text-white text-xs sm:text-sm font-bold px-6 py-3 flex items-center gap-2 shine-sweep-effect"
                >
                  <span>{FEATURES[activeSlide].cta}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Side Feature Tabs Selector */}
          <div className="md:col-span-4 flex flex-col gap-3">
            {FEATURES.map((feat, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)] scale-[1.02]'
                      : 'glass-card-3d text-gray-800 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-snug">{feat.title}</p>
                      <p
                        className={`text-[11px] ${
                          isActive ? 'text-emerald-100' : 'text-gray-500'
                        }`}
                      >
                        {feat.tag}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Spatial Waste-to-Energy Flowchart Preview ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="glass-card-3d rounded-3xl p-8 sm:p-12 border border-white relative overflow-hidden bg-gradient-to-br from-white/90 via-emerald-50/40 to-lime-50/60 shadow-xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Circular Economy Closed Loop
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              Zero-Landfill Municipal Pipeline
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              How SwachhApp synchronizes citizen inputs directly into renewable grid generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Source Segregation</h4>
              <p className="text-xs text-gray-500">Green, Blue, and Red bins partitioned right at homes and commercial units.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Smart GIS Pickup</h4>
              <p className="text-xs text-gray-500">Solar electric tippers dispatched via real-time citizen dump reports.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-black mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Biomethanisation</h4>
              <p className="text-xs text-gray-500">Organic wet waste converted to compressed bio-gas (CBG) and nutrient manure.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-black mb-3">
                4
              </div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Grid Power Generation</h4>
              <p className="text-xs text-gray-500">Dry combustibles converted to electricity in state Waste-to-Energy turbines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Bottom Hero CTA ── */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="clay-card-3d p-10 sm:p-14 bg-gradient-to-br from-emerald-800 to-green-950 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-white/10 mx-auto flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <Leaf size={32} className="text-emerald-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Champion India's Clean Revolution?
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
              Take the 5-minute interactive quiz, get certified, and help your municipal ward reach #1 ranking.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isLoggedIn ? '/dashboard' : '/login'}
                className="clay-btn-green text-white font-black px-9 py-4 text-base flex items-center justify-center gap-2.5 shine-sweep-effect"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Lighting Flare Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-400/20 blur-3xl rounded-full pointer-events-none" />
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="border-t border-gray-200/80 py-10 px-4 text-center bg-white/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-extrabold text-gray-800">SwachhApp Platform</span>
            <span>• Smart India Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <Link href="/training" className="hover:text-emerald-700">
              Training
            </Link>
            <Link href="/report" className="hover:text-emerald-700">
              Report Dump
            </Link>
            <Link href="/facilities" className="hover:text-emerald-700">
              Facilities
            </Link>
            <Link href="/admin" className="hover:text-emerald-700">
              Admin
            </Link>
          </div>
          <p>© 2026 SwachhApp. Clean Green Future Mission.</p>
        </div>
      </footer>
    </div>
  );
}
