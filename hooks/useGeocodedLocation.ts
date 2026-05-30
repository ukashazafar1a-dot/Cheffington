"use client";

import { useEffect, useState } from "react";
import { geocodeAddress, type GeocodeResult } from "@/lib/geocode";

type UseGeocodedLocationOptions = {
  address?: string;
  lat?: number;
  lng?: number;
};

export function useGeocodedLocation({
  address,
  lat,
  lng,
}: UseGeocodedLocationOptions) {
  const hasExplicitCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng);

  const [coords, setCoords] = useState<GeocodeResult | null>(
    hasExplicitCoords ? { lat: lat!, lng: lng! } : null
  );
  const [loading, setLoading] = useState(
    !hasExplicitCoords && Boolean(address?.trim())
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (hasExplicitCoords) {
      setCoords({ lat: lat!, lng: lng! });
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

    geocodeAddress(trimmed).then((result) => {
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
  }, [address, lat, lng]);

  return { coords, loading, failed };
}
