"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function RestaurantsTopAd({
  region = null,
}: {
  region?: string | null;
}) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANTS_TOP}
      variant="banner"
      className="mb-8"
      region={region}
    />
  );
}
