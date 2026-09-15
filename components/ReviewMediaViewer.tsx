"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ReviewMediaViewerItem = {
  url: string;
  type: "image" | "video";
  originalName?: string;
};

type Props = {
  media?: ReviewMediaViewerItem[];
  /** Limit thumbnails shown (e.g. homepage cards). */
  maxItems?: number;
  className?: string;
  thumbClassName?: string;
};

export default function ReviewMediaViewer({
  media,
  maxItems,
  className = "",
  thumbClassName = "",
}: Props) {
  const items = (media || [])
    .filter((item) => item?.url)
    .slice(0, maxItems ?? undefined);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  if (!items.length) return null;

  const active = activeIndex !== null ? items[activeIndex] : null;

  const dialog =
    active && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Review media"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow hover:bg-white"
            >
              Close
            </button>
            <div
              className="max-h-[90vh] max-w-[min(960px,100%)] overflow-hidden rounded-xl bg-black shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {active.type === "video" ? (
                <video
                  src={active.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[90vh] w-full bg-black"
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.url}
                  alt={active.originalName || "Review attachment"}
                  className="max-h-[90vh] w-full object-contain"
                />
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className={className}>
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.url}-${index}`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveIndex(index);
            }}
            className={`group relative overflow-hidden rounded-md border border-black/10 bg-black/5 text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8400] ${thumbClassName}`}
            aria-label={
              item.type === "video"
                ? "Open review video"
                : "Open review image"
            }
          >
            {item.type === "video" ? (
              <>
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="pointer-events-none h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                  <span className="rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Video
                  </span>
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.originalName || "Review attachment"}
                className="pointer-events-none h-full w-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
      {dialog}
    </>
  );
}
