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

type Props = {
  chef?: ChefProfile;
  restaurants?: PublicRestaurant[];
};

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

  const affiliated = affiliatedIds
    .map((id) => restaurants.find((restaurant) => String(restaurant._id) === id))
    .filter((restaurant): restaurant is PublicRestaurant => Boolean(restaurant));

  const workplaceLabel = chef?.currentRestaurant?.trim() || "";
  const workplaceHref = toExternalHref(chef?.currentRestaurantUrl);
  const workplaceLinkLabel = displayWebsiteLabel(chef?.currentRestaurantUrl);
  const listedNames = new Set(
    affiliated.map((restaurant) => restaurant.name.trim().toLowerCase())
  );
  const showWorkplace =
    Boolean(workplaceHref) ||
    (Boolean(workplaceLabel) && !listedNames.has(workplaceLabel.toLowerCase()));

  if (affiliated.length === 0 && !showWorkplace) {
    if (affiliatedIds.length > 0) return null;
    return (
      <div className="mb-10">
        <h2 className="subtitle mb-4">Restaurants</h2>
        <p className="rounded-3xl border-2 border-dashed border-black/40 p-6 text-gray-600">
          Select affiliated restaurants in Edit profile to show them here and on
          your public chef page.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="subtitle mb-4">Restaurants</h2>
      <div className="space-y-3">
        {affiliated.map((restaurant) => {
          const thumb = restaurant.images?.[0];
          const location = [restaurant.city, restaurant.state]
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={restaurant._id}
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
