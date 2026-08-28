import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { getFacilities, getDistanceKm, SEED_SCRAP_RATES, SEED_TIPPERS } from '@/lib/store';
import type { Facility } from '@/lib/types';
import {
  MapPin,
  Factory,
  Recycle,
  Zap,
  Store,
  Navigation,
  Search,
  Clock,
  Sparkles,
  Phone,
  Compass,
  ArrowUpRight,
  Truck,
  TrendingUp,
  Coins,
  BatteryCharging,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

const MapWithNoSSR = dynamic(() => import('@/components/FacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-emerald-50/50 rounded-3xl flex items-center justify-center text-emerald-800 font-bold text-sm">
      <span className="animate-pulse">Loading Spatial GIS Map…</span>
    </div>
  ),
});

type FacilityWithDistance = Facility & { distanceKm?: number };

export default function FacilitiesPage() {
  const { t, lang } = useLanguage();

  const [facilities, setFacilities] = useState<FacilityWithDistance[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const TYPE_META: Record<
    Facility['type'],
    { label: string; icon: any; color: string; bg: string; border: string }
  > = {
    biomethanisation: {
      label: lang === 'hi' ? 'बायोमेथेनेशन इकाई' : 'Biomethanisation Unit',
      icon: Factory,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200',
    },
    'waste-to-energy': {
      label: lang === 'hi' ? 'वेस्ट-टू-एनर्जी प्लांट' : 'Waste-to-Energy Plant',
      icon: Zap,
      color: 'text-amber-700',
      bg: 'bg-amber-100',
      border: 'border-amber-200',
    },
    recycling: {
      label: lang === 'hi' ? 'पुनर्चक्रण केंद्र' : 'Recycling Hub',
      icon: Recycle,
      color: 'text-teal-700',
      bg: 'bg-teal-100',
      border: 'border-teal-200',
    },
    'scrap-collection': {
      label: lang === 'hi' ? 'कबाड़ एवं सामग्री केंद्र' : 'Scrap & Material Recovery',
      icon: Store,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
  };

  useEffect(() => {
    const raw = getFacilities();
    setFacilities(raw);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLoc(loc);
          const withDist = raw.map((f) => ({
            ...f,
            distanceKm: getDistanceKm(loc.lat, loc.lng, f.lat, f.lng),
          }));
          withDist.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
          setFacilities(withDist);
        },
        () => {
          const fallback = { lat: 28.6139, lng: 77.209 };
          setUserLoc(fallback);
          const withDist = raw.map((f) => ({
            ...f,
            distanceKm: getDistanceKm(fallback.lat, fallback.lng, f.lat, f.lng),
          }));
          withDist.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
          setFacilities(withDist);
        },
        { timeout: 6000 }
      );
    }
  }, []);

  let filtered =
    selectedType === 'all'
      ? facilities
      : facilities.filter((f) => f.type === selectedType);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q)
    );
  }

  const typeCounts: Record<string, number> = { all: facilities.length };
  facilities.forEach((f) => {
    typeCounts[f.type] = (typeCounts[f.type] ?? 0) + 1;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full mb-2">
              <Compass size={14} />
              <span>{lang === 'hi' ? 'स्मार्ट GIS नेटवर्क' : 'Smart GIS Network'}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {t.facilitiesTitle}
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              {t.facilitiesSubtitle}
            </p>
          </div>

          <div className="glass-card-3d rounded-2xl px-4 py-2.5 flex items-center gap-2.5 self-start border border-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-emerald-800">
              {facilities.length} {lang === 'hi' ? 'सत्यापित नगरपालिका केंद्र' : 'Verified Municipal Nodes'}
            </span>
          </div>
        </div>

        {/* ── Daily Scrap Buyback Market Rate Card ── */}
        <div className="clay-card-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
            <div className="flex items-center gap-2 font-black text-sm text-gray-900">
              <Coins size={18} className="text-amber-600" />
              <span>{t.scrapRatesTitle}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-500">{t.scrapRatesSubtitle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SEED_SCRAP_RATES.map((scrap) => (
              <div key={scrap.id} className="p-3 bg-white/80 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{scrap.icon}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      scrap.trend === 'up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : scrap.trend === 'down'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {scrap.trend === 'up' ? (lang === 'hi' ? '▲ वृद्धि' : '▲ Up') : scrap.trend === 'down' ? (lang === 'hi' ? '▼ कमी' : '▼ Down') : (lang === 'hi' ? '● स्थिर' : '● Fixed')}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-800 mt-2 truncate">{scrap.material}</p>
                <p className="text-base font-black text-emerald-800 mt-0.5">₹{scrap.pricePerKg} <span className="text-[10px] font-normal text-gray-500">/ kg</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search & Filter Pill Controls ── */}
        <div className="clay-card-3d p-6 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'संयंत्र का नाम, शहर या जिला खोजें (उदा. Okhla, Koramangala)…' : 'Search by facility name, city, or district (e.g. Hyderabad, Okhla, Koramangala)…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
                selectedType === 'all'
                  ? 'clay-btn-green text-white shadow-sm'
                  : 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {t.allFacilities} ({typeCounts.all ?? 0})
            </button>
            {Object.entries(TYPE_META).map(([typeKey, meta]) => (
              <button
                key={typeKey}
                onClick={() => setSelectedType(typeKey)}
                className={`px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedType === typeKey
                    ? 'clay-btn-green text-white shadow-sm'
                    : 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <meta.icon size={14} />
                <span>{meta.label}</span> ({typeCounts[typeKey] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {/* ── Interactive 3D Spatial GIS Map ── */}
        <div className="clay-card-3d p-3 sm:p-4 bg-white border border-gray-200/80 overflow-hidden">
          <MapWithNoSSR facilities={filtered} userLocation={userLoc} />
        </div>

        {/* ── Live Tipper Telematics Fleet Status ── */}
        <div className="clay-card-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
            <div className="flex items-center gap-2 font-black text-sm text-gray-900">
              <Truck size={18} className="text-emerald-700" />
              <span>{t.liveFleetTitle}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              ⚡ {SEED_TIPPERS.length} {lang === 'hi' ? 'सक्रिय वाहन' : 'Active Vehicles'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SEED_TIPPERS.map((tipper) => (
              <div key={tipper.id} className="p-4 rounded-2xl bg-white border border-emerald-200/90 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-gray-900">{tipper.plateNumber}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {tipper.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{lang === 'hi' ? 'चालक:' : 'Driver:'} <strong>{tipper.driverName}</strong></span>
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <BatteryCharging size={13} /> {tipper.batteryPercent}%
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'वर्तमान वार्ड:' : 'Ward:'} {tipper.currentWard}</span>
                  <span className="font-bold text-teal-800">{tipper.capacityKg} kg {lang === 'hi' ? 'क्षमता' : 'cap'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Facility Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((facility) => {
            const meta = TYPE_META[facility.type] ?? TYPE_META.biomethanisation;
            const Icon = meta.icon;

            return (
              <div
                key={facility.id}
                className="clay-card-3d p-6 flex flex-col justify-between hover:border-emerald-300 transition-all duration-300 bg-white/80 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${meta.bg} ${meta.color} ${meta.border}`}
                    >
                      <Icon size={13} />
                      <span>{meta.label}</span>
                    </span>

                    {facility.distanceKm !== undefined && (
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {facility.distanceKm < 1
                          ? `${(facility.distanceKm * 1000).toFixed(0)} m`
                          : `${facility.distanceKm.toFixed(1)} km`}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-800 transition-colors">
                      {facility.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
                      <MapPin size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{facility.address}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t.plantCapacity}</span>
                      <span className="font-bold text-gray-800">{facility.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t.operatingHours}</span>
                      <span className="font-semibold text-gray-700">{facility.operatingHours}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {facility.acceptedWaste.map((w) => (
                      <span
                        key={w}
                        className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize"
                      >
                        {w.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`tel:${facility.contact}`}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Phone size={13} /> {facility.contact}
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn-green text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1"
                  >
                    <span>{t.getDirections}</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
