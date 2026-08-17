export type ChefProfile = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  currentRestaurant?: string;
  currentRestaurantUrl?: string;
  jobTitle?: string;
  bio?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  spotifyUrl?: string;
  affiliatedRestaurantIds?: string[];
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  website?: string;
  professionalEmail?: string;
  status?: string;
  applicationType?: "chef" | "business_owner" | "public";
  profilePhotoUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  geocodePrecision?: "exact" | "city" | "region" | "none";
};

export function formatAccountRoleLabel(
  applicationType?: string | null
): string {
  if (applicationType === "business_owner") return "Business Owner";
  if (applicationType === "public") return "Member";
  return "Chef";
}

export function formatChefFullName(chef?: ChefProfile): string {
  if (!chef) return "";
  return `${chef.firstName ?? ""} ${chef.lastName ?? ""}`.trim();
}

export function formatChefSubtitle(chef?: ChefProfile): string {
  if (!chef) return "";
  const parts: string[] = [];
  if (chef.jobTitle?.trim()) parts.push(chef.jobTitle.trim());
  if (chef.currentRestaurant?.trim()) parts.push(chef.currentRestaurant.trim());
  return parts.join(" / ");
}

export function displayWebsiteLabel(website?: string): string {
  const trimmed = String(website || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function affiliatedNamesFromIds(
  ids: Array<string | undefined> | undefined,
  restaurants: Array<{ _id: string; name?: string }>
): string[] {
  const byId = new Map(
    restaurants.map((restaurant) => [
      String(restaurant._id),
      restaurant.name?.trim() || "",
    ])
  );
  return (ids ?? [])
    .map((id) => byId.get(String(id)) || "")
    .filter(Boolean);
}

export function chefAffiliationNames(chef?: {
  affiliatedRestaurants?: Array<{ name?: string }>;
}): string[] {
  return (chef?.affiliatedRestaurants ?? [])
    .map((restaurant) => restaurant.name?.trim() || "")
    .filter(Boolean);
}

export function toExternalHref(url?: string): string | undefined {
  const trimmed = String(url || "").trim();
  if (!trimmed) return undefined;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function formatChefAddress(chef?: ChefProfile): string | undefined {
  if (!chef?.addressLine1?.trim()) return undefined;
  const cityStateZip = [chef.city, chef.state, chef.zipCode]
    .filter(Boolean)
    .join(", ")
    .replace(/,\s*,/g, ",");
  return [
    chef.addressLine1,
    chef.addressLine2,
    cityStateZip,
    chef.country,
  ]
    .filter((p) => p && String(p).trim())
    .join(", ");
}