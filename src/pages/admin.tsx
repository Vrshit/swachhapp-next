import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getReports, updateReportStatus, getCurrentUser, compressImage } from '@/lib/store';
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
  Download,
  Volume2,
  Camera,
  CheckCheck,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: Report['status'] } | null>(null);

  // Before & After Resolution Modal State
  const [resolvingReport, setResolvingReport] = useState<Report | null>(null);
  const [resolvedProofPhoto, setResolvedProofPhoto] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u && u.role !== 'admin' && u.role !== 'ward_officer') {
      router.replace('/dashboard');
      return;
    }
    setReports(getReports());
  }, [router]);

  const handleStatusChange = (report: Report, status: Report['status']) => {
    if (status === 'resolved') {
      setResolvingReport(report);
      setResolvedProofPhoto(null);
      setAdminNoteInput(report.adminNotes || '');
    } else {
      setConfirmAction({ id: report.id, status });
    }
  };

  const confirmStatusChange = () => {
    if (!confirmAction) return;
    updateReportStatus(confirmAction.id, confirmAction.status);
    setReports(getReports());
    setConfirmAction(null);
  };

  const handleResolveWithProof = async () => {
    if (!resolvingReport) return;
    updateReportStatus(
      resolvingReport.id,
      'resolved',
      adminNoteInput || 'Site inspected and completely cleared by municipal tipper team.',
      resolvedProofPhoto || undefined
    );
    setReports(getReports());
    setResolvingReport(null);
    setResolvedProofPhoto(null);
  };

  const handleResolvedPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const compressed = await compressImage(reader.result as string, 800, 0.65);
        setResolvedProofPhoto(compressed);
      } catch {
        setResolvedProofPhoto(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const exportAuditCSV = () => {
    const headers = ['ID', 'Citizen Name', 'Category', 'Severity', 'Latitude', 'Longitude', 'Status', 'Assigned Tipper', 'Created At'];
    const rows = reports.map((r) => [
      r.id,
      `"${r.userName}"`,
      r.wasteCategory,
      r.severity,
      r.lat,
      r.lng,
      r.status,
      r.assignedTipper || 'Unassigned',
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Swachh_Bharat_Municipal_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        {/* ── Page Header ── */}
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

          <div className="flex items-center gap-3">
            <button
              onClick={exportAuditCSV}
              className="clay-card-3d hover:bg-emerald-50 text-emerald-900 font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs border border-emerald-300 shadow-sm transition"
            >
              <Download size={14} />
              <span>Export Audit Log (CSV)</span>
            </button>
            <div className="glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="text-xs font-black text-emerald-900">
                Role: {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3 Status Summary Cards ── */}
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
                Under Action
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.reviewed}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Tipper crew en route</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
              <Eye size={24} />
            </div>
          </div>

          <div className="clay-card-3d p-6 border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Resolved & Verified
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.resolved}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Blackspots completely cleaned</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* ── Incidents Management Table ── */}
        <div className="clay-card-3d p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
            <h2 className="text-lg font-black text-gray-900">
              Live Dump Incident Triage Queue ({reports.length})
            </h2>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500">Real-Time Municipal Feed</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <ImageIcon size={36} className="mx-auto opacity-50" />
              <p className="font-bold text-gray-700">No dump reports registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" aria-label="Incident Triage Table">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Evidence</th>
                    <th className="py-3 px-3">Reporter & Time</th>
                    <th className="py-3 px-3">Category & Severity</th>
                    <th className="py-3 px-3">Coordinates</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {reports
                    .slice()
                    .reverse()
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors">
                        {/* Evidence Thumbnail */}
                        <td className="py-3 px-3">
                          <div className="relative group">
                            <img
                              src={r.photoDataUrl}
                              alt="Evidence thumbnail"
                              onClick={() => setLightboxImg(r.photoDataUrl)}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 cursor-pointer group-hover:scale-105 transition-transform"
                            />
                            {r.resolvedPhotoDataUrl && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-full">
                                ✓ Proof
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Reporter & Details */}
                        <td className="py-3 px-3">
                          <p className="font-extrabold text-gray-900">{r.userName}</p>
                          <p className="text-gray-500 text-[10px] truncate max-w-[180px]">
                            {r.description}
                          </p>
                          {r.audioDataUrl && (
                            <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold mt-1">
                              <Volume2 size={12} />
                              <span>Voice Landmark Available</span>
                            </div>
                          )}
                        </td>

                        {/* Category & Severity */}
                        <td className="py-3 px-3">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-bold capitalize">
                            {(r.wasteCategory || 'mixed').replace('_', ' ')}
                          </span>
                          <div className="mt-1">
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                r.severity === 'critical'
                                  ? 'bg-red-100 text-red-800'
                                  : r.severity === 'high'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {r.severity}
                            </span>
                          </div>
                        </td>

                        {/* Coordinates & Tipper */}
                        <td className="py-3 px-3">
                          <a
                            href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                          >
                            <MapPin size={12} />
                            <span>
                              {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                            </span>
                          </a>
                          {r.assignedTipper && (
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              🚛 {r.assignedTipper}
                            </p>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full ${
                              r.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>

                        {/* Action Dropdown */}
                        <td className="py-3 px-3 text-right">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(r, e.target.value as Report['status'])
                            }
                            className="bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            aria-label={`Change status for incident ${r.id}`}
                          >
                            <option value="pending">🟡 Pending</option>
                            <option value="reviewed">🔵 Under Action</option>
                            <option value="resolved">🟢 Cleaned & Verified</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Before & After Resolution Modal ── */}
        {resolvingReport && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="clay-card-3d bg-white p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCheck size={20} className="text-emerald-700" />
                  <h3 className="font-black text-base text-gray-900">
                    Verify & Close Blackspot Ticket
                  </h3>
                </div>
                <button
                  onClick={() => setResolvingReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Before vs After Photos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-black text-gray-700 mb-1">📸 Before (Citizen Photo):</p>
                  <img
                    src={resolvingReport.photoDataUrl}
                    alt="Before dump site"
                    className="w-full h-32 object-cover rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-black text-emerald-800 mb-1">✨ After (Cleanup Proof):</p>
                  {resolvedProofPhoto ? (
                    <img
                      src={resolvedProofPhoto}
                      alt="After cleanup proof"
                      className="w-full h-32 object-cover rounded-xl border-2 border-emerald-400"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center gap-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition text-xs font-bold"
                    >
                      <Camera size={20} />
                      <span>Upload Proof Photo</span>
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleResolvedPhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ward Officer Resolution Notes:
                </label>
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="E.g., Tipper KA-33-1042 cleared 150kg waste and disinfected the area."
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setResolvingReport(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveWithProof}
                  className="clay-btn-green text-white px-5 py-2 text-xs font-black shadow-md"
                >
                  Confirm Resolution & Credit Citizen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Status Confirmation Modal ── */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="clay-card-3d bg-white p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-extrabold text-base text-gray-900">Confirm Status Change</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Update this dump incident to{' '}
                  <span className="font-black text-emerald-700 uppercase">
                    {confirmAction.status}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
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

        {/* ── Image Lightbox ── */}
        {lightboxImg && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImg}
                alt="Full resolution dump evidence"
                className="w-full max-h-[80vh] object-contain rounded-2xl border-2 border-white/20 shadow-2xl"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                aria-label="Close image preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
