"use client";

import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

export default function SiteFooterAd() {
  return (
    <div className="w-full px-4 py-3 sm:px-6">
      <AdSlot slot={SITE_AD_SLOTS.FOOTER_BANNER} variant="banner" />
    </div>
  );
}
