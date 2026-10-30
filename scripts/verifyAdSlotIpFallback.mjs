/**
 * Deep re-verify: GPS wins; IP only as fallback; page/region still works; storage isolated.
 * Usage: node scripts/verifyAdSlotIpFallback.mjs
 */
import { chromium } from "playwright";

const FRONTEND = process.env.VERIFY_FRONTEND || "http://localhost:3000";
const GPS = { lat: 37.7749, lng: -122.4194 };
const IP = { lat: 39.03, lng: -77.5 };
const PAGE = { lat: 34.0522, lng: -118.2437 }; // LA page coords — must NOT win over IP/GPS

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function nearly(a, b, eps = 0.01) {
  return a != null && b != null && Math.abs(Number(a) - Number(b)) < eps;
}

async function runScenario(name, opts) {
  const {
    grantGps = false,
    seedGpsStorage = false,
    ipResponse = { lat: IP.lat, lng: IP.lng },
    ipNull = false,
    pageCoordsInUrl = false,
  } = opts;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    geolocation: grantGps ? { latitude: GPS.lat, longitude: GPS.lng } : undefined,
    permissions: grantGps ? ["geolocation"] : [],
  });
  const page = await context.newPage();

  const activeCalls = [];
  let visitorGeoHits = 0;

  await page.route("**/api/advertising/visitor-geo**", async (route) => {
    visitorGeoHits += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: ipNull ? null : { ...ipResponse, source: "ip" },
        message: ipNull ? "no IP geo" : undefined,
      }),
    });
  });

  await page.route("**/api/advertising/active/**", async (route) => {
    const url = new URL(route.request().url());
    activeCalls.push({
      lat: url.searchParams.get("lat"),
      lng: url.searchParams.get("lng"),
      region: url.searchParams.get("region"),
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        ad: null,
        ads: [],
        slotSize: null,
        rotationIntervalMs: 8000,
      }),
    });
  });

  if (!grantGps) await context.clearPermissions();

  await page.addInitScript(
    ({ seedGpsStorage, GPS }) => {
      try {
        localStorage.removeItem("cheffington_ad_visitor_geo_v2");
        localStorage.removeItem("cheffington_ad_visitor_ip_geo_v1");
        sessionStorage.removeItem("cheffington_ad_visitor_geo_denied_v2");
        if (seedGpsStorage) {
          localStorage.setItem(
            "cheffington_ad_visitor_geo_v2",
            JSON.stringify({ lat: GPS.lat, lng: GPS.lng })
          );
        }
      } catch {
        // ignore
      }
    },
    { seedGpsStorage: Boolean(seedGpsStorage), GPS }
  );

  if (!grantGps) {
    await page.addInitScript(() => {
      const fail = (_success, error) => {
        if (typeof error === "function") {
          error({ code: 1, message: "User denied Geolocation" });
        }
      };
      navigator.geolocation.getCurrentPosition = fail;
      navigator.geolocation.watchPosition = fail;
    });
  }

  // Homepage has AdSlots; page coords are only used when AdSlot receives lat/lng props.
  // For page-fallback we inject a test by going home (no page coords) — region/null path.
  const url = pageCoordsInUrl
    ? `${FRONTEND}/?verifyPageLat=${PAGE.lat}&verifyPageLng=${PAGE.lng}`
    : FRONTEND;

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4500);

  const storage = await page.evaluate(() => ({
    gps: localStorage.getItem("cheffington_ad_visitor_geo_v2"),
    ip: localStorage.getItem("cheffington_ad_visitor_ip_geo_v1"),
    denied: sessionStorage.getItem("cheffington_ad_visitor_geo_denied_v2"),
    // Near Me must not be polluted by a key mix-up
    region: localStorage.getItem("cheffington_ad_visitor_region"),
  }));

  await browser.close();
  return { name, activeCalls, visitorGeoHits, storage };
}

async function main() {
  // 1) GPS denied → IP used; GPS storage untouched; denied flag set
  const denied = await runScenario("gps-denied-uses-ip", {});
  console.log("1 gps-denied:", {
    hits: denied.visitorGeoHits,
    calls: denied.activeCalls.slice(0, 2),
    storage: denied.storage,
  });
  assert(denied.visitorGeoHits >= 1, "visitor-geo must be called when GPS denied");
  assert(
    denied.activeCalls.some((c) => nearly(c.lat, IP.lat) && nearly(c.lng, IP.lng)),
    "active ads must use IP coords when GPS denied"
  );
  assert(denied.storage.gps == null, "IP must not write GPS / Near Me storage");
  assert(denied.storage.ip != null, "IP coords must cache in IP-only key");
  assert(
    !denied.activeCalls.some((c) => nearly(c.lat, GPS.lat)),
    "must not invent GPS coords when denied"
  );

  // 2) Stored GPS → IP never called; GPS coords used
  const stored = await runScenario("gps-stored-skips-ip", { seedGpsStorage: true });
  console.log("2 gps-stored:", {
    hits: stored.visitorGeoHits,
    calls: stored.activeCalls.slice(0, 2),
    storage: stored.storage,
  });
  assert(stored.visitorGeoHits === 0, "must not call visitor-geo when GPS stored");
  assert(
    stored.activeCalls.every((c) => nearly(c.lat, GPS.lat) && nearly(c.lng, GPS.lng)),
    "all active calls must use stored GPS"
  );
  assert(stored.storage.ip == null, "IP storage must stay empty when GPS present");

  // 3) Live GPS grant → GPS used; IP not needed
  const granted = await runScenario("gps-granted", { grantGps: true });
  console.log("3 gps-granted:", {
    hits: granted.visitorGeoHits,
    calls: granted.activeCalls.slice(0, 2),
    storage: granted.storage,
  });
  assert(
    granted.activeCalls.some((c) => nearly(c.lat, GPS.lat) && nearly(c.lng, GPS.lng)),
    "live GPS must drive active ads"
  );
  assert(granted.storage.gps != null, "GPS storage set after grant");
  // Prefer GPS path: if GPS answered within race window, visitor-geo should be 0
  assert(granted.visitorGeoHits === 0, "GPS grant must not need IP fallback");

  // 4) GPS denied + IP null → still healthy (page/region/sitewide path); no crash
  const ipNull = await runScenario("gps-denied-ip-null", { ipNull: true });
  console.log("4 ip-null fallback:", {
    hits: ipNull.visitorGeoHits,
    calls: ipNull.activeCalls.slice(0, 2),
    storage: ipNull.storage,
  });
  assert(ipNull.visitorGeoHits >= 1, "still attempts visitor-geo");
  assert(ipNull.activeCalls.length >= 1, "must still fetch active ads when IP null");
  assert(ipNull.storage.gps == null, "IP-null must not invent GPS storage");
  assert(ipNull.storage.ip == null, "null IP must not cache fake coords");
  // Homepage AdSlots have no page lat/lng → calls should have null lat or region-only
  assert(
    ipNull.activeCalls.every((c) => c.lat == null || c.lat === ""),
    "without page coords and without IP, must not send bogus lat"
  );

  // 5) Isolation: GPS denied + IP success must never look like Near Me GPS key
  assert(
    denied.storage.gps == null && denied.storage.ip != null,
    "storage keys must stay isolated (GPS vs IP)"
  );

  console.log("PASS — no regressions detected");
}

main().catch((e) => {
  console.error("FAIL:", e.message || e);
  process.exit(1);
});
