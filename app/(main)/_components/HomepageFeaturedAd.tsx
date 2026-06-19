"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function HomepageFeaturedAd() {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.HOMEPAGE_FEATURED}
      variant="banner"
      className="page-width my-16 max-sm:my-12"
    />
  );
}
