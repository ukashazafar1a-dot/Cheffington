"use client";

import { useEffect, useRef, useState } from "react";
import { getPublishedRestaurants } from "@/lib/api-client";
import type { PublicRestaurant } from "@/types/restaurant";

const MAX_SUGGESTIONS = 8;

type Props = {
  id: string;
  name: string;
  defaultValue?: string;
};

function locationLabel(restaurant: PublicRestaurant) {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ");
}

export default function RestaurantNameSuggest({
  id,
  name,
  defaultValue = "",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [restaurants, setRestaurants] = useState<PublicRestaurant[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublishedRestaurants()
      .then((res) => setRestaurants(res.data ?? []))
      .catch(() => setRestaurants([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = value.trim().toLowerCase();
  const matches =
    query.length >= 1
      ? restaurants
          .filter((restaurant) =>
            restaurant.name.toLowerCase().includes(query)
          )
          .slice(0, MAX_SUGGESTIONS)
      : [];

  return (
    <div className="relative" ref={wrapRef}>
      <input
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        value={value}
        suppressHydrationWarning
        onChange={(e) => {
          setValue(e.target.value);
          setSuggestOpen(true);
        }}
        onFocus={() => {
          if (value.trim()) setSuggestOpen(true);
        }}
        className="form-search-input"
      />

      {suggestOpen && query ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border-3 border-black bg-[#1a1a1a] shadow-lg">
          {matches.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#FFF1E1]">
              No restaurants match this name.
            </p>
          ) : (
            matches.map((restaurant) => (
              <button
                key={restaurant._id}
                type="button"
                onClick={() => {
                  setValue(restaurant.name);
                  setSuggestOpen(false);
                }}
                className="flex w-full flex-col px-4 py-3 text-left text-[#FFF1E1] hover:bg-white/10"
              >
                <span className="font-semibold">{restaurant.name}</span>
                {locationLabel(restaurant) ? (
                  <span className="text-xs text-white/70">
                    {locationLabel(restaurant)}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
