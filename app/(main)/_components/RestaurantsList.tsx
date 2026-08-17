import Link from "next/link";
import { getPublishedRestaurants } from "@/lib/api-client";
import FeaturedRestaurantCard from "./featured-restaurant-card";
import RotatingKissLine from "./RotatingKissLine";

export default async function RestaurantsList() {
  let featured: Awaited<ReturnType<typeof getPublishedRestaurants>>["data"] = [];

  try {
    const res = await getPublishedRestaurants();
    // API returns newest first (updatedAt desc)
    featured = (res.data ?? []).slice(0, 3);
  } catch {
    featured = [];
  }

  const cuisines = [
    ...new Set(
      (featured ?? [])
        .map((r) => r.cuisine?.trim())
        .filter((value): value is string => Boolean(value))
    ),
  ];

  return (
    <section className="lg:my-32 my-24 max-sm:my-18">
      <div className="text-center page-width">
        <h2 className="title md:text-7xl font-black tracking-tighter mb-4">
          The Chef&apos;s Kiss
        </h2>
        <RotatingKissLine cuisines={cuisines} />

        {featured.length === 0 ? (
          <p className="text-gray-600 mb-8">
            No published restaurants yet.{" "}
            <Link href="/restaurants" className="text-[#ff8400] font-semibold underline">
              Browse restaurants
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((restaurant) => (
              <FeaturedRestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
