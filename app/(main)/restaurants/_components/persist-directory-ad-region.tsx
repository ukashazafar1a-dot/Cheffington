"use client";

import { useEffect } from "react";
import { setStoredVisitorGeo } from "@/lib/ad-target-radius";

/**
 * Persists real visitor coords from Near Me for ad targeting.
 * Does not store search city/region as the visitor location — searching
 * San Diego while in Nevada City must not overwrite Nevada City ads.
 */
export default function PersistDirectoryAdRegion({
  lat = null,
  lng = null,
}: {
  /** @deprecated kept for call-site compatibility; unused */
  location?: string;
  /** @deprecated kept for call-site compatibility; unused */
  regions?: unknown;
  lat?: number | null;
  lng?: number | null;
}) {
  useEffect(() => {
    if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
      setStoredVisitorGeo(lat, lng);
    }
  }, [lat, lng]);

  return null;
}
