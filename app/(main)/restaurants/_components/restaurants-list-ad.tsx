"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

/**
 * Between-cards ad on the restaurants directory.
 * Sized to match restaurant list cards (full width, card height) on desktop + mobile.
 */
export default function RestaurantsListAd({
  region = null,
}: {
  region?: string | null;
}) {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.RESTAURANTS_LIST}
      variant="inline"
      showCard={false}
      forceFillWidth
      className="my-2"
      region={region}
      frameClassName="w-full min-h-[280px] rounded-2xl border border-gray-200/80 shadow-sm md:min-h-[280px] md:h-[280px]"
    />
  );
}
