'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { zoomForPrecision, precisionLabel, type GeocodePrecision } from '@/lib/geocode';
import { useLeafletIcon } from '@/hooks/useLeafletIcon';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

type Props = {
  lat: number;
  lng: number;
  name?: string;
  precision?: GeocodePrecision;
};

export default function Map({ lat, lng, name, precision = 'exact' }: Props) {
  const icon = useLeafletIcon();
  const zoom = zoomForPrecision(precision);
  const approximate = precisionLabel(precision);

  if (!icon) return null;

  return (
    <div className="relative w-full h-full rounded overflow-hidden border border-gray-900">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-60"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[lat, lng]} icon={icon}>
          <Popup>{name || "Location"}</Popup>
        </Marker>
      </MapContainer>
      {approximate ? (
        <p className="absolute bottom-2 left-2 right-2 rounded bg-black/70 px-2 py-1 text-center text-[10px] text-white">
          {approximate}
        </p>
      ) : null}
    </div>
  );
}
