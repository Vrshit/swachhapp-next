import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Facility } from '@/lib/types';

// Fix Leaflet default icon path issue in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const TYPE_COLORS: Record<string, string> = {
  biomethanisation: '#16a34a',
  'waste-to-energy': '#d97706',
  recycling: '#2563eb',
  'scrap-collection': '#9333ea',
};

function getColoredIcon(type: string) {
  const color = TYPE_COLORS[type] ?? '#ef4444';
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">♻</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

interface Props {
  facilities: Facility[];
}

export default function FacilityMap({ facilities }: Props) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {facilities.map((f) => (
        <Marker key={f.id} position={[f.lat, f.lng]} icon={getColoredIcon(f.type)}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{f.name}</p>
              <p className="text-gray-600">{f.address}</p>
              <p className="text-primary-600 mt-1">{f.contact}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
