"use client";

import { useEffect, useState } from "react";

const DEFAULT_CUISINES = [
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "American",
  "Indian",
  "Chinese",
  "Mediterranean",
];

const LAUNCH_CITIES = [
  "Nevada City",
  "Grass Valley",
  "Auburn",
  "Truckee",
  "Lake Tahoe",
  "Colfax",
  "Roseville",
  "Sierra City",
  "Raleigh",
  "Durham",
  "Chapel Hill",
  "Carrboro",
  "Cary",
];

type Props = {
  cuisines?: string[];
};

export default function RotatingKissLine({ cuisines = [] }: Props) {
  const cuisineList =
    cuisines.filter(Boolean).length > 0 ? cuisines : DEFAULT_CUISINES;
  const [cuisineIndex, setCuisineIndex] = useState(0);
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCuisineIndex((prev) => (prev + 1) % cuisineList.length);
      setCityIndex((prev) => (prev + 1) % LAUNCH_CITIES.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [cuisineList.length]);

  return (
    <p className="subtitle font-bold md:mb-12 mb-8">
      Best place for{" "}
      <span className="text-[#FF8400]">{cuisineList[cuisineIndex]}</span> in{" "}
      <span className="text-[#FF8400]">{LAUNCH_CITIES[cityIndex]}</span>
    </p>
  );
}
