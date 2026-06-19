"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function SiteHeaderAd() {
  return <AdSlot slot={SITE_AD_SLOTS.HEADER_BANNER} variant="banner" />;
}
