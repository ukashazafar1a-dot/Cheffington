export type ChefProfile = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  currentRestaurant?: string;
  jobTitle?: string;
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
  if (chef.website?.trim() && !parts.includes(chef.website.trim())) {
    parts.push(chef.website.trim());
  }
  return parts.join(" / ");
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