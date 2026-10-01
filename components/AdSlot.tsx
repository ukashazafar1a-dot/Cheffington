"use client";

import { useEffect, useState } from "react";
import type { ActiveAdCampaign, AdSlotSize } from "@/types/advertising";
import { getActiveAd } from "@/lib/api-client";
import { trackAdEvent } from "@/lib/ad-analytics";
import {
  getStoredVisitorRegion,
  setStoredVisitorRegion,
} from "@/lib/ad-target-region";
import {
  getStoredVisitorGeo,
  hasFiniteCoords,
  setStoredVisitorGeo,
} from "@/lib/ad-target-radius";

type AdSlotProps = {
  slot: string;
  className?: string;
  variant?: "sidebar" | "banner" | "inline";
  /** Light card around label + creative (sidebar / inline) */
  showCard?: boolean;
  /** Preferred geo region for this slot (e.g. from restaurant city) */
  region?: string | null;
  /** Use strict matching for explicit page-region slots; unknown/non-matching => no ad */
  strictRegion?: boolean;
  /** Visitor / page coordinates for city + radius ads */
  lat?: number | null;
  lng?: number | null;
  /** Extra classes on the clickable creative frame */
  frameClassName?: string;
  /** Force full-width frame (e.g. list cards between restaurant rows) */
  forceFillWidth?: boolean;
};

const DEFAULT_ROTATION_INTERVAL_MS = 25000;

const VARIANT_FALLBACK_SIZE: Record<
  NonNullable<AdSlotProps["variant"]>,
  AdSlotSize
> = {
  sidebar: { width: 300, height: 250, sizeLabel: "300×250" },
  banner: { width: 728, height: 90, sizeLabel: "728×90" },
  inline: { width: 300, height: 250, sizeLabel: "300×250" },
};

/** Per-slot fallbacks when API size is missing (matches admin recommended sizes). */
const SLOT_FALLBACK_SIZE: Record<string, AdSlotSize> = {
  homepage_featured: { width: 970, height: 250, sizeLabel: "970×250" },
  restaurant_sidebar: { width: 300, height: 600, sizeLabel: "300×600" },
  restaurant_sidebar1: { width: 300, height: 600, sizeLabel: "300×600" },
  restaurant_top: { width: 728, height: 90, sizeLabel: "728×90" },
  restaurant_right_rail: { width: 300, height: 250, sizeLabel: "300×250" },
  restaurant_reviews_top: { width: 728, height: 90, sizeLabel: "728×90" },
  chef_sidebar: { width: 300, height: 250, sizeLabel: "300×250" },
  chef_sidebar1: { width: 300, height: 250, sizeLabel: "300×250" },
  /** Between restaurant list cards — match restaurant card footprint */
  restaurants_list: { width: 960, height: 280, sizeLabel: "960×280" },
  restaurants_top: { width: 728, height: 90, sizeLabel: "728×90" },
};

function resolveSlotSize(
  slotSize: AdSlotSize | null | undefined,
  variant: NonNullable<AdSlotProps["variant"]>,
  slot: string
): AdSlotSize {
  // Known layout slots use fixed site sizes (e.g. tall chef/restaurant sidebars).
  if (SLOT_FALLBACK_SIZE[slot]) {
    return SLOT_FALLBACK_SIZE[slot];
  }
  const width = slotSize?.width ?? 0;
  const height = slotSize?.height ?? 0;
  if (width > 0 && height > 0 && slotSize) {
    return slotSize;
  }
  return VARIANT_FALLBACK_SIZE[variant];
}

function getSlotFrameClassName(slotSize: AdSlotSize, extra = "") {
  return `mx-auto w-full overflow-hidden rounded-sm ${extra}`.trim();
}

function getSlotFrameStyle(
  slotSize: AdSlotSize,
  fillWidth: boolean,
  /** When true, height comes from CSS classes (list-card match). */
  cssSizedFrame = false
): React.CSSProperties {
  if (cssSizedFrame) {
    return {
      width: "100%",
      maxWidth: "100%",
    };
  }
  if (fillWidth) {
    return {
      width: "100%",
      maxWidth: "100%",
      aspectRatio: `${slotSize.width} / ${slotSize.height}`,
    };
  }

  return {
    maxWidth: `${slotSize.width}px`,
    height: `${slotSize.height}px`,
  };
}

function prefetchAdImages(ads: ActiveAdCampaign[]) {
  for (const item of ads) {
    const src = String(item.imageUrl || "").trim();
    if (!src || typeof window === "undefined") continue;
    const img = new window.Image();
    img.src = src;
  }
}

