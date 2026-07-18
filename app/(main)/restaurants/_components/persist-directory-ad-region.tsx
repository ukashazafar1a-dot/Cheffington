"use client";

import { useEffect } from "react";
import {
  resolveRegionFromLocationQuery,
  setStoredVisitorRegion,
} from "@/lib/ad-target-region";

/**
 * Persists visitor ad region from the restaurants directory location filter.
 */
export default function PersistDirectoryAdRegion({
  location,
}: {
  location?: string;
}) {
  useEffect(() => {
    const key = resolveRegionFromLocationQuery(location);
    if (key) {
      setStoredVisitorRegion(key);
    }
  }, [location]);

  return null;
}
