"use client";

import { useEffect } from "react";
import {
  resolveRegionFromLocationQuery,
  setStoredVisitorRegion,
  type TargetRegionMapping,
} from "@/lib/ad-target-region";
import { setStoredVisitorGeo } from "@/lib/ad-target-radius";

/**
 * Persists visitor ad region / coords from the restaurants directory.
 */
export default function PersistDirectoryAdRegion({
  location,
  regions,
  lat = null,
  lng = null,
}: {
  location?: string;
  regions: TargetRegionMapping[];
  lat?: number | null;
  lng?: number | null;
}) {
  useEffect(() => {
    const key = resolveRegionFromLocationQuery(location, regions);
    if (key) {
      setStoredVisitorRegion(key);
    }
    if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
      setStoredVisitorGeo(lat, lng);
    }
  }, [location, regions, lat, lng]);

  return null;
}
