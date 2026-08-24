import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { addReport, getCurrentUser, compressImage } from '@/lib/store';
import type { User, WasteCategory, ReportSeverity } from '@/lib/types';
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
  RefreshCw,
  Tag,
  AlertTriangle,
} from 'lucide-react';

const WASTE_CATEGORIES: { value: WasteCategory; label: string; emoji: string }[] = [
  { value: 'wet_organic', label: 'Wet / Organic', emoji: '🥬' },
  { value: 'dry_recyclable', label: 'Dry / Recyclable', emoji: '📦' },
  { value: 'hazardous', label: 'Hazardous', emoji: '☣️' },
  { value: 'e_waste', label: 'E-Waste', emoji: '🔌' },
  { value: 'construction', label: 'Construction Debris', emoji: '🧱' },
  { value: 'mixed', label: 'Mixed / Unknown', emoji: '🗑️' },
];

const SEVERITY_OPTIONS: { value: ReportSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low — Small heap', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'medium', label: 'Medium — Overflowing bin', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'high', label: 'High — Roadside dump', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'critical', label: 'Critical — Blocking drain/water body', color: 'bg-red-100 text-red-700 border-red-300' },
];

export default function ReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [wasteCategory, setWasteCategory] = useState<WasteCategory>('mixed');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocError('Location access denied. Please allow location access.')
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Compress image to prevent localStorage quota crash
        const compressed = await compressImage(reader.result as string, 800, 0.6);
        setPhotoDataUrl(compressed);
      } catch {
        setPhotoDataUrl(reader.result as string);
      }
    };
    reader.onerror = () => setError('Failed to read the image file.');
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoDataUrl(null);
    // Reset file input so re-selecting same file triggers onChange
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!photoDataUrl || !location || !description.trim()) {
      setError('Please provide a photo, description, and allow location access.');
      return;
    }
    setSubmitting(true);
    try {
      addReport({
        photoDataUrl,
        lat: location.lat,
        lng: location.lng,
        description: description.trim(),
        wasteCategory,
        severity,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (success) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Report Submitted! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Thank you for helping keep India clean. Your report has been filed and will be reviewed
            by the area Green Champions committee.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                clearPhoto();
                setDescription('');
                setWasteCategory('mixed');
                setSeverity('medium');
                setSuccess(false);
                setError(null);
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Submit Another
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Camera size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Report Illegal Dump</h1>
            <p className="text-sm text-gray-500">"If you see waste, send photo" — Yadgir Model</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Photo upload ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo of the dump site *
            </label>
            {photoDataUrl ? (
              <div className="relative">
                <img
                  src={photoDataUrl}
                  alt="Preview of reported dump site"
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                  onError={() => setPhotoDataUrl(null)}
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
                  aria-label="Remove photo"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition"
              >
                <ImageIcon size={32} />
                <span className="text-sm font-medium">Click to capture or upload photo</span>
                <span className="text-xs text-gray-300">Images are auto-compressed for fast upload</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload dump site photo"
            />
          </div>

          {/* ── Waste Category ── */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Tag size={14} /> Waste Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WASTE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setWasteCategory(cat.value)}
                  className={`text-xs font-medium px-3 py-2.5 rounded-xl border-2 transition ${
                    wasteCategory === cat.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Severity ── */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle size={14} /> Severity Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SEVERITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSeverity(opt.value)}
                  className={`text-xs font-medium px-3 py-2.5 rounded-xl border-2 transition ${
                    severity === opt.value ? opt.color + ' ring-2 ring-offset-1' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Description ── */}
          <div>
            <label htmlFor="report-desc" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe the location and nature of the dump (e.g., construction debris near park entrance)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none"
            />
          </div>

          {/* ── Location ── */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className={location ? 'text-green-600' : 'text-amber-500'} />
                <span className="font-medium">
                  {location
                    ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : locError ?? 'Fetching location…'}
                </span>
              </div>
              {locError && (
                <button
                  type="button"
                  onClick={requestLocation}
                  className="text-xs text-primary-600 flex items-center gap-1 hover:underline"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              )}
            </div>
          </div>

          {(error || locError) && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl" role="alert">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error || locError}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting || !photoDataUrl || !location || !description.trim()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={18} /> Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
