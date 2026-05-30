export type GeocodeResult = {
  lat: number;
  lng: number;
};

const cache = new Map<string, GeocodeResult>();

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

/**
 * Convert a street address to coordinates via OpenStreetMap Nominatim.
 * Results are cached in-memory for the session.
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const trimmed = address.trim();
  if (trimmed.length < 3) return null;

  const cacheKey = trimmed.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = new URL(NOMINATIM_BASE);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "Cheffington/1.0 (https://cheffington.com)",
    },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
  const first = data[0];
  if (!first?.lat || !first?.lon) return null;

  const result: GeocodeResult = {
    lat: Number.parseFloat(first.lat),
    lng: Number.parseFloat(first.lon),
  };

  if (Number.isNaN(result.lat) || Number.isNaN(result.lng)) return null;

  cache.set(cacheKey, result);
  return result;
}
