"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Globe, MapPin } from "lucide-react";
import { getPublishedRestaurants } from "@/lib/api-client";
import {
  displayWebsiteLabel,
  toExternalHref,
  type ChefProfile,
} from "@/types/chef";
import type { PublicRestaurant } from "@/types/restaurant";

const OWNER_APP_URL =
  process.env.NEXT_PUBLIC_OWNER_APP_URL ?? "http://localhost:3002";

type Props = {
  chef?: ChefProfile;
  restaurants?: PublicRestaurant[];
};

function ownedStatusBadge(status?: string) {
  if (status === "published") return "Owns";
  if (status === "pending_review") return "Awaiting review";
  if (status === "rejected") return "Rejected";
  if (status === "draft") return "Draft";
  return "Owns";
}

export default function ChefAffiliatedRestaurants({
  chef,
  restaurants: restaurantsProp,
}: Props) {
  const [fetchedRestaurants, setFetchedRestaurants] = useState<
    PublicRestaurant[]
  >([]);
  const affiliatedIds = useMemo(
    () => (chef?.affiliatedRestaurantIds ?? []).map(String).filter(Boolean),
    [chef?.affiliatedRestaurantIds]
  );
  const ownedRestaurants = chef?.ownedRestaurants ?? [];
  const isBusinessOwner = chef?.applicationType === "business_owner";

  useEffect(() => {
    if (restaurantsProp) return;
    if (affiliatedIds.length === 0) {
      setFetchedRestaurants([]);
      return;
    }

    let cancelled = false;
    getPublishedRestaurants()
      .then((res) => {
        if (!cancelled) setFetchedRestaurants(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setFetchedRestaurants([]);
      });

    return () => {
      cancelled = true;
    };
  }, [affiliatedIds, restaurantsProp]);

  const restaurants = restaurantsProp ?? fetchedRestaurants;

  const ownedIds = new Set(ownedRestaurants.map((r) => String(r._id)));

  const affiliated = affiliatedIds
    .map((id) => restaurants.find((restaurant) => String(restaurant._id) === id))
    .filter((restaurant): restaurant is PublicRestaurant => Boolean(restaurant))
    // Avoid duplicating a restaurant already listed as owned
    .filter((restaurant) => !ownedIds.has(String(restaurant._id)));

  const workplaceLabel = chef?.currentRestaurant?.trim() || "";
  const workplaceHref = toExternalHref(chef?.currentRestaurantUrl);
  const workplaceLinkLabel = displayWebsiteLabel(chef?.currentRestaurantUrl);
  const listedNames = new Set(
    [
      ...ownedRestaurants.map((r) => r.name?.trim().toLowerCase() || ""),
      ...affiliated.map((restaurant) => restaurant.name.trim().toLowerCase()),
    ].filter(Boolean)
  );
  const showWorkplace =
    Boolean(workplaceHref) ||
    (Boolean(workplaceLabel) && !listedNames.has(workplaceLabel.toLowerCase()));

  if (ownedRestaurants.length === 0 && affiliated.length === 0 && !showWorkplace) {
    if (affiliatedIds.length > 0) return null;
    return (
      <div className="mb-10">
        <h2 className="subtitle mb-4">Restaurants</h2>
        <p className="rounded-3xl border-2 border-dashed border-black/40 p-6 text-gray-600">
          {isBusinessOwner
            ? "Restaurants you own will appear here after you add them in the business owner dashboard and they are linked to your account."
            : "Select affiliated restaurants in Edit profile to show them here and on your public chef page."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="subtitle mb-4">Restaurants</h2>
      <div className="space-y-3">
        {ownedRestaurants.map((restaurant) => {
          const thumb = restaurant.images?.[0];
          const location = [restaurant.city, restaurant.state]
            .filter(Boolean)
            .join(", ");
          const isPublished = restaurant.status === "published";
          const href = isPublished
            ? `/restaurants/${restaurant._id}`
            : `${OWNER_APP_URL.replace(/\/$/, "")}/dashboard/restaurants/${restaurant._id}/edit`;
          const rowClassName =
            "group flex items-center gap-4 rounded-3xl border-2 border-black bg-white p-3 transition hover:border-[#FF8400]";

          const content = (
            <>
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FFF1E1]">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#FF8400]">
                    {restaurant.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-gray-900 group-hover:text-[#FF8400]">
                  {restaurant.name}
                </p>
                {location ? (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {location}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 rounded-full bg-[#FF8400]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c45f00]">
                {ownedStatusBadge(restaurant.status)}
              </span>
            </>
          );

          if (isPublished) {
            return (
              <Link
                key={`owned-${restaurant._id}`}
                href={href}
                className={rowClassName}
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={`owned-${restaurant._id}`}
              href={href}
              className={rowClassName}
            >
              {content}
            </a>
          );
        })}

        {affiliated.map((restaurant) => {
          const thumb = restaurant.images?.[0];
          const location = [restaurant.city, restaurant.state]
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={`affiliated-${restaurant._id}`}
              href={`/restaurants/${restaurant._id}`}
              className="group flex items-center gap-4 rounded-3xl border-2 border-black bg-white p-3 transition hover:border-[#FF8400]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FFF1E1]">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#FF8400]">
                    {restaurant.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-gray-900 group-hover:text-[#FF8400]">
                  {restaurant.name}
                </p>
                {location ? (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {location}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 rounded-full bg-[#FF8400]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c45f00]">
                Affiliated
              </span>
            </Link>
          );
        })}

        {showWorkplace ? (
          workplaceHref ? (
            <a
              href={workplaceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-3xl border-2 border-black bg-white p-3 transition hover:border-[#FF8400]"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E1]">
                <Globe className="h-6 w-6 text-[#FF8400]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-gray-900 group-hover:text-[#FF8400]">
                  {workplaceLabel || "Restaurant"}
                </p>
                <p className="mt-0.5 truncate text-sm text-gray-500">
                  {workplaceLinkLabel || workplaceHref}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#FF8400]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c45f00]">
                Workplace
              </span>
            </a>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-black/40 bg-white px-5 py-4 text-sm font-medium text-gray-700">
              {workplaceLabel}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
