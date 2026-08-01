export interface AdPricingColumn {
  id: string;
  label: string;
  order: number;
}

export interface AdPricingRow {
  id: string;
  slotKey: string;
  cells: Record<string, string>;
  pricePerDay: number;
  isActive: boolean;
  order: number;
}

export interface AdPricingTable {
  configId: string;
  columns: AdPricingColumn[];
  rows: AdPricingRow[];
  updatedAt?: string;
}

export interface AdPlacement {
  key: string;
  name: string;
  priceLabel: string;
  pricePerDay: number;
  sizeLabel?: string;
  width?: number | null;
  height?: number | null;
  cells?: Record<string, string>;
}

/** Q5 — monthly chef subscription plan (Option B: Stripe Price ID required) */
export interface ChefSubscriptionPlan {
  id: string;
  placementKey: string;
  label: string;
  placementName: string;
  monthlyPrice: number | null;
  stripePriceId: string;
  currency: string;
}

export interface AdPricingPayload {
  columns: AdPricingColumn[];
  rows: AdPricingRow[];
  placements: AdPlacement[];
  updatedAt?: string;
}

export interface AdRequestPayload {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  placementKey: string;
  days: number;
  targetRegionKey: string;
  adImageUrl?: string;
  needsDesign?: boolean;
  message?: string;
}

export interface AdTargetRegion {
  key: string;
  label: string;
}

export interface AdCheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  adRequestId: string;
}

export interface AdCheckoutStatusResponse {
  paid: boolean;
  paymentStatus: string;
  businessName: string;
  placementKey: string;
  reviewStatus: string;
}

export interface AdSlotSize {
  width: number;
  height: number;
  sizeLabel?: string;
}

export interface ActiveAdCampaign {
  _id: string;
  placementKey: string;
  businessName: string;
  imageUrl?: string | null;
  linkUrl: string;
  startDate: string;
  endDate: string;
  status: "scheduled" | "active" | "expired" | "cancelled";
  targetRegionKey?: string;
  targetRegionLabel?: string | null;
}

export interface ActiveAdSlotResponse {
  ad: ActiveAdCampaign | null;
  slotSize: AdSlotSize | null;
}

export const MIN_AD_DAYS = 1;
export const MAX_AD_DAYS = 365;
