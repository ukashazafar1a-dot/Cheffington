"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function AboutPageAd() {
  return (
    <AdSlot
      slot={SITE_AD_SLOTS.ABOUT_BANNER}
      variant="banner"
      className="page-width-narrow px-4 py-8"
    />
  );
}
