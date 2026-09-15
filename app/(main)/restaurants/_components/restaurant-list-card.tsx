import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import ChefReviewCountBadge from "@/components/ChefReviewCountBadge";
import type { PublicRestaurant } from "@/types/restaurant";
import { toExternalHref } from "@/types/chef";
import {
  formatRestaurantAddress,
  formatDistanceMiles,
} from "@/lib/restaurant-location";

function locationLine(restaurant: PublicRestaurant) {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ");
}

function ActionPill({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="inline-flex items-center gap-2 rounded-full bg-[#FF8400]/15 py-1.5 pl-1.5 pr-3.5 text-xs font-bold uppercase tracking-wide text-[#c45f00] ring-1 ring-[#FF8400]/35 transition-all hover:bg-[#FF8400]/25 hover:ring-[#FF8400]/50 sm:text-sm"
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF8400]/25 text-[#c45f00]">
        {icon}
      </span>
      {label}
    </a>
  );
}

export default function RestaurantListCard({
  restaurant,
  distanceKm,
  sponsored = false,
}: {
  restaurant: PublicRestaurant;
  distanceKm?: number;
  sponsored?: boolean;
}) {
  const thumb = restaurant.images?.[0];
  const address = formatRestaurantAddress(restaurant);
  const location = locationLine(restaurant);
  const websiteHref = toExternalHref(restaurant.website);
  const phoneHref = restaurant.phone?.trim()
    ? `tel:${restaurant.phone.trim()}`
    : undefined;

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
          {sponsored ? (
            <span className="absolute left-3 top-3 rounded bg-black/75 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Sponsored
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6 md:p-7">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {sponsored ? (
                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Sponsored
                </span>
              ) : null}
              {restaurant.cuisine ? (
                <span className="rounded-full bg-[#FF8400]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c45f00]">
                  {restaurant.cuisine}
                </span>
              ) : null}
              {typeof distanceKm === "number" ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {formatDistanceMiles(distanceKm)}
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

            {restaurant.tagline?.trim() ? (
              <p className="mt-1 text-sm italic text-gray-500">
                {restaurant.tagline.trim()}
              </p>
            ) : null}

            <ChefReviewCountBadge
              count={restaurant.reviewCount ?? 0}
              className="mt-2"
            />

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

            {(websiteHref || phoneHref) && (
              <div className="ml-auto flex flex-wrap items-center gap-2">
                {websiteHref ? (
                  <ActionPill
                    href={websiteHref}
                    label="View menu"
                    external
                    icon={<UtensilsCrossed className="h-3.5 w-3.5" aria-hidden />}
                  />
                ) : null}
                {websiteHref ? (
                  <ActionPill
                    href={websiteHref}
                    label="Reservations"
                    external
                    icon={<CalendarDays className="h-3.5 w-3.5" aria-hidden />}
                  />
                ) : null}
                {phoneHref ? (
                  <ActionPill
                    href={phoneHref}
                    label="Call"
                    icon={<Phone className="h-3.5 w-3.5" aria-hidden />}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
