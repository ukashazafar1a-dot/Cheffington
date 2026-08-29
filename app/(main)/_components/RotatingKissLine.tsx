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

/** Highlight cuisine + city in: "Best place for {cuisine} in {city}" */
function renderKissLine(line: string) {
  const match = line.match(/^Best place for (.+) in (.+)$/i);
  if (!match) return line;

  const cuisine = match[1].trim();
  const city = match[2].trim();
  if (!cuisine || !city) return line;

  return (
    <>
      Best place for{" "}
      <span className="font-black" style={{ color: ACCENT }}>
        {cuisine}
      </span>{" "}
      in{" "}
      <span className="font-black" style={{ color: ACCENT }}>
        {city}
      </span>
    </>
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
  const content = renderKissLine(current);

  return (
    <p
      className="subtitle mx-auto mb-8 max-w-4xl px-2 text-center font-bold md:mb-12"
      aria-live="polite"
    >
      {reduceMotion ? (
        content
      ) : (
        <span key={index} className="kiss-scroll-word">
          {content}
        </span>
      )}
    </p>
  );
}
