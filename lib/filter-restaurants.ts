import type { PublicRestaurant } from "@/types/restaurant";
import {
  formatRestaurantAddress,
  filterRestaurantsNearMe,
} from "@/lib/restaurant-location";

export { formatRestaurantAddress };

export type RestaurantSearchParams = {
  cuisine?: string;
  location?: string;
  chef?: string;
  near?: string;
  nearLat?: string;
  nearLng?: string;
};

function parseNearCoords(params: RestaurantSearchParams) {
  if (params.near !== "1") return null;
  const lat = Number.parseFloat(params.nearLat ?? "");
  const lng = Number.parseFloat(params.nearLng ?? "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export function filterPublishedRestaurants(
  restaurants: PublicRestaurant[],
  params: RestaurantSearchParams
) {
  const cuisine = params.cuisine?.trim().toLowerCase() ?? "";
  const location = params.location?.trim().toLowerCase() ?? "";
  const chef = params.chef?.trim().toLowerCase() ?? "";
  const nearCoords = parseNearCoords(params);

  if (chef && !cuisine && !location && !nearCoords) {
    return { results: [], chefOnly: true as const, nearActive: false };
  }

  const hasFilter = Boolean(cuisine || location);

  let results = restaurants;

  if (hasFilter) {
    results = restaurants.filter((r) => {
      if (cuisine) {
        const cuisineHaystack = (r.cuisine ?? "").toLowerCase();
        if (!cuisineHaystack.includes(cuisine)) {
          return false;
        }
      }

      if (location) {
        const locationHaystack = [
          r.addressLine1,
          r.addressLine2,
          r.city,
          r.state,
          r.zipCode,
          r.country,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!locationHaystack.includes(location)) {
          return false;
        }
      }

      return true;
    });
  }

  if (nearCoords) {
    results = filterRestaurantsNearMe(
      results,
      nearCoords.lat,
      nearCoords.lng
    );
  }

  return {
    results,
    chefOnly: false as const,
    nearActive: Boolean(nearCoords),
  };
}

export function buildSearchResultsLabel(params: RestaurantSearchParams) {
  const cuisine = params.cuisine?.trim();
  const location = params.location?.trim();
  const nearCoords = parseNearCoords(params);

  return {
    cuisineLabel: cuisine || "any cuisine",
    locationLabel: nearCoords
      ? "near you"
      : location || "any location",
  };
}
