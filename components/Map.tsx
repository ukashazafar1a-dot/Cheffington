'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

type Props = {
  lat: number;
  lng: number;
  name?: string;
};

export default function Map({ lat, lng, name }: Props) {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((L) => {

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      setIcon(customIcon);
    });
  }, []);


  if (!icon) return null;

  return (
    <div className=" w-full h-full rounded overflow-hidden border border-gray-900">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
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
    </div>
  );
}