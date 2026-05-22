"use client";

import Link from "next/link";
import type { PublicRestaurant } from "@/types/restaurant";

function formatAddress(r: PublicRestaurant) {
  const parts = [r.city, r.state].filter(Boolean);
  return parts.join(", ");
}

export default function RestaurantDirectoryCard({
  restaurant,
}: {
  restaurant: PublicRestaurant;
}) {
  const thumb = restaurant.images?.[0];

  return (
    <Link
      href={`/restaurants/${restaurant._id}`}
      className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="w-full h-48 bg-gray-200 relative">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm uppercase tracking-wide">
            No photo
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{restaurant.name}</h3>
        {restaurant.cuisine && (
          <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">{formatAddress(restaurant)}</p>
        {restaurant.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {restaurant.description}
          </p>
        )}
      </div>
    </Link>
  );
}
