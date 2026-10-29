/**
 * Mobile viewport check for AdSlot banners (mocks an active header ad).
 * Usage: node scripts/verify-mobile-ads.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.SITE_URL || "http://localhost:3000";
const API = process.env.API_URL || "http://localhost:5000/api";

const MOCK_AD = {
  success: true,
  data: {
    _id: "mock-ad-1",
    businessName: "Mobile Verify Co",
    imageUrl:
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="728" height="90">
          <rect width="100%" height="100%" fill="#FF8400"/>
          <text x="50%" y="55%" text-anchor="middle" fill="#000" font-size="28" font-family="Arial">MOBILE AD TEST</text>
        </svg>`
      ),
    linkUrl: "https://example.com",
    targetRegionKey: "sitewide",
  },
  ads: [
    {
      _id: "mock-ad-1",
      businessName: "Mobile Verify Co",
      imageUrl:
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="728" height="90">
            <rect width="100%" height="100%" fill="#FF8400"/>
            <text x="50%" y="55%" text-anchor="middle" fill="#000" font-size="28" font-family="Arial">MOBILE AD TEST</text>
          </svg>`
        ),
      linkUrl: "https://example.com",
      targetRegionKey: "sitewide",
    },
  ],
  slotSize: { width: 728, height: 90, sizeLabel: "728×90" },
  rotationIntervalMs: 25000,
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.route(`**/advertising/active/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AD),
    });
  });

  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("text=Advertisement · Sponsored", {
    timeout: 8000,
  });
  const firstPaintMs = Date.now() - t0;

  const home = await page.evaluate(() => {
    const labels = [...document.querySelectorAll("p")].filter((p) =>
      /Advertisement\s*·\s*Sponsored/i.test(p.textContent || "")
    );
    const frames = labels
      .map((p) => p.nextElementSibling)
      .filter(Boolean)
      .map((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          aspectRatio: style.aspectRatio,
          maxWidth: style.maxWidth,
          hasImg: Boolean(el.querySelector("img")),
          imgNatural: (() => {
            const img = el.querySelector("img");
            return img
              ? { w: img.naturalWidth, h: img.naturalHeight }
              : null;
          })(),
        };
      });
    return {
      labelCount: labels.length,
      frames,
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
  });

  // Expected for 728x90 banner in ~390px viewport with ~16px padding each side:
  // width ≈ 358–390, height ≈ width * (90/728) ≈ 44–48 (NOT fixed 90 with tiny image)
  const banner = home.frames[0];
  const aspectOk =
    banner &&
    banner.width >= 300 &&
    banner.height >= 35 &&
    banner.height <= 70 &&
    /728\s*\/\s*90|8\.088/.test(String(banner.aspectRatio));
  const notFixed90Empty =
    banner && !(banner.height === 90 && banner.width < 400);

  // Chef page order check with mock sidebar too
  let chef = null;
  const chefHref = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/chefs/"]');
    return a ? a.getAttribute("href") : null;
  });
  if (chefHref) {
    await page.goto(new URL(chefHref, BASE).toString(), {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForSelector("text=Advertisement · Sponsored", {
      timeout: 8000,
    });
    chef = await page.evaluate(() => {
      const label = [...document.querySelectorAll("p")].find((p) =>
        /Advertisement\s*·\s*Sponsored/i.test(p.textContent || "")
      );
      const aside = label?.closest("aside");
      const about = [...document.querySelectorAll("h2")].find((h) =>
        /About/i.test(h.textContent || "")
      );
      const adTop = aside
        ? aside.getBoundingClientRect().top + window.scrollY
        : label
          ? label.getBoundingClientRect().top + window.scrollY
          : null;
      const aboutTop = about
        ? about.getBoundingClientRect().top + window.scrollY
        : null;
      return {
        adBeforeAbout:
          adTop != null && aboutTop != null ? adTop < aboutTop : null,
        adTop: adTop != null ? Math.round(adTop) : null,
        aboutTop: aboutTop != null ? Math.round(aboutTop) : null,
      };
    });
  }

  await browser.close();

  const report = {
    api: API,
    firstPaintMs,
    pass: Boolean(aspectOk && notFixed90Empty && home.labelCount > 0),
    home,
    bannerChecks: {
      aspectOk,
      notFixed90Empty,
      expected:
        "mobile banner width~full, height≈width*(90/728) via aspect-ratio (not fixed 90px empty box)",
    },
    chef,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
