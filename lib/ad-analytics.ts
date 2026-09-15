const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const IMPRESSION_DEDUPE_MS = 30_000;

export type AdAnalyticsEventType = "impression" | "click";

export type TrackAdEventInput = {
  type: AdAnalyticsEventType;
  campaignId: string;
  placementKey: string;
  targetRegionKey?: string | null;
};

function impressionStorageKey(campaignId: string, placementKey: string) {
  return `adimp:${campaignId}:${placementKey}`;
}

function shouldSkipImpression(campaignId: string, placementKey: string) {
  if (typeof window === "undefined") return true;
  try {
    const key = impressionStorageKey(campaignId, placementKey);
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return false;
    const last = Number(raw);
    if (!Number.isFinite(last)) return false;
    return Date.now() - last < IMPRESSION_DEDUPE_MS;
  } catch {
    return false;
  }
}

function markImpression(campaignId: string, placementKey: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      impressionStorageKey(campaignId, placementKey),
      String(Date.now())
    );
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Fire-and-forget ad analytics. Never throws — ads must keep working.
 */
export function trackAdEvent(input: TrackAdEventInput): void {
  try {
    const type = input.type;
    const campaignId = String(input.campaignId || "").trim();
    const placementKey = String(input.placementKey || "").trim();
    const targetRegionKey =
      String(input.targetRegionKey || "").trim() || "sitewide";

    if (!campaignId || !placementKey) return;
    if (type !== "impression" && type !== "click") return;

    if (type === "impression") {
      if (shouldSkipImpression(campaignId, placementKey)) return;
      markImpression(campaignId, placementKey);
    }

    const body = JSON.stringify({
      type,
      campaignId,
      placementKey,
      targetRegionKey,
    });

    void fetch(`${API_BASE_URL}/advertising/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // swallow
    });
  } catch {
    // swallow
  }
}
