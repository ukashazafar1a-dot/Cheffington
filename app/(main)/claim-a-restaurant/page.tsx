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
  const [searchInput, setSearchInput] = useState("");
  const [allRestaurants, setAllRestaurants] = useState<PublicRestaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    PublicRestaurant[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<PublicRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const res = await getPublishedRestaurants();
        setAllRestaurants(res.data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load restaurants"
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredRestaurants([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allRestaurants.filter((r) =>
      r.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

    setFilteredRestaurants(filtered);
    setShowDropdown(true);
  }, [allRestaurants, searchInput]);

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
    setError(null);
  };

  const handleSearch = () => {
    if (!selectedRestaurant) {
      setError(
        "Select a restaurant from the list, or add it if it isn’t listed."
      );
      return;
    }

    const qs = new URLSearchParams({
      restaurantId: selectedRestaurant._id,
      restaurantName: selectedRestaurant.name,
    });
    router.push(`/claim-a-restaurant-2?${qs.toString()}`);
  };

  return (
    <div className="md:pb-44 md:pt-20 py-10">
      <div className="  flex justify-center items-center px-4">
        <div className="mt-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="title w-full gap-2.5">
              <span className="text-black">Claim </span>
              <span className="text-black">Your </span>
              <span className="text-[#FF8400]">Business</span>
            </h1>
            <p className="subtitle mt-3 text-black">
              Search or Add Your Business Name
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="form-search-card md:flex items-end justify-between gap-4 md:py-4">
              <div className="flex w-full flex-col max-md:mb-6">
                <label className="form-search-label">Your Business Name</label>

                <Input
                  ref={inputRef}
                  type="text"
                  placeholder=""
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    setError(null);
                    if (
                      selectedRestaurant &&
                      value.trim().toLowerCase() !==
                        selectedRestaurant.name.trim().toLowerCase()
                    ) {
                      setSelectedRestaurant(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="form-search-input min-h-0! rounded-none border-0 border-b border-black px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="button button--primary max-md:w-full
                "
              >
                CLAIM
              </button>
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="left-0 right-0 top-full mt-1  border-3 border-black rounded-xl shadow-lg z-20 overflow-y-auto"
              >
                {/* Add new */}
                {searchInput.trim() && (
                  <div className="px-4 py-3 border-b  flex items-center gap-3">
                    <Plus className="w-5 h-5 body-title" />
                    <Link href="/add-listing">
                      <p className="body-title text-sm flex-1">
                        Don&apos;t see your establishment? Add an estabilshment
                        with this name
                      </p>
                    </Link>
                  </div>
                )}

                {/* Results */}
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant._id}
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className="w-full text-left px-4 py-3  flex justify-between items-center"
                    type="button"
                  >
                    <div>
                      <p className="body-title font-semibold">
                        {restaurant.name}
                      </p>
                      <p className="body-title text-sm">
                        {restaurant.city}, {restaurant.state}
                      </p>
                    </div>
                  </button>
                ))}

                {!loading && !filteredRestaurants.length && searchInput.trim() ? (
                  <p className="px-4 py-3 text-sm text-gray-700">
                    No matching restaurant found.
                  </p>
                ) : null}
              </div>
            )}
          </div>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
