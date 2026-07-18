"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

type Props = {
  region?: string | null;
};

export function RestaurantPageTopAd({ region = null }: Props) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANT_TOP}
      variant="banner"
      className="mb-8"
      region={region}
      strictRegion
    />
  );
}

export function RestaurantRightRailAd({ region = null }: Props) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANT_RIGHT_RAIL}
      variant="inline"
      className="mb-6"
      region={region}
      strictRegion
    />
  );
}

export function RestaurantReviewsTopAd({ region = null }: Props) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANT_REVIEWS_TOP}
      variant="banner"
      className="mt-10"
      region={region}
      strictRegion
    />
  );
}
