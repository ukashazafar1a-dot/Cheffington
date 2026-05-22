"use client";

import Link from "next/link";
import type { PublicRestaurant } from "@/types/restaurant";
import { formatRestaurantAddress } from "@/lib/filter-restaurants";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: PublicRestaurant;
}) {
  const thumb = restaurant.images?.[0];
  const address = formatRestaurantAddress(restaurant);

  return (
    <div className="rounded-lg overflow-hidden p-3 sm:p-4 md:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-6">
        <div className="w-full sm:w-48 h-56 sm:h-48 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
            {restaurant.name}
          </h3>

          {restaurant.cuisine && (
            <p className="text-sm sm:text-base mb-3">{restaurant.cuisine}</p>
          )}

          <Link href={`/restaurants/${restaurant._id}`}>
            <span className="button text-black font-bold py-2 px-4 rounded-lg inline-block mb-4 text-xs sm:text-sm md:text-base cursor-pointer">
              VIEW RESTAURANT
            </span>
          </Link>

          <p className="text-sm leading-relaxed break-words">{address}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4 md:my-6" />

      <div className="flex flex-wrap gap-3 md:gap-4 justify-center sm:justify-start">
        <Link href={`/restaurants/${restaurant._id}`}>
          <span className="button button-primary min-h-4! text-sm! px-8! min-w-fit! inline-block cursor-pointer">
            VIEW DETAILS
          </span>
        </Link>
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`}>
            <span className="button button-primary min-h-4! text-sm! px-8! min-w-fit! inline-block cursor-pointer">
              CALL
            </span>
          </a>
        )}
        {restaurant.website && (
          <a
            href={
              restaurant.website.startsWith("http")
                ? restaurant.website
                : `https://${restaurant.website}`
            }
            target="_blank"
            rel="noreferrer"
          >
            <span className="button button-primary min-h-4! text-sm! px-8! min-w-fit! inline-block cursor-pointer">
              WEBSITE
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
