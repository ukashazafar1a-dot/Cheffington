"use client";

import MultiMarkerMap from "@/components/MultiMarkerMap";
import GeocodedMap from "@/components/GeocodedMap";
import { markersFromRestaurants } from "@/lib/restaurant-location";
import type { PublicRestaurant } from "@/types/restaurant";

type SearchResultsMapProps = {
  location?: string;
  restaurants: PublicRestaurant[];
};

export default function SearchResultsMap({
  location,
  restaurants,
}: SearchResultsMapProps) {
  const markers = markersFromRestaurants(restaurants);
  const trimmedLocation = location?.trim();

  if (markers.length > 0) {
    return (
      <MultiMarkerMap
        markers={markers}
        className="w-full h-full min-h-[280px]"
        emptyLabel="No map locations available"
      />
    );
  }

  if (trimmedLocation) {
    return (
      <GeocodedMap
        address={trimmedLocation}
        name="Search area"
        className="w-full h-full min-h-[280px]"
      />
    );
  }

  if (restaurants.length > 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center bg-gray-100 px-4 text-center text-sm text-gray-600">
        Restaurant locations are being indexed. Edit and save listings in the
        owner portal to refresh map pins.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-gray-100 px-4 text-center text-sm text-gray-600">
      Search by location or browse restaurants to see the map
    </div>
  );
}
