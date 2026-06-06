import Link from "next/link";
import ChefReviewCountBadge from "@/components/ChefReviewCountBadge";
import type { PublicRestaurant } from "@/types/restaurant";

function formatLocation(r: PublicRestaurant) {
  const parts = [r.city, r.state].filter(Boolean);
  return parts.join(", ");
}

export default function FeaturedRestaurantCard({
  restaurant,
}: {
  restaurant: PublicRestaurant;
}) {
  const thumb = restaurant.images?.[0];

  return (
    <Link
      href={`/restaurants/${restaurant._id}`}
      className="aspect-square border border-black/10 flex flex-col justify-end p-6 group cursor-pointer hover:opacity-95 transition-opacity relative overflow-hidden bg-[#D9D9D9]"
    >
      {thumb ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
        </>
      ) : null}
      <div className="relative z-10 text-left w-full">
        <span
          className={`font-black text-sm uppercase tracking-widest text-center block ${
            thumb ? "text-[#FFF1E1] drop-shadow-sm" : "text-black"
          }`}
        >
          {restaurant.name}
        </span>
        {(restaurant.cuisine || formatLocation(restaurant)) && (
          <p
            className={`text-xs font-bold mt-2 uppercase tracking-wide text-center ${
              thumb ? "text-[#FFF1E1]/90" : "text-gray-700"
            }`}
          >
            {[restaurant.cuisine, formatLocation(restaurant)].filter(Boolean).join(" · ")}
          </p>
        )}
        <ChefReviewCountBadge
          count={restaurant.reviewCount ?? 0}
          className={`mt-2 text-center text-xs uppercase tracking-wide ${
            thumb ? "text-[#FFF1E1]" : ""
          }`}
        />
      </div>
    </Link>
  );
}
