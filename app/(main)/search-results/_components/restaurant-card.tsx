"use client";

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

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="rounded-lg overflow-hidden p-3 md:p-6">
      <div className="flex gap-6 mb-6">
        {/* Restaurant Image */}
        <div className="w-48 h-48 bg-gray-300 rounded-lg flex-shrink-0" />

        {/* Restaurant Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
          <p className="mb-3">{restaurant.cuisine}</p>

          {/* Reviews Badge */}
          <button className="button text-black font-bold py-2 px-4 rounded-lg inline-block mb-4">
            {restaurant.reviews} CHEF REVIEWS
          </button>

          {/* Address */}
          <p className="text-sm">{restaurant.address}</p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 my-6" />

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
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
      <button className="button !w-[117px] !h-[44px] !rounded-lg">
        {label}
      </button>
    </div>
  );
}
