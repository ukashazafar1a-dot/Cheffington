/**
 * Client/server helpers for ad geo-targeting.
 * Region mapping is loaded from the backend admin-managed target areas.
 */

const STORAGE_KEY = "cheffington_ad_visitor_region";

export type TargetRegionMapping = {
  key: string;
  state: string | null;
  cities: string[];
};

/** Fallback until the API responds (matches backend defaults). */
export const DEFAULT_TARGET_REGION_MAPPING: TargetRegionMapping[] = [
  {
    key: "placer_county_ca",
    state: "CA",
    cities: [
      "roseville",
      "rocklin",
      "auburn",
      "lincoln",
      "loomis",
      "granite bay",
      "penryn",
      "newcastle",
      "colfax",
    ],
  },
  {
    key: "nevada_county_ca",
    state: "CA",
    cities: [
      "nevada city",
      "grass valley",
      "truckee",
      "penn valley",
      "rough and ready",
    ],
  },
  {
    key: "raleigh_nc",
    state: "NC",
    cities: ["raleigh", "cary", "durham", "apex", "wake forest", "garner"],
  },
];

function normalizeText(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function resolveRegionFromCityState(
  city?: string | null,
  state?: string | null,
  regions: TargetRegionMapping[] = DEFAULT_TARGET_REGION_MAPPING
): string | null {
  const cityNorm = normalizeText(city);
  const stateNorm = normalizeText(state);
  if (!cityNorm) return null;

  for (const region of regions) {
    if (!region.cities.includes(cityNorm)) continue;
    const regionState = normalizeText(region.state);
    if (
      regionState &&
      stateNorm &&
      stateNorm !== regionState &&
      !stateNorm.startsWith(regionState)
    ) {
      continue;
    }
    return region.key;
  }

  for (const region of regions) {
    const cityHit = region.cities.some((alias) => {
      if (cityNorm.includes(alias)) return true;
      if (cityNorm.length >= 4 && alias.includes(cityNorm)) return true;
      return false;
    });
    if (!cityHit) continue;
    const regionState = normalizeText(region.state);
    if (
      regionState &&
      stateNorm &&
      stateNorm !== regionState &&
      !stateNorm.startsWith(regionState)
    ) {
      continue;
    }
    return region.key;
  }

  return null;
}

/** Parse free-text location filter like "Roseville, CA" or "Raleigh". */
export function resolveRegionFromLocationQuery(
  locationQuery?: string | null,
  regions: TargetRegionMapping[] = DEFAULT_TARGET_REGION_MAPPING
): string | null {
  const raw = String(locationQuery || "").trim();
  if (!raw) return null;

  const parts = raw.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return resolveRegionFromCityState(parts[0], parts[parts.length - 1], regions);
  }

  return resolveRegionFromCityState(raw, null, regions);
}

export function getStoredVisitorRegion(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
}

export function setStoredVisitorRegion(regionKey: string | null | undefined) {
  if (typeof window === "undefined") return;
  try {
    const key = String(regionKey || "").trim();
    if (!key) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore storage errors
  }
}
