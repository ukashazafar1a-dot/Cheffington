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

/** Default radius when Near me is active (kilometres). */
export const NEAR_ME_RADIUS_KM = 30;

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

export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.max(1, Math.round(distanceKm * 1000))} m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm)} km away`;
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
