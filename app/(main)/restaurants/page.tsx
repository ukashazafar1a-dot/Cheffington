import { getPublishedRestaurants } from "@/lib/api-client";
import RestaurantDirectoryCard from "./_components/restaurant-directory-card";

export default async function RestaurantsPage() {
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

  return (
    <main className="page-width lg:my-16 my-10">
      <h1 className="title md:text-6xl font-black tracking-tighter mb-2">
        Restaurants
      </h1>
      <p className="subtitle font-bold mb-10 text-gray-600">
        Browse places on Cheffington
      </p>

      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {restaurants.length === 0 && !error ? (
        <p className="text-gray-600">No restaurants published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <RestaurantDirectoryCard key={r._id} restaurant={r} />
          ))}
        </div>
      )}
    </main>
  );
}
