"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const DUMMY_RESTAURANTS = [
  {
    id: 1,
    name: "The Italian Kitchen",
    city: "New York",
    state: "NY",
    country: "USA",
  },
  {
    id: 2,
    name: "Sushi House",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
  },
  {
    id: 3,
    name: "La Bella Pizza",
    city: "Chicago",
    state: "IL",
    country: "USA",
  },
  {
    id: 4,
    name: "Thai Paradise",
    city: "San Francisco",
    state: "CA",
    country: "USA",
  },
  {
    id: 5,
    name: "The Burger Joint",
    city: "Austin",
    state: "TX",
    country: "USA",
  },
  { id: 6, name: "French Bistro", city: "Boston", state: "MA", country: "USA" },
  { id: 7, name: "Taco Fiesta", city: "Miami", state: "FL", country: "USA" },
  { id: 8, name: "India House", city: "Seattle", state: "WA", country: "USA" },
  {
    id: 9,
    name: "Dragon Palace",
    city: "Portland",
    state: "OR",
    country: "USA",
  },
  {
    id: 10,
    name: "Mediterranean Grill",
    city: "Denver",
    state: "CO",
    country: "USA",
  },
];

interface Restaurant {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
}

export default function RestaurantSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    [],
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredRestaurants([]);
      setShowDropdown(false);
      return;
    }

    const filtered = DUMMY_RESTAURANTS.filter((r) =>
      r.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

    setFilteredRestaurants(filtered);
    setShowDropdown(true);
  }, [searchInput]);

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

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setSearchInput(restaurant.name);
    setShowDropdown(false);
  };

  const handleAddNew = () => {
    alert(`Adding new restaurant: "${searchInput}"`);
  };

  const handleSearch = () => {
    if (selectedRestaurant) {
      alert(`Searching for reviews of ${selectedRestaurant.name}`);
    }
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
            <div className=" bg-transparent border-3 rounded-[9px] md:py-4 px-4.5 p-4 md:flex items-end justify-between gap-4">
              {/* Left side (Label + Input) */}
              <div className="flex flex-col w-full max-md:mb-6">
                <label className="text-black! mb-2">Your Business Name</label>

                <Input
                  ref={inputRef}
                  type="text"
                  placeholder=""
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-transparent border-0 border-b border-black rounded-none px-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                />
              </div>

              {/* Right side (Button) */}
              {/* <Button
                onClick={handleSearch}
                disabled={!selectedRestaurant}
                className="h-10 px-6 "
              >
                SEARCH
              </Button> */}
              <button
                onClick={handleSearch}
                disabled={!selectedRestaurant}
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
                    <Link href="add-listing">
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
                    key={restaurant.id}
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className="w-full text-left px-4 py-3  flex justify-between items-center"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
