import Button from "@/components/Button";
import type { RestaurantSearchParams } from "@/lib/filter-restaurants";

export default function SearchFiltersForm({
  defaults,
}: {
  defaults: RestaurantSearchParams;
}) {
  return (
    <form
      action="/search-results"
      method="get"
      className="bg-transparent border-2 border-black rounded-[9px] p-4 sm:p-5 md:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 items-end">
        <div className="flex flex-col space-y-2">
          <label className="uppercase text-base sm:text-lg md:text-xl" htmlFor="search-cuisine">
            Cuisine
          </label>
          <input
            id="search-cuisine"
            name="cuisine"
            type="text"
            defaultValue={defaults.cuisine ?? ""}
            suppressHydrationWarning
            className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="uppercase text-base sm:text-lg md:text-xl" htmlFor="search-location">
            Location
          </label>
          <input
            id="search-location"
            name="location"
            type="text"
            defaultValue={defaults.location ?? ""}
            suppressHydrationWarning
            className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="uppercase text-base sm:text-lg md:text-xl" htmlFor="search-chef">
            Chef
          </label>
          <input
            id="search-chef"
            name="chef"
            type="text"
            defaultValue={defaults.chef ?? ""}
            suppressHydrationWarning
            className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
          />
        </div>

        <Button title="Search" type="submit" className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
