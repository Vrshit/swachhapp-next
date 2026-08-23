import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getReports, updateReportStatus } from '@/lib/store';
import type { Report } from '@/lib/types';
import {
  Shield,
  Clock,
  CheckCircle2,
  Eye,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleStatusChange = (id: string, status: Report['status']) => {
    updateReportStatus(id, status);
    setReports(getReports());
  };

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
            { label: 'Pending', count: statusCounts.pending, color: 'bg-amber-50 text-amber-700', icon: Clock },
            { label: 'Reviewed', count: statusCounts.reviewed, color: 'bg-blue-50 text-blue-700', icon: Eye },
            { label: 'Resolved', count: statusCounts.resolved, color: 'bg-green-50 text-green-700', icon: CheckCircle2 },
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold">Photo</th>
                    <th className="px-4 py-3 font-semibold">Reporter</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
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
                          <img
                            src={r.photoDataUrl}
                            alt=""
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{r.userName}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{r.description}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {r.lat.toFixed(3)}, {r.lng.toFixed(3)}
                          </span>
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
    </Layout>
  );
}
