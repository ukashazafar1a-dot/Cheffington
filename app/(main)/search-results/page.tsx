import Button from "@/components/Button";
import { getPublishedRestaurants } from "@/lib/api-client";
import {
  buildSearchResultsLabel,
  filterPublishedRestaurants,
  type RestaurantSearchParams,
} from "@/lib/filter-restaurants";
import RestaurantCard from "./_components/restaurant-card";
import SearchFiltersForm from "./_components/search-filters-form";
import SearchResultsMap from "./_components/search-results-map";

type Props = {
  searchParams: Promise<RestaurantSearchParams>;
};

export default async function SearchResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaults: RestaurantSearchParams = {
    cuisine: params.cuisine ?? "",
    location: params.location ?? "",
    chef: params.chef ?? "",
  };

  const { cuisineLabel, locationLabel } = buildSearchResultsLabel(defaults);

  let allRestaurants: Awaited<ReturnType<typeof getPublishedRestaurants>>["data"] =
    [];
  let loadError: string | null = null;

  try {
    const res = await getPublishedRestaurants();
    allRestaurants = res.data ?? [];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load restaurants";
  }

  const { results, chefOnly } = filterPublishedRestaurants(
    allRestaurants,
    defaults
  );

  return (
    <section className="py-6 md:py-10">
      <div className="page-width px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="subtitle text-sm sm:text-base md:text-lg leading-relaxed">
            Results for{" "}
            <span className="text-[#FF8400]">{cuisineLabel}</span> in{" "}
            <span className="text-[#FF8400]">{locationLabel}</span>.
          </p>
        </div>

        <SearchFiltersForm defaults={defaults} />

        <div className="flex flex-col xl:flex-row gap-6 mt-6">
          <div className="flex-1 w-full">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-2 sm:gap-3 my-4">
              <div className="scale-90 sm:scale-100 origin-left">
                <Button title="Sort by" />
              </div>
              <div className="scale-90 sm:scale-100 origin-left">
                <Button title="Near me" />
              </div>
              <div className="scale-90 sm:scale-100 origin-left">
                <Button title="More filters" />
              </div>
            </div>

            {loadError && (
              <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
                {loadError}
              </p>
            )}

            {chefOnly && (
              <p className="text-gray-600 bg-white border border-gray-200 rounded-lg p-6 mb-6">
                Chef search is coming soon. Try searching by cuisine or location.
              </p>
            )}

            {!loadError && !chefOnly && results.length === 0 && (
              <p className="text-gray-600 bg-white border border-gray-200 rounded-lg p-6 mb-6">
                No restaurants match your search. Try a different cuisine or location.
              </p>
            )}

            {!loadError && results.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 my-6">
                  {results.length} RESULT{results.length === 1 ? "" : "S"}
                </h2>
                <div className="space-y-6">
                  {results.map((restaurant) => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full xl:w-[420px] flex-shrink-0">
            <div className="bg-amber-900 h-[280px] sm:h-[350px] md:h-[400px] xl:h-[447px] w-full rounded overflow-hidden border">
              <SearchResultsMap location={defaults.location} />
            </div>
            <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] xl:h-[447px] rounded overflow-hidden bg-gray-200 mt-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
