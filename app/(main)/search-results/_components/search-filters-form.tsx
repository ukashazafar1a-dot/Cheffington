import Button from "@/components/Button";
import type { RestaurantSearchParams } from "@/lib/filter-restaurants";

export default function SearchFiltersForm({
  defaults,
}: {
  defaults: RestaurantSearchParams;
}) {
  return (
    <form action="/search-results" method="get" className="form-search-card">
      <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="search-cuisine">
            Cuisine
          </label>
          <input
            id="search-cuisine"
            name="cuisine"
            type="text"
            defaultValue={defaults.cuisine ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="search-location">
            Location
          </label>
          <input
            id="search-location"
            name="location"
            type="text"
            defaultValue={defaults.location ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="search-chef">
            Chef
          </label>
          <input
            id="search-chef"
            name="chef"
            type="text"
            defaultValue={defaults.chef ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <Button title="Search" type="submit" className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
