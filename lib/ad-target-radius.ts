export const AD_RADIUS_MILES = [10, 30] as const;
export type AdRadiusMiles = (typeof AD_RADIUS_MILES)[number];

const GEO_STORAGE_KEY = "cheffington_ad_visitor_geo_v2";
const GEO_DENIED_KEY = "cheffington_ad_visitor_geo_denied_v2";

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
    return { lat: Number(parsed.lat), lng: Number(parsed.lng) };
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
      JSON.stringify({ lat: Number(lat), lng: Number(lng) })
    );
    window.sessionStorage.removeItem(GEO_DENIED_KEY);
  } catch {
    // ignore storage errors
  }
}

function wasVisitorGeoDenied(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(GEO_DENIED_KEY) === "1";
  } catch {
    return false;
  }
}

function markVisitorGeoDenied() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(GEO_DENIED_KEY, "1");
  } catch {
    // ignore
  }
}

/**
 * Resolve the visitor's real location for ad targeting.
 * Prefers stored Near Me / prior consent coords, then one quiet geolocation request.
 * Does not use restaurant/page coordinates — those are browsing context only.
 */
export function ensureVisitorGeo(): Promise<StoredVisitorGeo | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const stored = getStoredVisitorGeo();
  if (stored) return Promise.resolve(stored);
  if (wasVisitorGeoDenied()) return Promise.resolve(null);
  if (!navigator.geolocation) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (!hasFiniteCoords(next.lat, next.lng)) {
          resolve(null);
          return;
        }
        setStoredVisitorGeo(next.lat, next.lng);
        resolve(next);
      },
      () => {
        markVisitorGeoDenied();
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  });
}
