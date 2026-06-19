"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function SiteFooterAd() {
  return <AdSlot slot={SITE_AD_SLOTS.FOOTER_BANNER} variant="banner" />;
}
