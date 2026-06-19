import Button from "@/components/Button";
import type { RestaurantDirectoryParams } from "@/lib/filter-restaurants-directory";

export default function RestaurantsSearchForm({
  defaults,
}: {
  defaults: RestaurantDirectoryParams;
}) {
  return (
    <form action="/restaurants" method="get" className="form-search-card mb-8">
      {defaults.near === "1" && defaults.nearLat && defaults.nearLng ? (
        <>
          <input type="hidden" name="near" value="1" />
          <input type="hidden" name="nearLat" value={defaults.nearLat} />
          <input type="hidden" name="nearLng" value={defaults.nearLng} />
        </>
      ) : null}
      {defaults.sort ? (
        <input type="hidden" name="sort" value={defaults.sort} />
      ) : null}

      <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="restaurants-name">
            Restaurant name
          </label>
          <input
            id="restaurants-name"
            name="name"
            type="text"
            defaultValue={defaults.name ?? ""}
            suppressHydrationWarning
            className="form-search-input"
            placeholder=""
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="restaurants-cuisine">
            Cuisine
          </label>
          <input
            id="restaurants-cuisine"
            name="cuisine"
            type="text"
            defaultValue={defaults.cuisine ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="restaurants-location">
            Location
          </label>
          <input
            id="restaurants-location"
            name="location"
            type="text"
            defaultValue={defaults.location ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="form-search-label" htmlFor="restaurants-chef">
            Chef
          </label>
          <input
            id="restaurants-chef"
            name="chef"
            type="text"
            defaultValue={defaults.chef ?? ""}
            suppressHydrationWarning
            className="form-search-input"
          />
        </div>

        <Button title="Let's Eat" type="submit" className="w-full lg:w-auto" />
      </div>
    </form>
  );
}
