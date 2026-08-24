import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { getFacilities, getDistanceKm } from '@/lib/store';
import type { Facility } from '@/lib/types';
import { MapPin, Factory, Recycle, Zap, Store, Navigation, Search, Clock } from 'lucide-react';

// Leaflet must be loaded client-side only
const MapWithNoSSR = dynamic(() => import('@/components/FacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
      Loading map…
    </div>
  ),
});

const TYPE_META: Record<Facility['type'], { label: string; icon: any; color: string }> = {
  biomethanisation: { label: 'Biomethanisation', icon: Factory, color: 'text-green-600 bg-green-50' },
  'waste-to-energy': { label: 'Waste-to-Energy', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  recycling: { label: 'Recycling Centre', icon: Recycle, color: 'text-blue-600 bg-blue-50' },
  'scrap-collection': { label: 'Scrap Collection', icon: Store, color: 'text-purple-600 bg-purple-50' },
};

type FacilityWithDistance = Facility & { distanceKm?: number };

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityWithDistance[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const raw = getFacilities();
    setFacilities(raw);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        // Calculate distances
        const withDist = raw.map((f) => ({
          ...f,
          distanceKm: getDistanceKm(loc.lat, loc.lng, f.lat, f.lng),
        }));
        // Sort by distance
        withDist.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
        setFacilities(withDist);
      },
      () => {
        // GPS denied — keep unsorted
      }
    );
  }, []);

  // Filter by type
  let filtered =
    selectedType === 'all'
      ? facilities
      : facilities.filter((f) => f.type === selectedType);

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q)
    );
  }

  // Counts per type
  const typeCounts: Record<string, number> = { all: facilities.length };
  facilities.forEach((f) => {
    typeCounts[f.type] = (typeCounts[f.type] ?? 0) + 1;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
            <MapPin size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Waste Management Facilities</h1>
            <p className="text-sm text-gray-500">
              {userLoc
                ? 'Sorted by distance from your location'
                : 'Allow location access to sort by distance'}
            </p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or city…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'biomethanisation', label: 'Biomethanisation' },
            { key: 'waste-to-energy', label: 'W-to-E' },
            { key: 'recycling', label: 'Recycling' },
            { key: 'scrap-collection', label: 'Scrap' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedType(f.key)}
              aria-pressed={selectedType === f.key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {f.label} ({typeCounts[f.key] ?? 0})
            </button>
          ))}
        </div>

        {/* ── Map ── */}
        <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <MapWithNoSSR facilities={filtered} />
        </div>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p>No facilities match your search or filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((f) => {
              const meta = TYPE_META[f.type];
              return (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}
                  >
                    <meta.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{f.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{meta.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{f.address}</p>
                    <a
                      href={`tel:${f.contact.replace(/[\s-]/g, '')}`}
                      className="text-sm text-primary-600 mt-0.5 inline-block hover:underline"
                    >
                      {f.contact}
                    </a>
                    {f.operatingHours && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {f.operatingHours}
                      </p>
                    )}
                    {f.distanceKm !== undefined && (
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        📍 {f.distanceKm.toFixed(1)} km away
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg flex-shrink-0 transition"
                    aria-label={`Get directions to ${f.name}`}
                  >
                    <Navigation size={12} /> Directions
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
