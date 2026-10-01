"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

type Props = {
  region?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export function RestaurantPageTopAd({
  region = null,
  lat = null,
  lng = null,
}: Props) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANT_TOP}
      variant="banner"
      className="mb-8"
      region={region}
      lat={lat}
      lng={lng}
      strictRegion
    />
  );
}

export function RestaurantRightRailAd(_props: Props) {
  // Temporarily disabled — placement restaurant_right_rail is hidden sitewide.
  return null;
}

export function RestaurantReviewsTopAd({
  region = null,
  lat = null,
  lng = null,
}: Props) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANT_REVIEWS_TOP}
      variant="banner"
      className="mt-10"
      region={region}
      lat={lat}
      lng={lng}
      strictRegion
    />
  );
}
