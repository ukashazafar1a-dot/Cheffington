"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPublishedRestaurants } from "@/lib/api-client";
import type { PublicRestaurant } from "@/types/restaurant";

export default function RestaurantSearch() {
  const router = useRouter();
  const [allRestaurants, setAllRestaurants] = useState<PublicRestaurant[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<PublicRestaurant[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<PublicRestaurant | null>(null);
  const [loadError, setLoadError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("chefToken");
    if (!token) {
      router.replace("/sign-in?returnUrl=/review");
      return;
    }

    getPublishedRestaurants()
      .then((res) => setAllRestaurants(res.data ?? []))
      .catch(() => setLoadError("Could not load restaurants. Try again later."));
  }, [router]);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredRestaurants([]);
      setShowDropdown(false);
      return;
    }

    const q = searchInput.toLowerCase();
    const filtered = allRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.state?.toLowerCase().includes(q)
    );

    setFilteredRestaurants(filtered);
    setShowDropdown(true);
  }, [searchInput, allRestaurants]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRestaurant = (restaurant: PublicRestaurant) => {
    setSelectedRestaurant(restaurant);
    setSearchInput(restaurant.name);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (selectedRestaurant) {
      router.push(`/review-1?restaurantId=${selectedRestaurant._id}`);
    }
  };

  return (
    <section>
      <div className="page-width-narrow flex items-center justify-center">
        <div className="py-16 md:pb-72 md:pt-20">
          <div className="mb-10 text-center">
            <h1 className="title w-full">
              <span className="text-[#FF8400]">Serve</span> Up{" "}
              <span className="text-[#FF8400]">Some</span> Love
            </h1>
            <p className="subtitle mt-2">Search an establishment to review.</p>
          </div>

          {loadError ? (
            <p className="text-center text-sm text-red-600">{loadError}</p>
          ) : null}

          <div className="relative">
            <div className="flex items-end justify-between gap-4 rounded-[9px] border-3 bg-transparent p-4 px-4.5 md:py-4 md:flex">
              <div className="relative flex w-full flex-col max-md:mb-6">
                <label className="body-text absolute -top-3 mb-2">Business Name</label>
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="rounded-none border-b border-black bg-transparent px-0 text-xl! text-black focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!selectedRestaurant}
                className="button button--primary max-md:w-full px-8.75! py-5.75!"
              >
                SEARCH
              </button>
            </div>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="left-0 right-0 top-full z-20 mt-1 overflow-y-auto rounded-xl border-3 border-black shadow-lg"
              >
                {searchInput.trim() && (
                  <div className="flex items-center gap-3 border-b px-4 py-3">
                    <Plus className="body-title h-5 w-5" />
                    <Link href="add-listing">
                      <p className="body-title flex-1 text-sm">
                        Don&apos;t see your establishment? Add an establishment with this name
                      </p>
                    </Link>
                  </div>
                )}

                {filteredRestaurants.length === 0 && searchInput.trim() ? (
                  <p className="body-title px-4 py-3 text-sm text-gray-600">
                    No published restaurants match your search.
                  </p>
                ) : null}

                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant._id}
                    type="button"
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-black/5"
                  >
                    <div>
                      <p className="body-title font-semibold">{restaurant.name}</p>
                      <p className="body-title text-sm">
                        {restaurant.city}, {restaurant.state}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
