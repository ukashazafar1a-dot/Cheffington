import type { PublicRestaurant } from "@/types/restaurant";

export default function RestaurantSidebar({
  restaurant,
}: {
  restaurant: PublicRestaurant;
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
    <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
      <h2 className="font-bold text-lg text-gray-900">Contact & location</h2>
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
        <p className="text-gray-800 whitespace-pre-line">{address}</p>
      </div>
    </section>
  );
}
