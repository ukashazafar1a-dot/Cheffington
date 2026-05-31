"use client";

import { useEffect, useState } from "react";
import {
  geocodeAddressWithFallback,
  type AddressFields,
  type GeocodePrecision,
  type GeocodeResult,
} from "@/lib/geocode";
import { hasValidCoords } from "@/lib/restaurant-location";

type UseGeocodedLocationOptions = {
  address?: string;
  addressFields?: AddressFields;
  lat?: number;
  lng?: number;
  geocodePrecision?: GeocodePrecision;
};

export function useGeocodedLocation({
  address,
  addressFields,
  lat,
  lng,
  geocodePrecision,
}: UseGeocodedLocationOptions) {
  const hasExplicitCoords = hasValidCoords(lat, lng);

  const [coords, setCoords] = useState<GeocodeResult | null>(() => {
    if (hasExplicitCoords) {
      return {
        lat: lat!,
        lng: lng!,
        precision: geocodePrecision ?? "exact",
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(
    !hasExplicitCoords && Boolean(address?.trim())
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (hasValidCoords(lat, lng)) {
      setCoords({
        lat: lat!,
        lng: lng!,
        precision: geocodePrecision ?? "exact",
      });
      setLoading(false);
      setFailed(false);
      return;
    }

    const trimmed = address?.trim();
    if (!trimmed) {
      setCoords(null);
      setLoading(false);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    geocodeAddressWithFallback(trimmed, addressFields).then((result) => {
      if (cancelled) return;
      if (result) {
        setCoords(result);
        setFailed(false);
      } else {
        setCoords(null);
        setFailed(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [address, addressFields, lat, lng, geocodePrecision]);

  return { coords, loading, failed };
}
