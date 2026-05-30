"use client";

import Map from "@/components/Map";
import { useGeocodedLocation } from "@/hooks/useGeocodedLocation";

type GeocodedMapProps = {
  address?: string;
  lat?: number;
  lng?: number;
  name?: string;
  className?: string;
  loadingLabel?: string;
  unavailableLabel?: string;
};

export default function GeocodedMap({
  address,
  lat,
  lng,
  name,
  className = "w-full h-full min-h-60",
  loadingLabel = "Loading map…",
  unavailableLabel = "Map unavailable for this address",
}: GeocodedMapProps) {
  const { coords, loading, failed } = useGeocodedLocation({
    address,
    lat,
    lng,
  });

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-600 ${className}`}
      >
        {loadingLabel}
      </div>
    );
  }

  if (!coords || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-600 px-4 text-center ${className}`}
      >
        {unavailableLabel}
      </div>
    );
  }

  return (
    <Map
      key={`${coords.lat}-${coords.lng}`}
      lat={coords.lat}
      lng={coords.lng}
      name={name}
    />
  );
}
