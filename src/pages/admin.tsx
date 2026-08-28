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
import { useLanguage } from '@/lib/translations';

export default function AdminPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();

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
      adminNoteInput || (lang === 'hi' ? 'स्थल का निरीक्षण किया गया और स्वच्छता टीम द्वारा पूरी तरह साफ किया गया।' : 'Site inspected and completely cleared by municipal tipper team.'),
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
              <span>{t.officerDesk}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {t.adminTitle}
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              {t.adminSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportAuditCSV}
              className="clay-card-3d hover:bg-emerald-50 text-emerald-900 font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs border border-emerald-300 shadow-sm transition"
            >
              <Download size={14} />
              <span>{t.exportCsvBtn}</span>
            </button>
            <div className="glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="text-xs font-black text-emerald-900">
                {lang === 'hi' ? 'भूमिका:' : 'Role:'} {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3 Status Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="clay-card-3d p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-wider">
                {t.awaitingReview}
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.pending}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{lang === 'hi' ? 'स्थल प्रेषण आवश्यक' : 'Requires site dispatch'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
              <Clock size={24} />
            </div>
          </div>

          <div className="clay-card-3d p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-blue-800 uppercase tracking-wider">
                {lang === 'hi' ? 'सफाई प्रगति पर' : 'Under Action'}
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.reviewed}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{lang === 'hi' ? 'टिपर दल रवाना' : 'Tipper crew en route'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
              <Eye size={24} />
            </div>
          </div>

          <div className="clay-card-3d p-6 border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                {t.resolvedVerified}
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{statusCounts.resolved}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{lang === 'hi' ? 'पूर्ण सफाई सत्यापित' : 'Blackspots completely cleaned'}</p>
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
              {t.incidentManagement} ({reports.length})
            </h2>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500">{lang === 'hi' ? 'लाइव नगरपालिका फीड' : 'Real-Time Municipal Feed'}</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <ImageIcon size={36} className="mx-auto opacity-50" />
              <p className="font-bold text-gray-700">{lang === 'hi' ? 'अभी तक कोई रिपोर्ट दर्ज नहीं हुई।' : 'No dump reports registered yet.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" aria-label="Incident Triage Table">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">{lang === 'hi' ? 'प्रमाण फोटो' : 'Evidence'}</th>
                    <th className="py-3 px-3">{lang === 'hi' ? 'नागरिक एवं समय' : 'Reporter & Time'}</th>
                    <th className="py-3 px-3">{lang === 'hi' ? 'श्रेणी एवं गंभीरता' : 'Category & Severity'}</th>
                    <th className="py-3 px-3">{lang === 'hi' ? 'स्थान एवं टिपर' : 'Coordinates'}</th>
                    <th className="py-3 px-3">{t.status}</th>
                    <th className="py-3 px-3 text-right">{t.action}</th>
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
                                ✓ {lang === 'hi' ? 'प्रमाण' : 'Proof'}
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
                          {r.address && (
                            <p className="text-emerald-800 text-[9px] font-medium truncate max-w-[180px]">
                              📍 {r.address}
                            </p>
                          )}
                          {r.audioDataUrl && (
                            <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold mt-1">
                              <Volume2 size={12} />
                              <span>{lang === 'hi' ? 'वॉयस नोट उपलब्ध' : 'Voice Landmark Available'}</span>
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
                            {r.status === 'resolved' ? (lang === 'hi' ? 'समाधानित' : 'RESOLVED') : r.status === 'reviewed' ? (lang === 'hi' ? 'प्रगति पर' : 'REVIEWED') : (lang === 'hi' ? 'लंबित' : 'PENDING')}
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
                            <option value="pending">🟡 {lang === 'hi' ? 'लंबित' : 'Pending'}</option>
                            <option value="reviewed">🔵 {lang === 'hi' ? 'सफाई प्रगति पर' : 'Under Action'}</option>
                            <option value="resolved">🟢 {lang === 'hi' ? 'सत्यापित व साफ' : 'Cleaned & Verified'}</option>
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
                <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                  <CheckCheck size={20} className="text-emerald-600" />
                  <span>{t.verifyCleanupBtn}</span>
                </h3>
                <button
                  onClick={() => setResolvingReport(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Before & After Comparison Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full block text-center mb-1.5">
                    {t.beforeCleanup}
                  </span>
                  <img
                    src={resolvingReport.photoDataUrl}
                    alt="Before cleanup"
                    className="w-full h-32 object-cover rounded-2xl border border-amber-200"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full block text-center mb-1.5">
                    {t.afterCleanup}
                  </span>
                  {resolvedProofPhoto ? (
                    <div className="relative">
                      <img
                        src={resolvedProofPhoto}
                        alt="After cleanup proof"
                        className="w-full h-32 object-cover rounded-2xl border-2 border-emerald-400"
                      />
                      <button
                        onClick={() => setResolvedProofPhoto(null)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="w-full h-32 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition"
                    >
                      <Camera size={24} className="text-emerald-600 mb-1" />
                      <span className="text-[10px] font-bold text-emerald-800 text-center px-2">
                        {t.uploadAfterPhoto}
                      </span>
                    </div>
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
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'hi' ? 'अधिकारी का सत्यापन नोट:' : 'Officer Resolution Notes:'}
                </label>
                <textarea
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. टिपर दल द्वारा 250 किलोग्राम मलबा हटाया गया और कीटाणुरहित किया गया।' : 'E.g., 250kg debris removed by Tipper Crew KA-33-E-1042 and disinfected.'}
                  rows={2}
                  className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleResolveWithProof}
                  className="flex-1 clay-btn-green text-white font-extrabold text-xs py-3 rounded-xl shadow-md"
                >
                  {t.markAsResolved}
                </button>
                <button
                  onClick={() => setResolvingReport(null)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Photo Lightbox Modal ── */}
        {lightboxImg && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div className="relative max-w-2xl w-full">
              <img
                src={lightboxImg}
                alt="Enlarged dump evidence"
                className="w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/20"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
