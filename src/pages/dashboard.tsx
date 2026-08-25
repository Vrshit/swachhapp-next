import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getCurrentUser, getReports } from '@/lib/store';
import type { User, Report } from '@/lib/types';
import {
  Award,
  Camera,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Recycle,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

const BADGE_META: Record<
  string,
  { label: string; color: string; bg: string; border: string; desc: string }
> = {
  none: {
    label: 'Citizen Initiate',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    desc: 'Complete training to unlock Reporter badge',
  },
  reporter: {
    label: '🏅 Active Reporter',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Level 1: Verified dump reporting active',
  },
  champion: {
    label: '🏆 Green Champion',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Level 2: 5+ verified reports filed',
  },
  hero: {
    label: '🌟 Swachh Bharat Hero',
    color: 'text-emerald-900',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    desc: 'Top Tier: 10+ verified municipal cleanups',
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setReports(getReports());
  }, []);

  if (!user) return null;

  const myReports = reports.filter((r) => r.userId === user.id);
  const allReports = reports;
  const badgeMeta = BADGE_META[user.badge] ?? BADGE_META.none;

  const categoryCount: Record<string, number> = {};
  allReports.forEach((r) => {
    const cat = (r.wasteCategory || 'mixed').replace('_', ' ');
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const maxCatCount = Math.max(...Object.values(categoryCount), 1);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── 3D Welcome Spatial Banner ── */}
        <div className="clay-card-3d p-8 sm:p-10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Sparkles size={13} />
                <span>Civic Impact Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                {user.trainingCompleted
                  ? 'Your citizen certification is active. Continue reporting illegal blackspots to ascend to Swachh Bharat Hero tier.'
                  : 'Start by completing the 5-minute training module to unlock official civic badges and reporting privileges.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!user.trainingCompleted ? (
                <Link
                  href="/training"
                  className="clay-btn-green text-white font-extrabold px-6 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 shine-sweep-effect"
                >
                  <GraduationCap size={18} />
                  <span>Complete Training</span>
                </Link>
              ) : (
                <Link
                  href="/report"
                  className="clay-btn-green text-white font-extrabold px-6 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 shine-sweep-effect"
                >
                  <Camera size={18} />
                  <span>Report Illegal Dump</span>
                </Link>
              )}
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ── 4 Extruded 3D Metric Tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Training Status */}
          <div className="clay-card-3d p-6 relative group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Training Status
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  user.trainingCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <GraduationCap size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {user.trainingCompleted ? 'Certified ✅' : 'Pending ⏳'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user.trainingCompleted ? 'Official SIH Accreditation' : '5-min interactive quiz'}
            </p>
          </div>

          {/* Card 2: Quiz Score */}
          <div className="clay-card-3d p-6 relative group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Assessment Score
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {user.trainingCompleted ? `${user.trainingScore} / 5` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user.trainingCompleted ? 'Verified Segregation Score' : 'Score unlocks with test'}
            </p>
          </div>

          {/* Card 3: Reports Filed */}
          <div className="clay-card-3d p-6 relative group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                My Dump Reports
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Camera size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{myReports.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {myReports.length > 0 ? 'Dispatched to sanitation unit' : '0 reports submitted yet'}
            </p>
          </div>

          {/* Card 4: Tier Badge */}
          <div className="clay-card-3d p-6 relative group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Champion Rank
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award size={18} />
              </div>
            </div>
            <p className={`text-xl font-black ${badgeMeta.color}`}>{badgeMeta.label}</p>
            <p className="text-[11px] text-gray-500 mt-1 truncate">{badgeMeta.desc}</p>
          </div>
        </div>

        {/* ── 3D Quick Action Cards ── */}
        <div className="grid md:grid-cols-3 gap-5">
          <Link
            href="/training"
            className="clay-card-3d p-6 flex items-center gap-4 hover:border-emerald-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">
                {user.trainingCompleted ? 'Review Training & Certificate' : 'Start Citizen Training'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">3-tier waste segregation guide</p>
            </div>
          </Link>

          <Link
            href="/report"
            className="clay-card-3d p-6 flex items-center gap-4 hover:border-red-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Camera size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Report Illegal Dump</h3>
              <p className="text-xs text-gray-500 mt-0.5">GPS camera capture & classification</p>
            </div>
          </Link>

          <Link
            href="/facilities"
            className="clay-card-3d p-6 flex items-center gap-4 hover:border-teal-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <MapPin size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Find Waste Facilities</h3>
              <p className="text-xs text-gray-500 mt-0.5">Biomethanisation & W-to-E GIS nodes</p>
            </div>
          </Link>
        </div>

        {/* ── Category Analytics Chart ── */}
        {allReports.length > 0 && (
          <div className="clay-card-3d p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <h2 className="text-lg font-black text-gray-900">
                  Municipal Waste Category Distribution
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-500">
                {allReports.length} Total Registered Reports
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs font-extrabold w-36 text-gray-700 capitalize truncate">
                      {cat}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden p-0.5 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCatCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-gray-800 w-8 text-right">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── My Recent Reports Feed ── */}
        <div className="clay-card-3d p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
            <h2 className="text-lg font-black text-gray-900">My Recent Submissions</h2>
            <Link
              href="/report"
              className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>+ New Report</span>
            </Link>
          </div>

          {myReports.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <Camera size={36} className="mx-auto opacity-40" />
              <p className="text-sm font-bold text-gray-700">No reports submitted yet.</p>
              <Link
                href="/report"
                className="clay-btn-green text-white text-xs font-extrabold px-5 py-2.5 inline-flex items-center gap-2 shadow-sm"
              >
                <Camera size={14} /> Report Your First Dump
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {myReports
                .slice()
                .reverse()
                .slice(0, 5)
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-white/80 border border-gray-200/80 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={r.photoDataUrl}
                        alt="Dump Site Thumbnail"
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{r.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
                            {(r.wasteCategory || 'mixed').replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full flex-shrink-0 ${
                        r.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

