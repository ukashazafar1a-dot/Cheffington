"use client";
import Link from "next/link";
import { Info } from "lucide-react";

interface RestaurantCardProps {
  restaurant: {
    id: number;
    name: string;
    cuisine: string;
    reviews: number;
    address: string;
  };
}

export default function RestaurantCard({
  restaurant,
}: RestaurantCardProps) {
  return (
    <div className="rounded-lg overflow-hidden p-3 sm:p-4 md:p-6 border border-gray-200">

      {/* Top Section */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-6">

        {/* Restaurant Image */}
        <div className="w-full sm:w-48 h-56 sm:h-48 bg-gray-300 rounded-lg flex-shrink-0" />

        {/* Restaurant Info */}
        <div className="flex-1">

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
            {restaurant.name}
          </h3>

          <p className="text-sm sm:text-base mb-3">
            {restaurant.cuisine}
          </p>

          {/* Reviews Badge */}
          <Link href='/Individual-restaurant-page'>
          <button className="button text-black font-bold py-2 px-4 rounded-lg inline-block mb-4 text-xs sm:text-sm md:text-base">
            {restaurant.reviews} CHEF REVIEWS
          </button>
          </Link>

          {/* Address */}
          <p className="text-sm leading-relaxed break-words">
            {restaurant.address}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 my-4 md:my-6" />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 md:gap-4 justify-center sm:justify-start">
        <ActionButton label="VIEW MENU" />
        <ActionButton label="RESERVATIONS" />
        <ActionButton label="CALL" />
      </div>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <div className="relative">
      <button className="button button-primary min-h-4! text-sm! px-8! min-w-fit!">
        {label}
      </button>
    </div>
  );
}