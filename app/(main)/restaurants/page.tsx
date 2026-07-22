import { Suspense } from "react";
import { getAdTargetRegionMapping, getPublishedRestaurants } from "@/lib/api-client";
import {
  DEFAULT_TARGET_REGION_MAPPING,
  resolveRegionFromLocationQuery,
} from "@/lib/ad-target-region";
import {
  filterRestaurantsDirectory,
  type RestaurantDirectoryParams,
} from "@/lib/filter-restaurants-directory";
import {
  getRestaurantDistanceKm,
  NEAR_ME_RADIUS_KM,
} from "@/lib/restaurant-location";
import {
  parseRestaurantSort,
  sortRestaurants,
  restaurantSortLabel,
} from "@/lib/sort-restaurants";
import RestaurantListCard from "./_components/restaurant-list-card";
import RestaurantsSearchForm from "./_components/restaurants-search-form";
import RestaurantsToolbar from "./_components/restaurants-toolbar";
import RestaurantsListAd from "./_components/restaurants-list-ad";
import RestaurantsTopAd from "@/components/ads/RestaurantsTopAd";
import PersistDirectoryAdRegion from "./_components/persist-directory-ad-region";

type Props = {
  searchParams: Promise<RestaurantDirectoryParams>;
};

export default async function RestaurantsPage({ searchParams }: Props) {
  const params = await searchParams;

  const defaults: RestaurantDirectoryParams = {
    name: params.name ?? "",
    cuisine: params.cuisine ?? "",
    location: params.location ?? "",
    chef: params.chef ?? "",
    near: params.near ?? "",
    nearLat: params.nearLat ?? "",
    nearLng: params.nearLng ?? "",
    sort: params.sort ?? "",
  };

  let restaurants: Awaited<
    ReturnType<typeof getPublishedRestaurants>
  >["data"] = [];
  let error: string | null = null;

  try {
    const res = await getPublishedRestaurants();
    restaurants = res.data ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load restaurants";
  }

  const nearActive = defaults.near === "1";
  const nearLat = Number.parseFloat(defaults.nearLat ?? "");
  const nearLng = Number.parseFloat(defaults.nearLng ?? "");
  const hasNearCoords =
    nearActive && !Number.isNaN(nearLat) && !Number.isNaN(nearLng);
  const sortOption = parseRestaurantSort(defaults.sort);

  const { results: filtered, hasSearchFilters } = filterRestaurantsDirectory(
    restaurants,
    defaults
  );

  let displayRestaurants = filtered;
  if (!hasNearCoords) {
    displayRestaurants = sortRestaurants(displayRestaurants, sortOption);
  }

  const activeFilterLabel = hasNearCoords
    ? `Within ${NEAR_ME_RADIUS_KM} km of you`
    : sortOption !== "newest"
      ? restaurantSortLabel(sortOption)
      : null;

  const regionMapping = await getAdTargetRegionMapping().catch(
    () => DEFAULT_TARGET_REGION_MAPPING
  );
  const directoryAdRegion = resolveRegionFromLocationQuery(
    defaults.location,
    regionMapping
  );

  return (
    <section className="py-8 md:py-12">
      <div className="page-width px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 border-b border-gray-200/80 pb-8 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8400]">
              Directory
            </p>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Restaurants
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Discover chef-reviewed places on Cheffington.
            </p>
            {activeFilterLabel ? (
              <span className="mt-4 inline-flex items-center rounded-full border border-[#FF8400]/30 bg-[#FF8400]/10 px-3 py-1 text-xs font-semibold text-[#b35a00]">
                Showing: {activeFilterLabel}
              </span>
            ) : null}
          </div>

          <Suspense fallback={<div className="h-11 w-48 animate-pulse rounded-full bg-gray-200" />}>
            <RestaurantsToolbar />
          </Suspense>
        </div>

        <RestaurantsSearchForm defaults={defaults} />

        <PersistDirectoryAdRegion
          location={defaults.location}
          regions={regionMapping}
        />

        <RestaurantsTopAd region={directoryAdRegion} />

        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </p>
        )}

        {!error && displayRestaurants.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-800">
              {hasNearCoords
                ? `No restaurants within ${NEAR_ME_RADIUS_KM} km`
                : hasSearchFilters
                  ? "No restaurants match your search"
                  : "No restaurants published yet"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {hasNearCoords
                ? "Try turning off Near me or adjust your search filters."
                : hasSearchFilters
                  ? "Try a different name, cuisine, or location."
                  : "Check back soon for new listings."}
            </p>
          </div>
        )}

        {!error && displayRestaurants.length > 0 && (
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
              {displayRestaurants.length} place
              {displayRestaurants.length === 1 ? "" : "s"} found
              {hasNearCoords ? ` within ${NEAR_ME_RADIUS_KM} km` : ""}
            </p>
            <div className="grid gap-5 md:gap-6">
              {displayRestaurants.map((restaurant, index) => {
                const distanceKm = hasNearCoords
                  ? getRestaurantDistanceKm(restaurant, nearLat, nearLng)
                  : null;
                return (
                  <div key={restaurant._id}>
                    <RestaurantListCard
                      restaurant={restaurant}
                      distanceKm={distanceKm ?? undefined}
                    />
                    {index === 1 ? (
                      <RestaurantsListAd region={directoryAdRegion} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
