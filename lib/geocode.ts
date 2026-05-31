export type GeocodePrecision = "exact" | "city" | "region" | "none";

export type GeocodeResult = {
  lat: number;
  lng: number;
  precision: GeocodePrecision;
};

export type AddressFields = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

const cache = new Map<string, { lat: number; lng: number } | null>();

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

export function formatAddressFields(fields: AddressFields): string {
  const cityStateZip = [fields.city, fields.state, fields.zipCode]
    .filter(Boolean)
    .join(", ")
    .replace(/,\s*,/g, ",")
    .trim();

  return [
    fields.addressLine1,
    fields.addressLine2,
    cityStateZip,
    fields.country,
  ]
    .filter((part) => part && String(part).trim())
    .join(", ");
}

async function nominatimSearch(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  const cacheKey = trimmed.toLowerCase();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) ?? null;
  }

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

  if (!res.ok) {
    cache.set(cacheKey, null);
    return null;
  }

  const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
  const first = data[0];
  if (!first?.lat || !first?.lon) {
    cache.set(cacheKey, null);
    return null;
  }

  const lat = Number.parseFloat(first.lat);
  const lng = Number.parseFloat(first.lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    cache.set(cacheKey, null);
    return null;
  }

  const result = { lat, lng };
  cache.set(cacheKey, result);
  return result;
}

/** @deprecated Prefer geocodeAddressWithFallback or stored API coordinates. */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const result = await geocodeAddressWithFallback(address);
  if (!result || result.precision === "none") return null;
  return { lat: result.lat, lng: result.lng };
}

export async function geocodeAddressWithFallback(
  address: string,
  fields?: AddressFields
): Promise<GeocodeResult | null> {
  const full = address.trim();
  if (full.length >= 3) {
    const exact = await nominatimSearch(full);
    if (exact) return { ...exact, precision: "exact" };
  }

  if (fields) {
    const cityQuery = [fields.city, fields.state, fields.country]
      .filter(Boolean)
      .join(", ");
    if (cityQuery.length >= 2) {
      const city = await nominatimSearch(cityQuery);
      if (city) return { ...city, precision: "city" };
    }

    const cityCountryQuery = [fields.city, fields.country]
      .filter(Boolean)
      .join(", ");
    if (cityCountryQuery.length >= 2) {
      const cityCountry = await nominatimSearch(cityCountryQuery);
      if (cityCountry) return { ...cityCountry, precision: "city" };
    }

    if (fields.country?.trim()) {
      const region = await nominatimSearch(fields.country.trim());
      if (region) return { ...region, precision: "region" };
    }
  }

  return null;
}

export function zoomForPrecision(precision?: GeocodePrecision): number {
  switch (precision) {
    case "exact":
      return 15;
    case "city":
      return 11;
    case "region":
      return 8;
    default:
      return 13;
  }
}

export function precisionLabel(precision?: GeocodePrecision): string | null {
  switch (precision) {
    case "city":
      return "Approximate location (city area)";
    case "region":
      return "Approximate location (region)";
    default:
      return null;
  }
}
