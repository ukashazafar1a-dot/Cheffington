"use client";

import Map from "@/components/Map";
import type { AddressFields, GeocodePrecision } from "@/lib/geocode";
import { useGeocodedLocation } from "@/hooks/useGeocodedLocation";
import { hasValidCoords } from "@/lib/restaurant-location";

type GeocodedMapProps = {
  address?: string;
  addressFields?: AddressFields;
  lat?: number;
  lng?: number;
  geocodePrecision?: GeocodePrecision;
  name?: string;
  className?: string;
  loadingLabel?: string;
  unavailableLabel?: string;
};

export default function GeocodedMap({
  address,
  addressFields,
  lat,
  lng,
  geocodePrecision,
  name,
  className = "w-full h-full min-h-60",
  loadingLabel = "Loading map…",
  unavailableLabel = "Map unavailable for this address",
}: GeocodedMapProps) {
  const { coords, loading, failed } = useGeocodedLocation({
    address,
    addressFields,
    lat,
    lng,
    geocodePrecision,
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

  if (!coords || failed || !hasValidCoords(coords.lat, coords.lng)) {
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
      key={`${coords.lat}-${coords.lng}-${coords.precision}`}
      lat={coords.lat}
      lng={coords.lng}
      name={name}
      precision={coords.precision}
    />
  );
}
