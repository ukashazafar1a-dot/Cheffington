import type { PublicRestaurant } from "@/types/restaurant";
import RetaurantsMap from "@/app/(main)/Individual-restaurant-page/_components/RetaurantsMap";
import { formatRestaurantAddress } from "@/lib/restaurant-location";
import type { GeocodePrecision } from "@/lib/geocode";
import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function RestaurantSidebar({
  restaurant,
  adRegion = null,
}: {
  restaurant: PublicRestaurant;
  adRegion?: string | null;
}) {
  const address = [
    restaurant.addressLine1,
    restaurant.addressLine2,
    `${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`,
    restaurant.country,
  ]
    .filter(Boolean)
    .join("\n");

  const websiteHref = restaurant.website
    ? restaurant.website.startsWith("http")
      ? restaurant.website
      : `https://${restaurant.website}`
    : null;

  return (
    <div className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:z-10">
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Contact & location</h2>
        {restaurant.phone && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <a href={`tel:${restaurant.phone}`} className="font-medium text-gray-900">
              {restaurant.phone}
            </a>
          </div>
        )}
        {websiteHref && (
          <div>
            <p className="text-sm text-gray-500">Website</p>
            <a
              href={websiteHref}
              className="font-medium text-[#ff8400] underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {restaurant.website}
            </a>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="whitespace-pre-line text-gray-800">{address}</p>
        </div>
      </section>

      <RetaurantsMap
        address={formatRestaurantAddress(restaurant)}
        lat={restaurant.latitude ?? undefined}
        lng={restaurant.longitude ?? undefined}
        geocodePrecision={restaurant.geocodePrecision as GeocodePrecision | undefined}
        addressFields={{
          addressLine1: restaurant.addressLine1,
          addressLine2: restaurant.addressLine2,
          city: restaurant.city,
          state: restaurant.state,
          zipCode: restaurant.zipCode,
          country: restaurant.country,
        }}
        locationName={restaurant.name}
        compact
      />

      <AdSlot
        slot={SITE_AD_SLOTS.RESTAURANT_SIDEBAR}
        variant="sidebar"
        className="w-full"
        region={adRegion}
        strictRegion
      />
    </div>
  );
}