export default function AdSlot({
  slot,
  className = "",
  variant = "sidebar",
  showCard,
  region = null,
  strictRegion = false,
  lat = null,
  lng = null,
  frameClassName = "",
  forceFillWidth,
}: AdSlotProps) {
  const useCard = showCard ?? (variant === "sidebar" || variant === "inline");
  const fillWidth =
    forceFillWidth ?? (variant === "sidebar" || variant === "inline");
  const cssSizedFrame = Boolean(frameClassName.trim());
  const [ads, setAds] = useState<ActiveAdCampaign[] | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [slotSize, setSlotSize] = useState<AdSlotSize | null>(null);
  const [rotationIntervalMs, setRotationIntervalMs] = useState(
    DEFAULT_ROTATION_INTERVAL_MS
  );

  useEffect(() => {
    let cancelled = false;
    const explicitRegion = String(region || "").trim();
    if (explicitRegion) {
      setStoredVisitorRegion(explicitRegion);
    }
    const hasExplicitCoords = hasFiniteCoords(lat, lng);
    if (hasExplicitCoords) {
      setStoredVisitorGeo(Number(lat), Number(lng));
    }
    const storedGeo = getStoredVisitorGeo();
    const resolvedLat = hasExplicitCoords ? Number(lat) : storedGeo?.lat;
    const resolvedLng = hasExplicitCoords ? Number(lng) : storedGeo?.lng;
    const resolvedRegion = strictRegion
      ? explicitRegion || null
      : explicitRegion || getStoredVisitorRegion() || null;

    getActiveAd(slot, resolvedRegion, {
      strictRegion,
      lat: resolvedLat,
      lng: resolvedLng,
    })
      .then(
        ({
          ad: activeAd,
          ads: activeAds,
          slotSize: activeSlotSize,
          rotationIntervalMs: intervalMs,
        }) => {
          if (cancelled) return;
          const list =
            Array.isArray(activeAds) && activeAds.length > 0
              ? activeAds.filter((item) => Boolean(item?.imageUrl))
              : activeAd?.imageUrl
                ? [activeAd]
                : [];
          setAds(list);
          setIndex(0);
          setSlotSize(activeSlotSize);
          if (typeof intervalMs === "number" && intervalMs >= 5000) {
            setRotationIntervalMs(intervalMs);
          }
          prefetchAdImages(list);
        }
      )
      .catch(() => {
        if (!cancelled) {
          setAds([]);
          setSlotSize(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slot, region, strictRegion, lat, lng]);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ads.length);
    }, rotationIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [ads, rotationIntervalMs]);

  const ad = ads === undefined ? undefined : ads[index] || ads[0] || null;

  useEffect(() => {
    if (!ad?._id || !ad.imageUrl) return;
    trackAdEvent({
      type: "impression",
      campaignId: String(ad._id),
      placementKey: slot,
      targetRegionKey: ad.targetRegionKey || "sitewide",
    });
  }, [ad?._id, ad?.imageUrl, ad?.targetRegionKey, slot]);

  if (ad === undefined || !ad?.imageUrl) {
    return null;
  }

  const frameSize = resolveSlotSize(slotSize, variant, slot);
  const frameStyle = getSlotFrameStyle(frameSize, fillWidth, cssSizedFrame);

  const recordClick = () => {
    trackAdEvent({
      type: "click",
      campaignId: String(ad._id),
      placementKey: slot,
      targetRegionKey: ad.targetRegionKey || "sitewide",
    });
  };

  const content = (
    <>
      <p
        className={`font-bold uppercase tracking-wide ${
          useCard
            ? "mb-3 text-xs text-[#d97706] md:text-sm"
            : "mb-2 text-[10px] text-gray-500"
        }`}
      >
        Advertisement · Sponsored
      </p>
      <a
        key={ad._id}
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={recordClick}
        onAuxClick={(e) => {
          // Middle-click only — ignore right-click context menu.
          if (e.button === 1) recordClick();
        }}
        className={getSlotFrameClassName(
          frameSize,
          `block overflow-hidden bg-white ${
            cssSizedFrame
              ? ""
              : useCard
                ? "rounded-lg border border-[#ff8400]/15 shadow-sm"
                : "rounded-sm border border-black/10"
          } ${frameClassName}`.trim()
        )}
        style={frameStyle}
        aria-label={`Advertisement, sponsored: ${ad.businessName}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt={`Advertisement, sponsored — ${ad.businessName}`}
          className={`h-full w-full ${fillWidth || cssSizedFrame ? "object-cover" : "object-contain"}`}
        />
      </a>
    </>
  );

  return (
    <div className={className}>
      {useCard ? (
        <div className="rounded-xl border border-[#ff8400]/20 bg-gradient-to-br from-[#fff8f2] via-[#fff1e3] to-[#ffe8cc] p-4 shadow-sm ring-1 ring-[#ff8400]/10 md:p-5">
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
}
