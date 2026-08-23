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
} from 'lucide-react';
import Link from 'next/link';

const BADGE_META: Record<string, { label: string; color: string; bg: string }> = {
  none: { label: 'No Badge Yet', color: 'text-gray-400', bg: 'bg-gray-100' },
  reporter: { label: '🏅 Reporter', color: 'text-blue-700', bg: 'bg-blue-50' },
  champion: { label: '🏆 Champion', color: 'text-amber-700', bg: 'bg-amber-50' },
  hero: { label: '🌟 Hero', color: 'text-purple-700', bg: 'bg-purple-50' },
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
  const badgeMeta = BADGE_META[user.badge] ?? BADGE_META.none;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ── Welcome banner ── */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 md:p-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}! 👋</h1>
          <p className="mt-2 text-primary-100">
            {user.trainingCompleted
              ? 'Your training is complete. Keep reporting illegal dumps to earn badges!'
              : 'Start by completing your waste‑management training to unlock all features.'}
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Training',
              value: user.trainingCompleted ? 'Completed' : 'Pending',
              icon: GraduationCap,
              color: user.trainingCompleted ? 'text-green-600' : 'text-amber-600',
              bg: user.trainingCompleted ? 'bg-green-50' : 'bg-amber-50',
            },
            {
              label: 'Training Score',
              value: user.trainingCompleted ? `${user.trainingScore}/5` : '—',
              icon: TrendingUp,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'My Reports',
              value: String(myReports.length),
              icon: Camera,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
            {
              label: 'Badge',
              value: badgeMeta.label,
              icon: Award,
              color: badgeMeta.color,
              bg: badgeMeta.bg,
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-2xl p-5 flex flex-col items-start gap-2`}
            >
              <card.icon size={22} className={card.color} />
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Quick actions ── */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/training"
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="font-semibold">{user.trainingCompleted ? 'Review Training' : 'Start Training'}</p>
              <p className="text-sm text-gray-500">Learn waste segregation</p>
            </div>
          </Link>
          <Link
            href="/report"
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Camera size={24} />
            </div>
            <div>
              <p className="font-semibold">Report a Dump</p>
              <p className="text-sm text-gray-500">Snap a geo‑tagged photo</p>
            </div>
          </Link>
          <Link
            href="/facilities"
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Recycle size={24} />
            </div>
            <div>
              <p className="font-semibold">Find Facilities</p>
              <p className="text-sm text-gray-500">Locate nearby centres</p>
            </div>
          </Link>
        </div>

        {/* ── Recent reports ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">My Recent Reports</h2>
          </div>
          {myReports.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <Camera size={32} className="mx-auto mb-2 opacity-50" />
              <p>No reports yet. Go report an illegal dump!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {myReports
                .slice()
                .reverse()
                .slice(0, 5)
                .map((r) => (
                  <li key={r.id} className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={r.photoDataUrl}
                      alt="report"
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.description}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {r.status === 'resolved' && <CheckCircle2 size={12} className="inline mr-1" />}
                      {r.status === 'pending' && <AlertTriangle size={12} className="inline mr-1" />}
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
