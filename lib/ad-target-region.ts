/**
 * Client-side helpers for ad geo-targeting.
 * Backend is authoritative for serve filtering; these mirror launch cities for UX.
 */

const STORAGE_KEY = "cheffington_ad_visitor_region";

/** Launch markets (must stay in sync with backend publicSelectable regions). */
export const PUBLIC_AD_TARGET_REGION_HINTS: {
  key: string;
  state: string;
  cities: string[];
}[] = [
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
  state?: string | null
): string | null {
  const cityNorm = normalizeText(city);
  const stateNorm = normalizeText(state);
  if (!cityNorm) return null;

  for (const region of PUBLIC_AD_TARGET_REGION_HINTS) {
    if (!region.cities.includes(cityNorm)) continue;
    const regionState = normalizeText(region.state);
    if (
      stateNorm &&
      stateNorm !== regionState &&
      !stateNorm.startsWith(regionState)
    ) {
      continue;
    }
    return region.key;
  }

  for (const region of PUBLIC_AD_TARGET_REGION_HINTS) {
    const cityHit = region.cities.some((alias) => {
      if (cityNorm.includes(alias)) return true;
      if (cityNorm.length >= 4 && alias.includes(cityNorm)) return true;
      return false;
    });
    if (!cityHit) continue;
    const regionState = normalizeText(region.state);
    if (
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
  locationQuery?: string | null
): string | null {
  const raw = String(locationQuery || "").trim();
  if (!raw) return null;

  const parts = raw.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return resolveRegionFromCityState(parts[0], parts[parts.length - 1]);
  }

  return resolveRegionFromCityState(raw, null);
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
