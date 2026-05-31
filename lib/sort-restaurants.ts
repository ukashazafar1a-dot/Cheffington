import type { PublicRestaurant } from "@/types/restaurant";

export type RestaurantSortOption =
  | "newest"
  | "name-asc"
  | "name-desc"
  | "city-asc";

export const RESTAURANT_SORT_OPTIONS: {
  value: RestaurantSortOption;
  label: string;
}[] = [
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "city-asc", label: "City (A–Z)" },
];

export function parseRestaurantSort(
  value?: string | null
): RestaurantSortOption {
  if (
    value === "name-asc" ||
    value === "name-desc" ||
    value === "city-asc"
  ) {
    return value;
  }
  return "newest";
}

export function sortRestaurants(
  restaurants: PublicRestaurant[],
  sort: RestaurantSortOption
): PublicRestaurant[] {
  const list = [...restaurants];

  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "city-asc":
      return list.sort((a, b) =>
        (a.city ?? "").localeCompare(b.city ?? "", undefined, {
          sensitivity: "base",
        })
      );
    case "newest":
    default:
      return list.sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      });
  }
}

export function restaurantSortLabel(sort: RestaurantSortOption): string {
  return (
    RESTAURANT_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    "Newest"
  );
}
