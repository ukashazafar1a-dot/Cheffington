"use client";

import Button from "@/components/Button";

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
    <div className="rounded-lg overflow-hidden">

      {/* Top Section */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-6">

        {/* Restaurant Image */}
        <div className="w-full sm:w-48 h-56 sm:h-48 bg-gray-300 rounded-lg shrink-0" />

        {/* Restaurant Info */}
        <div className="flex-1">

          <h3 className="text-xl font-bold mb-1">
            {restaurant.name}
          </h3>

          <p className="text-xl tracking-[-8%] leading-tight  mb-3">
            {restaurant.cuisine}
          </p>

          <Button className="button button-primary py-3.5! px-8! min-h-10!" title={`${restaurant?.reviews} CHEF REVIEWS`} type="button" />

          {/* Address */}
          <p className="text-xl mt-4 leading-tight tracking-[-8%]">
            {restaurant.address}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t my-4 md:mt-12 mb-10" />

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
      <button className="button button-primary font-bold! min-h-4! text-sm! px-8! min-w-fit!">
        {label}
      </button>
    </div>
  );
}