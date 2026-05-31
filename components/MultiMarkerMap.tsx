"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { MapMarker } from "@/lib/restaurant-location";
import { useLeafletIcon } from "@/hooks/useLeafletIcon";
import { MapFitBounds } from "@/components/MapFitBounds";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

type MultiMarkerMapProps = {
  markers: MapMarker[];
  className?: string;
  emptyLabel?: string;
};

export default function MultiMarkerMap({
  markers,
  className = "w-full h-full min-h-[280px]",
  emptyLabel = "No map locations available",
}: MultiMarkerMapProps) {
  const icon = useLeafletIcon();

  if (markers.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-600 px-4 text-center ${className}`}
      >
        {emptyLabel}
      </div>
    );
  }

  if (!icon) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-600 ${className}`}
      >
        Loading map…
      </div>
    );
  }

  const center = markers[0];

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[280px]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapFitBounds markers={markers} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icon}
          >
            <Popup>
              {marker.href ? (
                <Link href={marker.href} className="font-semibold underline">
                  {marker.name}
                </Link>
              ) : (
                marker.name
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
