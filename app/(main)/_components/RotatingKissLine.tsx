"use client";

import { useEffect, useMemo, useState } from "react";

const ROTATE_MS = 2500;
const ACCENT = "#FF8400";

const DEFAULT_LINES = [
  "Best place for Pakistani food in Nevada City",
  "Best place for Italian food in Grass Valley",
  "Best place for Mexican food in Auburn",
  "Best place for Japanese food in Truckee",
  "Best place for Thai food in Lake Tahoe",
  "Best place for American food in Colfax",
  "Best place for Indian food in Roseville",
  "Best place for Chinese food in Sierra City",
  "Best place for Mediterranean food in Raleigh",
  "Best place for French food in Durham",
  "Best place for Italian food in Chapel Hill",
  "Best place for Mexican food in Carrboro",
  "Best place for Pakistani food in Cary",
];

type Props = {
  lines?: string[];
};

type KissParts = {
  cuisine: string;
  city: string;
};

/** Parse "Best place for {cuisine} in {city}" — returns null if format does not match. */
function parseKissLine(line: string): KissParts | null {
  const match = String(line || "")
    .trim()
    .match(/^Best place for (.+) in (.+)$/i);
  if (!match) return null;

  const cuisine = match[1].trim();
  const city = match[2].trim();
  if (!cuisine || !city) return null;
  return { cuisine, city };
}

function AccentWord({
  children,
  animate,
}: {
  children: string;
  animate: boolean;
}) {
  if (!animate) {
    return (
      <span className="font-black" style={{ color: ACCENT }}>
        {children}
      </span>
    );
  }

  return (
    <span className="kiss-scroll-word font-black" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function RotatingKissLine({ lines = [] }: Props) {
  const list = useMemo(() => {
    const cleaned = (lines ?? [])
      .map((line) => String(line || "").trim())
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : DEFAULT_LINES;
  }, [lines]);

  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [list]);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [list]);

  const current = list[index % list.length] ?? DEFAULT_LINES[0];
  const parts = parseKissLine(current);
  const animate = !reduceMotion && list.length > 1;

  return (
    <p
      className="subtitle mx-auto mb-8 max-w-4xl px-2 text-center font-bold md:mb-12"
      aria-live="polite"
    >
      {parts ? (
        <>
          Best place for{" "}
          <AccentWord key={`cuisine-${index}`} animate={animate}>
            {parts.cuisine}
          </AccentWord>{" "}
          in{" "}
          <AccentWord key={`city-${index}`} animate={animate}>
            {parts.city}
          </AccentWord>
        </>
      ) : animate ? (
        <span key={index} className="kiss-scroll-word">
          {current}
        </span>
      ) : (
        current
      )}
    </p>
  );
}
