import type { GeocodePrecision } from "@/lib/geocode";
import type { PublicRestaurant } from "@/types/restaurant";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  href?: string;
};

export function formatRestaurantAddress(r: PublicRestaurant | AddressLike) {
  const parts = [
    r.addressLine1,
    r.addressLine2,
    `${r.city}, ${r.state} ${r.zipCode}`,
    r.country,
  ].filter(Boolean);
  return parts.join(", ");
}

type AddressLike = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export function hasValidCoords(
  lat?: number | null,
  lng?: number | null
): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  );
}

export function restaurantToMarker(
  restaurant: PublicRestaurant
): MapMarker | null {
  if (!hasValidCoords(restaurant.latitude, restaurant.longitude)) {
    return null;
  }

  return {
    id: restaurant._id,
    lat: restaurant.latitude,
    lng: restaurant.longitude!,
    name: restaurant.name,
    href: `/restaurants/${restaurant._id}`,
  };
}

export function markersFromRestaurants(
  restaurants: PublicRestaurant[]
): MapMarker[] {
  return restaurants
    .map(restaurantToMarker)
    .filter((marker): marker is MapMarker => marker !== null);
}

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Default Near me radius shown in the UI (miles). */
export const NEAR_ME_RADIUS_MILES = 30;

/** Same radius in km for haversine comparisons. */
export const NEAR_ME_RADIUS_KM = NEAR_ME_RADIUS_MILES * KM_PER_MILE;

export function getRestaurantDistanceKm(
  restaurant: PublicRestaurant,
  originLat: number,
  originLng: number
): number | null {
  if (!hasValidCoords(restaurant.latitude, restaurant.longitude)) {
    return null;
  }
  return haversineKm(
    originLat,
    originLng,
    restaurant.latitude!,
    restaurant.longitude!
  );
}

/** Keep only restaurants within radius of the user, nearest first. */
export function filterRestaurantsNearMe(
  restaurants: PublicRestaurant[],
  originLat: number,
  originLng: number,
  radiusKm: number = NEAR_ME_RADIUS_KM
): PublicRestaurant[] {
  return restaurants
    .flatMap((restaurant) => {
      const distanceKm = getRestaurantDistanceKm(
        restaurant,
        originLat,
        originLng
      );
      if (distanceKm === null || distanceKm > radiusKm) return [];
      return [restaurant];
    })
    .sort((a, b) => {
      const da = getRestaurantDistanceKm(a, originLat, originLng)!;
      const db = getRestaurantDistanceKm(b, originLat, originLng)!;
      return da - db;
    });
}

/** Format a haversine km distance for display in miles. */
export function formatDistanceMiles(distanceKm: number): string {
  const miles = distanceKm / KM_PER_MILE;
  if (miles < 0.1) {
    return "Nearby";
  }
  if (miles < 10) {
    return `${miles.toFixed(1)} mi away`;
  }
  return `${Math.round(miles)} mi away`;
}

/** @deprecated Use filterRestaurantsNearMe for Near me mode. */
export function sortByDistance(
  restaurants: PublicRestaurant[],
  originLat: number,
  originLng: number
): PublicRestaurant[] {
  return filterRestaurantsNearMe(restaurants, originLat, originLng, Infinity);
}

export function mapGeocodePrecision(
  precision?: string | null
): GeocodePrecision | undefined {
  if (
    precision === "exact" ||
    precision === "city" ||
    precision === "region" ||
    precision === "none"
  ) {
    return precision;
  }
  return undefined;
}

type LocationFields = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

/** Normalize "Grass Valley, CA" and "Grass Valley CA" the same way. */
export function normalizeLocationSearchText(raw: string): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeStateCode(token: string): boolean {
  return /^[a-z]{2}$/.test(token);
}

/**
 * Parse free-text location into city + state when the last token is a
 * 2-letter state/province code (with or without a comma in the original input).
 */
export function parseLocationSearchQuery(raw: string): {
  normalized: string;
  city: string | null;
  state: string | null;
} {
  const normalized = normalizeLocationSearchText(raw);
  if (!normalized) return { normalized: "", city: null, state: null };

  const tokens = normalized.split(" ").filter(Boolean);
  if (tokens.length >= 2 && looksLikeStateCode(tokens[tokens.length - 1]!)) {
    return {
      normalized,
      city: tokens.slice(0, -1).join(" "),
      state: tokens[tokens.length - 1]!,
    };
  }

  return { normalized, city: null, state: null };
}

function stateMatches(restaurantState: string, queryState: string): boolean {
  if (!restaurantState || !queryState) return false;
  return (
    restaurantState === queryState ||
    restaurantState.startsWith(queryState) ||
    queryState.startsWith(restaurantState)
  );
}

function cityMatches(restaurantCity: string, queryCity: string): boolean {
  if (!restaurantCity || !queryCity) return false;
  return (
    restaurantCity === queryCity ||
    restaurantCity.includes(queryCity) ||
    queryCity.includes(restaurantCity)
  );
}

/**
 * Match a restaurant to a location search string.
 * - "Grass Valley" → any state with that city
 * - "Grass Valley CA" / "Grass Valley, CA" → that city + state only
 * Avoids false state hits (e.g. "IN" matching inside "Main").
 */
export function restaurantMatchesLocationQuery(
  restaurant: LocationFields,
  locationQuery: string
): boolean {
  const parsed = parseLocationSearchQuery(locationQuery);
  if (!parsed.normalized) return true;

  const city = String(restaurant.city || "")
    .trim()
    .toLowerCase();
  const state = String(restaurant.state || "")
    .trim()
    .toLowerCase();

  if (parsed.city && parsed.state) {
    return cityMatches(city, parsed.city) && stateMatches(state, parsed.state);
  }

  const haystack = normalizeLocationSearchText(
    [
      restaurant.addressLine1,
      restaurant.addressLine2,
      restaurant.city,
      restaurant.state,
      restaurant.zipCode,
      restaurant.country,
    ]
      .filter(Boolean)
      .join(" ")
  );

  return haystack.includes(parsed.normalized);
}
