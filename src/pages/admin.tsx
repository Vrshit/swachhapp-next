import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getReports, updateReportStatus, getCurrentUser } from '@/lib/store';
import type { Report, User } from '@/lib/types';
import {
  Shield,
  Clock,
  CheckCircle2,
  Eye,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  X,
  AlertTriangle,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: Report['status'] } | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u && u.role !== 'admin' && u.role !== 'ward_officer') {
      router.replace('/dashboard');
      return;
    }
    setReports(getReports());
  }, [router]);

  const handleStatusChange = (id: string, status: Report['status']) => {
    setConfirmAction({ id, status });
  };

  const confirmStatusChange = () => {
    if (!confirmAction) return;
    updateReportStatus(confirmAction.id, confirmAction.status);
    setReports(getReports());
    setConfirmAction(null);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'ward_officer')) return null;

  const statusCounts = {
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── 3D Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              <Shield size={14} />
              <span>Ward Officer Control Center</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Green Champions Governance Panel
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Triage citizen dump reports, review GPS photo evidence, and coordinate sanitation tippers.
            </p>
          </div>

          <div className="glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-2 self-start border border-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-xs font-black text-emerald-900">
              Role: {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── 3 Extruded 3D Status Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="clay-card-3d p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-wider">
                Pending Triage
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.pending}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Requires site dispatch</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
              <Clock size={24} />
            </div>
          </div>

          <div className="clay-card-3d p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-blue-800 uppercase tracking-wider">
                Under Review
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.reviewed}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Tipper in transit</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
              <Eye size={24} />
            </div>
          </div>

          <div className="clay-card-3d p-6 border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Resolved & Cleared
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.resolved}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Zero-blackspot verified</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* ── 3D Reports Table Container ── */}
        {reports.length === 0 ? (
          <div className="clay-card-3d p-12 text-center text-gray-400 space-y-2">
            <ImageIcon size={36} className="mx-auto opacity-50" />
            <p className="font-bold text-gray-800">No citizen dump reports registered yet.</p>
            <p className="text-xs text-gray-500">Citizen submissions will appear here in real time.</p>
          </div>
        ) : (
          <div className="clay-card-3d p-6 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 mb-4">
              <h2 className="font-black text-lg text-gray-900">Dispatched Dump Reports Log</h2>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {reports.length} Total Incidents
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" aria-label="Citizen Dump Reports">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Evidence</th>
                    <th className="py-3 px-3">Reporter</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">GPS Location</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {reports
                    .slice()
                    .reverse()
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setLightboxImg(r.photoDataUrl)}
                            className="focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl overflow-hidden block group"
                            aria-label="View full-size photo"
                          >
                            <img
                              src={r.photoDataUrl}
                              alt="Reported dump"
                              className="w-14 h-11 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-900">{r.userName}</td>
                        <td className="py-3 px-3 max-w-[220px] truncate text-gray-600">
                          {r.description}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                            {(r.wasteCategory || 'mixed').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              r.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : r.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : r.severity === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {r.severity || 'medium'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <a
                            href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                          >
                            <MapPin size={12} />
                            <span>{r.lat.toFixed(3)}, {r.lng.toFixed(3)}</span>
                            <ExternalLink size={10} />
                          </a>
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              r.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(r.id, e.target.value as Report['status'])
                            }
                            aria-label={`Change status for report by ${r.userName}`}
                            className="text-xs font-bold border border-gray-300 rounded-xl px-2.5 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── 3D Confirmation Modal ── */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="clay-card-3d bg-white p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-extrabold text-base text-gray-900">Confirm Status Transition</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to update this incident status to{' '}
              <span className="font-black text-emerald-800 uppercase">
                {confirmAction.status}
              </span>
              ? This will be recorded on the public citizen dashboard.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="clay-btn-green text-white px-5 py-2 text-xs font-black shadow-md"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3D Image Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 px-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-3xl w-full p-2">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-2 text-white hover:text-gray-300 font-bold flex items-center gap-1"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImg}
              alt="Full-size dump evidence photo"
              className="w-full rounded-3xl max-h-[80vh] object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

