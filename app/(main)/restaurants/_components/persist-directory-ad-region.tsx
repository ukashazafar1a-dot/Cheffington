"use client";

import { useEffect } from "react";
import {
  resolveRegionFromLocationQuery,
  setStoredVisitorRegion,
  type TargetRegionMapping,
} from "@/lib/ad-target-region";

/**
 * Persists visitor ad region from the restaurants directory location filter.
 */
export default function PersistDirectoryAdRegion({
  location,
  regions,
}: {
  location?: string;
  regions: TargetRegionMapping[];
}) {
  useEffect(() => {
    const key = resolveRegionFromLocationQuery(location, regions);
    if (key) {
      setStoredVisitorRegion(key);
    }
  }, [location, regions]);

  return null;
}
