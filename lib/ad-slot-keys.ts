/**
 * Every ad slot wired on the consumer site.
 * Admin pricing table slot keys must match these values.
 */
export const SITE_AD_SLOTS = {
  /** All pages — directly below the main navigation */
  HEADER_BANNER: "header_banner",
  /** All pages — above the site footer */
  FOOTER_BANNER: "footer_banner",
  /** Homepage — below hero */
  HOMEPAGE_FEATURED: "homepage_featured",
  /** Restaurant detail — left sidebar */
  RESTAURANT_SIDEBAR: "restaurant_sidebar",
  /** Chef profile — sidebar */
  CHEF_SIDEBAR: "chef_sidebar",
  /** Restaurants directory — below search, above results */
  RESTAURANTS_TOP: "restaurants_top",
  /** Restaurants directory — between list cards */
  RESTAURANTS_LIST: "restaurants_list",
  /** About page — between hero and search */
  ABOUT_BANNER: "about_banner",
} as const;

export type SiteAdSlotKey =
  (typeof SITE_AD_SLOTS)[keyof typeof SITE_AD_SLOTS];

export const SITE_AD_SLOT_GUIDE: {
  key: SiteAdSlotKey;
  label: string;
  where: string;
}[] = [
  {
    key: SITE_AD_SLOTS.HEADER_BANNER,
    label: "Header banner",
    where: "Every page, below the menu bar",
  },
  {
    key: SITE_AD_SLOTS.FOOTER_BANNER,
    label: "Footer banner",
    where: "Every page, above the footer",
  },
  {
    key: SITE_AD_SLOTS.HOMEPAGE_FEATURED,
    label: "Homepage featured",
    where: "Homepage, below the hero",
  },
  {
    key: SITE_AD_SLOTS.RESTAURANT_SIDEBAR,
    label: "Restaurant sidebar",
    where: "Restaurant detail page, left column",
  },
  {
    key: SITE_AD_SLOTS.CHEF_SIDEBAR,
    label: "Chef sidebar",
    where: "Chef profile page, sidebar",
  },
  {
    key: SITE_AD_SLOTS.RESTAURANTS_TOP,
    label: "Restaurants top",
    where: "Restaurants page, below search filters",
  },
  {
    key: SITE_AD_SLOTS.RESTAURANTS_LIST,
    label: "Restaurants list inline",
    where: "Restaurants page, between listing cards",
  },
  {
    key: SITE_AD_SLOTS.ABOUT_BANNER,
    label: "About page banner",
    where: "About page, mid-page",
  },
];
