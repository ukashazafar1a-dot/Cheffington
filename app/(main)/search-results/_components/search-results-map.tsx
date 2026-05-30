"use client";

import GeocodedMap from "@/components/GeocodedMap";

type SearchResultsMapProps = {
  location?: string;
};

export default function SearchResultsMap({ location }: SearchResultsMapProps) {
  const trimmed = location?.trim();

  if (!trimmed) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center bg-gray-100 px-4 text-center text-sm text-gray-600">
        Search by location to see the map
      </div>
    );
  }

  return (
    <GeocodedMap
      address={trimmed}
      name="Search area"
      className="w-full h-full min-h-[280px]"
    />
  );
}
