import Link from "next/link";
import { getPublishedRestaurants } from "@/lib/api-client";
import FeaturedRestaurantCard from "./featured-restaurant-card";
import RotatingKissLine from "./RotatingKissLine";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getChefsKissLines(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/site-copy`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const lines = json?.data?.chefs_kiss_lines;
    if (!Array.isArray(lines)) return [];
    return lines
      .map((line: unknown) => String(line || "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function RestaurantsList() {
  let featured: Awaited<ReturnType<typeof getPublishedRestaurants>>["data"] = [];
  let kissLines: string[] = [];

  const [restaurantsResult, lines] = await Promise.all([
    getPublishedRestaurants().catch(() => null),
    getChefsKissLines(),
  ]);

  featured = (restaurantsResult?.data ?? []).slice(0, 3);
  kissLines = lines;

  return (
    <section className="lg:my-32 my-24 max-sm:my-18">
      <div className="text-center page-width">
        <h2 className="title md:text-7xl font-black tracking-tighter mb-4">
          The Chef&apos;s Kiss
        </h2>
        <RotatingKissLine lines={kissLines} />

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
