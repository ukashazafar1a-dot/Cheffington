"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPublishedRestaurants } from "@/lib/api-client";
import type { PublicRestaurant } from "@/types/restaurant";

function matchesRestaurantQuery(restaurant: PublicRestaurant, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    restaurant.name.toLowerCase().includes(q) ||
    restaurant.city?.toLowerCase().includes(q) ||
    restaurant.state?.toLowerCase().includes(q)
  );
}

function locationLabel(restaurant: PublicRestaurant) {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ");
}

export default function RestaurantSearch() {
  const router = useRouter();
  const [allRestaurants, setAllRestaurants] = useState<PublicRestaurant[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    PublicRestaurant[]
  >([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<PublicRestaurant[] | null>(
    null
  );
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchHint, setSearchHint] = useState("");
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
      setSuggestOpen(false);
      return;
    }

    setFilteredRestaurants(
      allRestaurants.filter((restaurant) =>
        matchesRestaurantQuery(restaurant, searchInput)
      )
    );
  }, [searchInput, allRestaurants]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = (query: string, exactRestaurant?: PublicRestaurant) => {
    const trimmed = query.trim();
    setSuggestOpen(false);
    setSearchHint("");

    if (!trimmed) {
      setSearchResults(null);
      setSearchedQuery("");
      setSearchHint("Type a restaurant name, then search.");
      return;
    }

    const results = exactRestaurant
      ? [exactRestaurant]
      : allRestaurants.filter((restaurant) =>
          matchesRestaurantQuery(restaurant, trimmed)
        );

    setSearchedQuery(trimmed);
    setSearchResults(results);
  };

  const handleSelectRestaurant = (restaurant: PublicRestaurant) => {
    setSearchInput(restaurant.name);
    runSearch(restaurant.name, restaurant);
  };

  const handleSearch = () => {
    runSearch(searchInput);
  };

  return (
    <section>
      <div className="page-width-narrow flex items-center justify-center">
        <div className="w-full py-16 md:pb-24 md:pt-20">
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
            <div className="form-search-card flex items-end justify-between gap-4 md:flex md:py-4">
              <div className="relative flex w-full flex-col max-md:mb-6">
                <label className="form-search-label">Business Name</label>
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSuggestOpen(true);
                    setSearchHint("");
                  }}
                  onFocus={() => {
                    if (searchInput.trim()) setSuggestOpen(true);
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
                className="button button--primary max-md:w-full px-8.75! py-5.75!"
              >
                SEARCH
              </button>
            </div>

            {searchHint ? (
              <p className="mt-3 text-sm text-red-600">{searchHint}</p>
            ) : null}

            {suggestOpen && searchInput.trim() && (
              <div
                ref={dropdownRef}
                className="left-0 right-0 top-full z-20 mt-1 overflow-y-auto rounded-xl border-3 border-black bg-[#fff1e1] shadow-lg"
              >
                {searchInput.trim() && (
                  <div className="flex items-center gap-3 border-b px-4 py-3">
                    <Plus className="body-title h-5 w-5" />
                    <Link href="/add-listing">
                      <p className="body-title flex-1 text-sm">
                        Don&apos;t see your establishment? Add an establishment
                        with this name
                      </p>
                    </Link>
                  </div>
                )}

                {filteredRestaurants.length === 0 && searchInput.trim() ? (
                  <p className="body-title px-4 py-3 text-sm text-gray-600">
                    No published restaurants match yet. Search to confirm, or
                    add a listing.
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
                      <p className="body-title font-semibold">
                        {restaurant.name}
                      </p>
                      <p className="body-title text-sm">
                        {locationLabel(restaurant)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchResults ? (
            <div className="mt-10">
              {searchResults.length > 0 ? (
                <>
                  <p className="mb-4 text-sm font-semibold text-gray-700">
                    {searchResults.length === 1
                      ? "1 restaurant found. Confirm this is the right place, then write your review."
                      : `${searchResults.length} restaurants found. Pick the right one, then write your review.`}
                  </p>
                  <ul className="space-y-4">
                    {searchResults.map((restaurant) => {
                      const thumb = restaurant.images?.[0];
                      const location = locationLabel(restaurant);
                      return (
                        <li
                          key={restaurant._id}
                          className="overflow-hidden rounded-2xl border-2 border-black bg-white"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="h-40 w-full shrink-0 bg-gray-100 sm:h-auto sm:w-48">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={thumb}
                                  alt={restaurant.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full min-h-40 items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                                  No photo
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-5">
                              <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                  {restaurant.name}
                                </h2>
                                {location ? (
                                  <p className="mt-1 text-sm text-gray-600">
                                    {location}
                                  </p>
                                ) : null}
                                {restaurant.cuisine ? (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {restaurant.cuisine}
                                  </p>
                                ) : null}
                              </div>
                              <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                  href={`/review-1?restaurantId=${restaurant._id}`}
                                  className="button button--primary px-5 py-3 text-sm"
                                >
                                  Write review
                                </Link>
                                <Link
                                  href={`/restaurants/${restaurant._id}`}
                                  className="inline-flex items-center text-sm font-semibold underline"
                                >
                                  View restaurant page
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="rounded-2xl border-2 border-black bg-white p-6 text-left">
                  <h2 className="text-xl font-bold text-gray-900">
                    This restaurant was not found
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We don&apos;t have a published listing matching
                    {searchedQuery ? (
                      <>
                        {" "}
                        &ldquo;{searchedQuery}&rdquo;
                      </>
                    ) : null}
                    . You can add it as a listing. An admin will review and
                    approve it. After it is published, you can come back here
                    and write your review.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/add-listing"
                      className="button button--primary px-5 py-3 text-sm"
                    >
                      Add listing
                    </Link>
                    <Link
                      href="/claim-a-restaurant"
                      className="inline-flex items-center text-sm font-semibold underline"
                    >
                      Claim an existing business
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
