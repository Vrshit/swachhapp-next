import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { addReport, getCurrentUser } from '@/lib/store';
import type { User } from '@/lib/types';
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocError('Location access denied. Please allow location access and reload.')
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDataUrl || !location || !description.trim()) return;
    setSubmitting(true);
    try {
      addReport({
        photoDataUrl,
        lat: location.lat,
        lng: location.lng,
        description: description.trim(),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
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
                setPhotoDataUrl(null);
                setDescription('');
                setSuccess(false);
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
            <p className="text-sm text-gray-500">"If you see waste, send photo"</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Photo upload ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo of the dump site</label>
            {photoDataUrl ? (
              <div className="relative">
                <img
                  src={photoDataUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
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
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
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
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className={location ? 'text-green-600' : 'text-amber-500'} />
              <span className="font-medium">
                {location
                  ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : locError ?? 'Fetching location…'}
              </span>
            </div>
          </div>

          {locError && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{locError}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting || !photoDataUrl || !location || !description.trim()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition"
          >
            <Upload size={18} />
            {submitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
