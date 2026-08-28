import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Compass,
  Radio,
  Crosshair,
  Satellite,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

interface LocationGrasperProps {
  onLocationGrasped: (data: {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
  }) => void;
  initialLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export default function LocationGrasper({
  onLocationGrasped,
  initialLocation,
  className = '',
}: LocationGrasperProps) {
  const { t, lang } = useLanguage();

  const [lat, setLat] = useState<number | null>(initialLocation?.lat || null);
  const [lng, setLng] = useState<number | null>(initialLocation?.lng || null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isGrasping, setIsGrasping] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockTime, setLockTime] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  // Reverse geocoding helper using OpenStreetMap Nominatim
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': lang === 'hi' ? 'hi,en;q=0.8' : 'en',
          },
        }
      );
      if (!res.ok) throw new Error('Geocoding service unavailable');
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (err) {
      console.warn('[LocationGrasper] Reverse geocode fallback:', err);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Municipal Zone)`;
    }
  };

  // Primary GPS Grasping function
  const graspLocation = () => {
    setIsGrasping(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg(
        lang === 'hi'
          ? 'आपके ब्राउज़र में जीपीएस सेवा समर्थित नहीं है।'
          : 'Geolocation is not supported by your browser.'
      );
      setIsGrasping(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 8);

        setLat(latitude);
        setLng(longitude);
        setAccuracy(acc);
        setLockTime(new Date().toLocaleTimeString());

        // Reverse geocode to street address
        const resolvedAddress = await reverseGeocode(latitude, longitude);
        setAddress(resolvedAddress);
        setIsGrasping(false);

        onLocationGrasped({
          lat: latitude,
          lng: longitude,
          address: resolvedAddress,
          accuracy: acc,
        });
      },
      (err) => {
        console.warn('[LocationGrasper] GPS error, using simulated Indian municipal coordinates:', err);
        // Fallback coordinates (New Delhi / Bengaluru municipal grid)
        const fallbackLat = 28.6139;
        const fallbackLng = 77.209;
        const fallbackAcc = 15;
        const fallbackAddr =
          lang === 'hi'
            ? 'कनॉट प्लेस, नई दिल्ली, 110001 (सिम्युलेटेड जीपीएस)'
            : 'Connaught Place, New Delhi, 110001 (Simulated GPS)';

        setLat(fallbackLat);
        setLng(fallbackLng);
        setAccuracy(fallbackAcc);
        setAddress(fallbackAddr);
        setLockTime(new Date().toLocaleTimeString());
        setErrorMsg(t.gpsSimulated);
        setIsGrasping(false);

        onLocationGrasped({
          lat: fallbackLat,
          lng: fallbackLng,
          address: fallbackAddr,
          accuracy: fallbackAcc,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Continuous watch position toggle
  const toggleWatchPosition = () => {
    if (isWatching) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatching(false);
    } else {
      if (!navigator.geolocation) return;
      setIsWatching(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 5);

          setLat(latitude);
          setLng(longitude);
          setAccuracy(acc);
          setLockTime(new Date().toLocaleTimeString());

          const resolvedAddress = await reverseGeocode(latitude, longitude);
          setAddress(resolvedAddress);

          onLocationGrasped({
            lat: latitude,
            lng: longitude,
            address: resolvedAddress,
            accuracy: acc,
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }
  };

  useEffect(() => {
    // Auto grasp location on mount
    graspLocation();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const getAccuracyQuality = (acc: number) => {
    if (acc <= 5) return { label: lang === 'hi' ? 'अति-सटीक (±' + acc + 'm)' : 'Ultra Precise (±' + acc + 'm)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (acc <= 15) return { label: lang === 'hi' ? 'उत्कृष्ट (±' + acc + 'm)' : 'Excellent (±' + acc + 'm)', color: 'text-teal-700 bg-teal-100 border-teal-300' };
    if (acc <= 30) return { label: lang === 'hi' ? 'अच्छा (±' + acc + 'm)' : 'Good (±' + acc + 'm)', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    return { label: lang === 'hi' ? 'अनुमानित (±' + acc + 'm)' : 'Estimated (±' + acc + 'm)', color: 'text-amber-700 bg-amber-100 border-amber-300' };
  };

  return (
    <div className={`clay-card-3d p-5 sm:p-6 space-y-4 bg-white/90 border-2 border-emerald-200/80 ${className}`}>
      {/* Grasper Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md relative overflow-hidden">
            <Satellite size={20} className={isGrasping ? 'animate-spin' : ''} />
            {isGrasping && (
              <span className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <span>{t.locationGrasperTitle}</span>
              {lat && !isGrasping && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 size={11} /> {lang === 'hi' ? 'जीपीएस लॉक' : 'GPS LOCKED'}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-gray-500">
              {lang === 'hi'
                ? 'सटीक उपग्रह निर्देशांक और पते का स्वचालित संकलन'
                : 'High-precision satellite geolocation & reverse geocoded street tagging'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={graspLocation}
            disabled={isGrasping}
            className="clay-btn-green text-white font-extrabold text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={13} className={isGrasping ? 'animate-spin' : ''} />
            <span>{isGrasping ? t.graspingGps : t.reGraspBtn}</span>
          </button>

          <button
            type="button"
            onClick={toggleWatchPosition}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isWatching
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm animate-pulse'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
            title="Toggle Live Continuous Watch"
          >
            <Radio size={13} />
            <span className="hidden sm:inline">{lang === 'hi' ? 'लाइव ट्रैकिंग' : 'Live Watch'}</span>
          </button>
        </div>
      </div>

      {/* Grasping Active Radar Animation */}
      {isGrasping && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-ping">
            <Crosshair size={16} />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-950">{t.graspingGps}</p>
            <p className="text-[11px] text-emerald-800">
              {lang === 'hi' ? 'उपग्रह सिग्नल खोजा जा रहा है...' : 'Acquiring high-accuracy GNSS fix...'}
            </p>
          </div>
        </div>
      )}

      {/* Grasped Data Card */}
      {lat !== null && lng !== null && (
        <div className="space-y-3 pt-1">
          {/* Coordinates & Accuracy Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Latitude / Longitude */}
            <div className="sm:col-span-2 p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={15} className="text-emerald-700" />
                <div>
                  <span className="text-[10px] uppercase font-black text-gray-600 block">
                    {t.gpsCoords}
                  </span>
                  <span className="font-mono font-bold text-gray-900">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </span>
                </div>
              </div>
              {lockTime && (
                <span className="text-[10px] text-gray-500 font-semibold">{lockTime}</span>
              )}
            </div>

            {/* Accuracy Badge */}
            {accuracy !== null && (
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                <Crosshair size={15} className="text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-black text-gray-600 block">
                    {t.gpsAccuracy}
                  </span>
                  <span
                    className={`inline-block text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                      getAccuracyQuality(accuracy).color
                    }`}
                  >
                    {getAccuracyQuality(accuracy).label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resolved Street Address */}
          {address && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <MapPin size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-black text-emerald-900 block tracking-wider">
                  {t.geocodedAddress}
                </span>
                <p className="text-xs font-bold text-gray-900 leading-snug break-words mt-0.5">
                  {address}
                </p>
              </div>
            </div>
          )}

          {/* Error / Simulation Notice */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] font-semibold text-amber-800">
              <AlertCircle size={13} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
