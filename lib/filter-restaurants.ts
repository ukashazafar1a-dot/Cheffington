import type { PublicRestaurant } from "@/types/restaurant";

export type RestaurantSearchParams = {
  cuisine?: string;
  location?: string;
  chef?: string;
};

export function formatRestaurantAddress(r: PublicRestaurant) {
  const parts = [
    r.addressLine1,
    r.addressLine2,
    `${r.city}, ${r.state} ${r.zipCode}`,
    r.country,
  ].filter(Boolean);
  return parts.join(", ");
}

export function filterPublishedRestaurants(
  restaurants: PublicRestaurant[],
  params: RestaurantSearchParams
) {
  const cuisine = params.cuisine?.trim().toLowerCase() ?? "";
  const location = params.location?.trim().toLowerCase() ?? "";
  const chef = params.chef?.trim().toLowerCase() ?? "";

  if (chef && !cuisine && !location) {
    return { results: [], chefOnly: true as const };
  }

  const hasFilter = Boolean(cuisine || location);

  if (!hasFilter) {
    return { results: restaurants, chefOnly: false as const };
  }

  const results = restaurants.filter((r) => {
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

  return { results, chefOnly: false as const };
}

export function buildSearchResultsLabel(params: RestaurantSearchParams) {
  const cuisine = params.cuisine?.trim();
  const location = params.location?.trim();

  return {
    cuisineLabel: cuisine || "any cuisine",
    locationLabel: location || "any location",
  };
}
