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
      // RBAC: redirect non-admin users
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
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Green Champions — Admin Panel</h1>
            <p className="text-sm text-gray-500">Review and manage citizen reports</p>
          </div>
        </div>

        {/* ── Status summary ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Pending',
              count: statusCounts.pending,
              color: 'bg-amber-50 text-amber-700',
              icon: Clock,
            },
            {
              label: 'Reviewed',
              count: statusCounts.reviewed,
              color: 'bg-blue-50 text-blue-700',
              icon: Eye,
            },
            {
              label: 'Resolved',
              count: statusCounts.resolved,
              color: 'bg-green-50 text-green-700',
              icon: CheckCircle2,
            },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 flex items-center gap-3`}>
              <s.icon size={24} />
              <div>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Reports table ── */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
            <p>No reports yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Citizen Dump Reports">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold">Photo</th>
                    <th className="px-4 py-3 font-semibold">Reporter</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Severity</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports
                    .slice()
                    .reverse()
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setLightboxImg(r.photoDataUrl)}
                            className="focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg"
                            aria-label="View full-size photo"
                          >
                            <img
                              src={r.photoDataUrl}
                              alt="Reported dump"
                              className="w-16 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect fill="%23f3f4f6" width="64" height="48"/><text x="32" y="28" text-anchor="middle" fill="%239ca3af" font-size="10">No img</text></svg>';
                              }}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3 font-medium">{r.userName}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                          {r.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {(r.wasteCategory || 'mixed').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              r.severity === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : r.severity === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : r.severity === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {(r.severity || 'medium')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          <a
                            href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-600 hover:underline"
                          >
                            <MapPin size={12} /> {r.lat.toFixed(3)}, {r.lng.toFixed(3)}
                            <ExternalLink size={10} />
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              r.status === 'resolved'
                                ? 'bg-green-100 text-green-700'
                                : r.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(r.id, e.target.value as Report['status'])
                            }
                            aria-label={`Change status for report by ${r.userName}`}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
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

      {/* ── Confirmation Modal ── */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="font-semibold">Confirm Status Change</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to change the status to{' '}
              <span className="font-semibold">{confirmAction.status}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImg}
              alt="Full-size report photo"
              className="w-full rounded-2xl max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
