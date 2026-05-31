import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { PublicRestaurant } from "@/types/restaurant";
import {
  formatRestaurantAddress,
  formatDistanceKm,
} from "@/lib/restaurant-location";

function locationLine(restaurant: PublicRestaurant) {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ");
}

export default function RestaurantListCard({
  restaurant,
  distanceKm,
}: {
  restaurant: PublicRestaurant;
  distanceKm?: number;
}) {
  const thumb = restaurant.images?.[0];
  const address = formatRestaurantAddress(restaurant);
  const location = locationLine(restaurant);

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-[#FF8400]/40 hover:shadow-lg hover:shadow-[#FF8400]/10">
      <div className="flex flex-col md:flex-row">
        <Link
          href={`/restaurants/${restaurant._id}`}
          className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-gray-100 md:aspect-auto md:h-auto md:w-72 lg:w-80"
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={restaurant.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[200px] w-full items-center justify-center text-sm font-medium uppercase tracking-wide text-gray-400">
              No photo
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6 md:p-7">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {restaurant.cuisine ? (
                <span className="rounded-full bg-[#FF8400]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c45f00]">
                  {restaurant.cuisine}
                </span>
              ) : null}
              {typeof distanceKm === "number" ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {formatDistanceKm(distanceKm)}
                </span>
              ) : null}
              {location ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {location}
                </span>
              ) : null}
            </div>

            <Link href={`/restaurants/${restaurant._id}`} className="block">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#FF8400] sm:text-2xl">
                {restaurant.name}
              </h3>
            </Link>

            {restaurant.description ? (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                {restaurant.description}
              </p>
            ) : null}

            <p className="mt-3 text-sm text-gray-500">{address}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/restaurants/${restaurant._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF8400] px-5 py-2.5 text-sm font-bold text-black shadow-md shadow-[#FF8400]/20 transition-all hover:bg-[#e67600] hover:shadow-lg"
            >
              View restaurant
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
