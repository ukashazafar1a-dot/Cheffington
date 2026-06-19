"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function RestaurantsListAd() {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANTS_LIST}
      variant="inline"
      className="my-2"
    />
  );
}
