"use client";

import { Check, ChevronDown, Loader2, MapPin, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  parseRestaurantSort,
  RESTAURANT_SORT_OPTIONS,
  restaurantSortLabel,
  type RestaurantSortOption,
} from "@/lib/sort-restaurants";

const pillBase =
  "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200";

const pillIdle =
  "border-gray-200 bg-white text-gray-800 shadow-sm hover:border-[#FF8400]/60 hover:shadow-md";

const pillActive =
  "border-[#FF8400] bg-[#FF8400] text-black shadow-md shadow-[#FF8400]/25";

export default function RestaurantsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadingNear, setLoadingNear] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const currentSort = parseRestaurantSort(searchParams.get("sort"));
  const nearActive = searchParams.get("near") === "1";

  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sortOpen]);

  const handleSortChange = (value: RestaurantSortOption) => {
    setSortOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleNearMe = () => {
    if (nearActive) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("near");
      params.delete("nearLat");
      params.delete("nearLng");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    setLoadingNear(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("near", "1");
        params.set("nearLat", String(position.coords.latitude));
        params.set("nearLng", String(position.coords.longitude));
        router.push(`${pathname}?${params.toString()}`);
        setLoadingNear(false);
      },
      () => {
        toast.error("Unable to access your location. Check browser permissions.");
        setLoadingNear(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div ref={sortRef} className="relative">
        <button
          type="button"
          onClick={() => !nearActive && setSortOpen((open) => !open)}
          disabled={nearActive}
          aria-haspopup="listbox"
          aria-expanded={sortOpen}
          aria-label="Sort restaurants"
          title={nearActive ? "Turn off Near me to change sort" : undefined}
          className={`${pillBase} ${pillIdle} ${
            sortOpen ? "border-[#FF8400]/60 shadow-md" : ""
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#FF8400]" aria-hidden />
          <span className="text-gray-500">Sort</span>
          <span className="max-w-[8.5rem] truncate text-gray-900">
            {restaurantSortLabel(currentSort)}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
              sortOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>

        {sortOpen && !nearActive ? (
          <ul
            role="listbox"
            aria-label="Sort options"
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[11.5rem] overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl shadow-black/10"
          >
            {RESTAURANT_SORT_OPTIONS.map((option) => {
              const selected = currentSort === option.value;
              return (
                <li key={option.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      selected
                        ? "bg-[#FF8400]/10 font-semibold text-[#b35a00]"
                        : "font-medium text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-[#FF8400]" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleNearMe}
        disabled={loadingNear}
        className={`${pillBase} ${nearActive ? pillActive : pillIdle} disabled:opacity-70`}
      >
        {loadingNear ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {nearActive ? "Near me · On" : "Near me"}
      </button>
    </div>
  );
}
