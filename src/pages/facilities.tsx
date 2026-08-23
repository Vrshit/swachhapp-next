import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { getFacilities } from '@/lib/store';
import type { Facility } from '@/lib/types';
import { MapPin, Factory, Recycle, Zap, Store } from 'lucide-react';

// Leaflet must be loaded client‑side only
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
  'waste-to-energy': { label: 'Waste‑to‑Energy', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  recycling: { label: 'Recycling Centre', icon: Recycle, color: 'text-blue-600 bg-blue-50' },
  'scrap-collection': { label: 'Scrap Collection', icon: Store, color: 'text-purple-600 bg-purple-50' },
};

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    setFacilities(getFacilities());
  }, []);

  const filtered =
    selectedType === 'all'
      ? facilities
      : facilities.filter((f) => f.type === selectedType);

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
              Find recycling centres, W‑to‑E plants, and scrap‑collection hubs near you
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Facilities' },
            { key: 'biomethanisation', label: 'Biomethanisation' },
            { key: 'waste-to-energy', label: 'Waste‑to‑Energy' },
            { key: 'recycling', label: 'Recycling' },
            { key: 'scrap-collection', label: 'Scrap Collection' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedType(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Map ── */}
        <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <MapWithNoSSR facilities={filtered} />
        </div>

        {/* ── List ── */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((f) => {
            const meta = TYPE_META[f.type];
            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.color}`}>
                  <meta.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{f.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{meta.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{f.address}</p>
                  <p className="text-sm text-primary-600 mt-0.5">{f.contact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
