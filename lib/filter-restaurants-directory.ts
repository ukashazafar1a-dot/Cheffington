import type { PublicRestaurant } from "@/types/restaurant";
import { filterRestaurantsNearMe } from "@/lib/restaurant-location";

export type RestaurantDirectoryParams = {
  name?: string;
  cuisine?: string;
  location?: string;
  chef?: string;
  near?: string;
  nearLat?: string;
  nearLng?: string;
  sort?: string;
};

function parseNearCoords(params: RestaurantDirectoryParams) {
  if (params.near !== "1") return null;
  const lat = Number.parseFloat(params.nearLat ?? "");
  const lng = Number.parseFloat(params.nearLng ?? "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export function hasDirectorySearchFilters(params: RestaurantDirectoryParams) {
  return Boolean(
    params.name?.trim() ||
      params.cuisine?.trim() ||
      params.location?.trim() ||
      params.chef?.trim()
  );
}

export function filterRestaurantsDirectory(
  restaurants: PublicRestaurant[],
  params: RestaurantDirectoryParams
) {
  const name = params.name?.trim().toLowerCase() ?? "";
  const cuisine = params.cuisine?.trim().toLowerCase() ?? "";
  const location = params.location?.trim().toLowerCase() ?? "";
  const chef = params.chef?.trim().toLowerCase() ?? "";
  const nearCoords = parseNearCoords(params);

  let results = restaurants;

  if (name || cuisine || location || chef) {
    results = results.filter((restaurant) => {
      if (name) {
        const nameHaystack = [restaurant.name, restaurant.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!nameHaystack.includes(name)) return false;
      }

      if (cuisine) {
        const cuisineHaystack = (restaurant.cuisine ?? "").toLowerCase();
        if (!cuisineHaystack.includes(cuisine)) return false;
      }

      if (location) {
        const locationHaystack = [
          restaurant.addressLine1,
          restaurant.addressLine2,
          restaurant.city,
          restaurant.state,
          restaurant.zipCode,
          restaurant.country,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!locationHaystack.includes(location)) return false;
      }

      // Chef name search is handled on the restaurants page via /api/chefs.
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
    nearActive: Boolean(nearCoords),
    hasSearchFilters: hasDirectorySearchFilters(params),
  };
}
