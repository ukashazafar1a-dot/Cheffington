export const AD_RADIUS_MILES = [10, 30] as const;
export type AdRadiusMiles = (typeof AD_RADIUS_MILES)[number];

const GEO_STORAGE_KEY = "cheffington_ad_visitor_geo";

export function parseAdRadiusMiles(value: unknown): AdRadiusMiles | null {
  const miles = Number(value);
  if (miles === 10 || miles === 30) return miles;
  return null;
}

export function parseCityStateInput(
  raw: string,
  fallbackState = ""
): { city: string; state: string } {
  const trimmed = String(raw || "").trim().replace(/\s+/g, " ");
  const stateFallback = String(fallbackState || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);

  if (!trimmed) return { city: "", state: stateFallback };

  const commaParts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 2) {
    const state = commaParts[commaParts.length - 1]
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
    return {
      city: commaParts.slice(0, -1).join(", "),
      state: state || stateFallback,
    };
  }

  const tokens = trimmed.split(" ").filter(Boolean);
  const last = tokens[tokens.length - 1] || "";
  if (tokens.length >= 2 && /^[A-Za-z]{2}$/.test(last)) {
    return {
      city: tokens.slice(0, -1).join(" "),
      state: last.toUpperCase(),
    };
  }

  return { city: trimmed, state: stateFallback };
}

function slugify(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

export function buildCityRadiusRegionKey(
  city: string,
  state: string,
  miles: AdRadiusMiles
) {
  return `radius_${slugify(city) || "city"}_${slugify(state) || "xx"}_${miles}`;
}

export type StoredVisitorGeo = { lat: number; lng: number };

export function hasFiniteCoords(
  lat?: number | null | string,
  lng?: number | null | string
): boolean {
  if (lat == null || lng == null || lat === "" || lng === "") return false;
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  return (
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    Math.abs(parsedLat) <= 90 &&
    Math.abs(parsedLng) <= 180
  );
}

export function getStoredVisitorGeo(): StoredVisitorGeo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GEO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredVisitorGeo;
    if (!hasFiniteCoords(parsed?.lat, parsed?.lng)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredVisitorGeo(lat?: number | null, lng?: number | null) {
  if (typeof window === "undefined") return;
  try {
    if (!hasFiniteCoords(lat, lng)) {
      window.localStorage.removeItem(GEO_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      GEO_STORAGE_KEY,
      JSON.stringify({ lat, lng })
    );
  } catch {
    // ignore storage errors
  }
}
