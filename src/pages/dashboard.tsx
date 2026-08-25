import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  getCurrentUser,
  getReports,
  SEED_REWARDS,
  SEED_WARD_RANKINGS,
  getRedeemedRewards,
  redeemReward,
} from '@/lib/store';
import type { User, Report, RewardVoucher } from '@/lib/types';
import {
  Award,
  Camera,
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
  Flame,
  CheckCheck,
  Compass,
  Gift,
  QrCode,
  X,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const BADGE_META: Record<
  string,
  { label: string; color: string; bg: string; border: string; desc: string }
> = {
  none: {
    label: 'Citizen Champion',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Level 1: Verified citizen reporter active',
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
  const [redeemed, setRedeemed] = useState<RewardVoucher[]>([]);
  const [selectedReward, setSelectedReward] = useState<RewardVoucher | null>(null);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setReports(getReports());
    setRedeemed(getRedeemedRewards());
  }, []);

  if (!user) return null;

  const myReports = reports.filter((r) => r.userId === user.id);
  const resolvedCount = myReports.filter((r) => r.status === 'resolved').length;
  const civicPoints = myReports.length * 15 + resolvedCount * 30 + (user.civicPoints || 50);
  const allReports = reports;
  const badgeMeta = BADGE_META[user.badge] ?? BADGE_META.none;

  const categoryCount: Record<string, number> = {};
  allReports.forEach((r) => {
    const cat = (r.wasteCategory || 'mixed').replace('_', ' ');
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const maxCatCount = Math.max(...Object.values(categoryCount), 1);

  const handleRedeem = (reward: RewardVoucher) => {
    try {
      redeemReward(reward);
      setRedeemed(getRedeemedRewards());
      setSelectedReward(reward);
      setRewardMsg(`🎉 Voucher Claimed! Your code is ready.`);
    } catch (err: any) {
      setRewardMsg(err.message || 'Unable to redeem voucher.');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── High-Visibility 3D Civic Impact Portal Banner ── */}
        <div className="clay-card-3d p-8 sm:p-10 bg-white border-2 border-emerald-300/80 shadow-[0_20px_50px_rgba(22,163,74,0.15)] relative overflow-hidden">
          {/* Spatial Accent Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-200/60 via-green-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-900 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-sm">
                <Sparkles size={14} className="text-emerald-700 animate-pulse" />
                <span>Civic Impact Portal • Live Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                Welcome, <span className="text-emerald-700">{user.name}</span>! 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Track your active dump site dispatches, monitor municipal tipper response times, and
                earn verified Civic Points toward your city's Green Champion leaderboard.
              </p>

              {/* Civic Streak Pill */}
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                <Flame size={14} className="text-amber-600 fill-amber-500" />
                <span>🔥 7-Day Active Citizen Cleanliness Streak</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/report"
                className="clay-btn-green text-white font-black px-7 py-4 text-sm flex items-center justify-center gap-2.5 shine-sweep-effect shadow-lg"
              >
                <Camera size={18} />
                <span>Report Illegal Dump</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/facilities"
                className="glass-card-3d hover:bg-emerald-50/50 text-emerald-900 font-extrabold px-6 py-4 text-sm rounded-full flex items-center justify-center gap-2 border border-emerald-300/80 transition shadow-sm"
              >
                <MapPin size={17} className="text-emerald-700" />
                <span>Locate Plants</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 4 Extruded 3D Civic Metric Tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Reports Filed */}
          <div className="clay-card-3d p-6 relative group border-t-4 border-t-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                My Dump Reports
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <Camera size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{myReports.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {myReports.length > 0 ? 'Dispatched to sanitation team' : '0 reports submitted yet'}
            </p>
          </div>

          {/* Card 2: Resolved Blackspots */}
          <div className="clay-card-3d p-6 relative group border-t-4 border-t-teal-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Resolved & Cleared
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
                <CheckCheck size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{resolvedCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {resolvedCount > 0 ? 'Sites completely cleaned' : 'Awaiting tipper verification'}
            </p>
          </div>

          {/* Card 3: Civic Impact Score */}
          <div className="clay-card-3d p-6 relative group border-t-4 border-t-amber-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Civic Points Balance
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                <Flame size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-800">{civicPoints} pts</p>
            <p className="text-xs text-gray-500 mt-1">Redeemable for tax rebates & compost</p>
          </div>

          {/* Card 4: Champion Rank */}
          <div className="clay-card-3d p-6 relative group border-t-4 border-t-purple-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Champion Rank
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
                <Award size={20} />
              </div>
            </div>
            <p className={`text-xl font-black ${badgeMeta.color}`}>{badgeMeta.label}</p>
            <p className="text-[11px] text-gray-500 mt-1 truncate">{badgeMeta.desc}</p>
          </div>
        </div>

        {/* ── Green Rewards Redemption Marketplace ── */}
        <div className="clay-card-3d p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Gift size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Green Rewards & Vouchers</h2>
                <p className="text-xs text-gray-500">Convert your civic points into municipal incentives</p>
              </div>
            </div>
            <div className="glass-card-3d rounded-xl px-3 py-1.5 self-start text-xs font-black text-emerald-800">
              Balance: {civicPoints} Civic Points
            </div>
          </div>

          {rewardMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
              {rewardMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEED_REWARDS.map((rew) => {
              const canAfford = civicPoints >= rew.pointsCost;
              return (
                <div
                  key={rew.id}
                  className="clay-card-3d p-5 flex flex-col justify-between hover:border-emerald-300 transition-all bg-white/70"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{rew.icon}</span>
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {rew.pointsCost} Pts
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{rew.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{rew.description}</p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {rew.discountValue}
                    </span>
                    <button
                      onClick={() => handleRedeem(rew)}
                      disabled={!canAfford}
                      className="clay-btn-green text-white text-[11px] font-black px-3.5 py-1.5 disabled:opacity-40"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Swachh Survekshan Municipal Ward Leaderboard ── */}
        <div className="clay-card-3d p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Swachh Survekshan Ward Leaderboard</h2>
                <p className="text-xs text-gray-500">Live Ward Cleanliness Index (WCI) and Tipper SLA tracking</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              City Zone: Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" aria-label="Ward Leaderboard">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Municipal Ward</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Cleanliness Index (WCI)</th>
                  <th className="py-2.5 px-3">Resolution Rate</th>
                  <th className="py-2.5 px-3">Avg Cleanup SLA</th>
                  <th className="py-2.5 px-3">Active Champions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {SEED_WARD_RANKINGS.map((ward) => (
                  <tr key={ward.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 font-black text-sm">
                      {ward.rank === 1 ? '🥇 #1' : ward.rank === 2 ? '🥈 #2' : ward.rank === 3 ? '🥉 #3' : `#${ward.rank}`}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      Ward {ward.wardNumber} • {ward.name}
                    </td>
                    <td className="py-3 px-3 text-gray-500">{ward.zone}</td>
                    <td className="py-3 px-3">
                      <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ★ {ward.cleanlinessIndex} / 5.0
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-teal-700">{ward.cleanupRate}%</td>
                    <td className="py-3 px-3 text-gray-600">{ward.avgResponseHours} hrs</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{ward.activeChampions} citizens</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* ── Voucher Code Modal ── */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="clay-card-3d bg-white p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
              {selectedReward.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">{selectedReward.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{selectedReward.description}</p>
            </div>

            {/* Simulated QR & Voucher Barcode */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-center gap-2 font-mono font-black text-emerald-900 text-base tracking-widest bg-emerald-100 py-2 rounded-xl">
                <QrCode size={18} />
                <span>{selectedReward.code}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">
                Valid until {selectedReward.expiresAt} • Present at Municipal Office or Transit Counter
              </p>
            </div>

            <button
              onClick={() => setSelectedReward(null)}
              className="clay-btn-green text-white font-bold px-6 py-2.5 text-xs w-full"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}


