import type {
  PublicRestaurantListResponse,
  PublicRestaurantResponse,
} from "@/types/restaurant";
import type { ChefProfile } from "@/types/chef";
import type {
  FeaturedReviewsResponse,
  MyReviewsResponse,
  RestaurantReviewsResponse,
  ReviewSummaryResponse,
  SubmitReviewResponse,
} from "@/types/review";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export type ApplicationType = "chef" | "business_owner";

export const APPLICATION_DOC_ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const APPLICATION_DOC_MAX_BYTES = 10 * 1024 * 1024;

export const APPLICATION_DOC_MAX_FILES = 10;

export async function uploadApplicationDocument(
  file: File,
  firstName: string,
  lastName: string,
  applicationType: ApplicationType
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("applicationType", applicationType);

  const res = await fetch(`${API_BASE_URL}/chef-applications/upload-document`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as {
    success: boolean;
    data?: { publicUrl: string; displayUrl?: string };
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || "Failed to upload document");
  }

  return data.data!;
}

export async function uploadApplicationDocuments(
  files: File[],
  firstName: string,
  lastName: string,
  applicationType: ApplicationType
) {
  const results = await Promise.all(
    files.map((file) =>
      uploadApplicationDocument(file, firstName, lastName, applicationType)
    )
  );
  return results.map((r) => r.publicUrl);
}

export async function submitApplication(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/chef-applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.errors?.join?.(", ") || "Request failed");
  }
  return data;
}

export async function getPublishedRestaurants() {
  const res = await fetch(`${API_BASE_URL}/restaurants`, {
    cache: "no-store",
  });
  const data = (await res.json()) as PublicRestaurantListResponse & {
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load restaurants");
  }
  return data;
}

export async function getPublishedRestaurant(id: string) {
  const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as PublicRestaurantResponse & {
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Restaurant not found");
  }
  return data;
}

export async function getRestaurantReviews(restaurantId: string, page = 1) {
  const res = await fetch(
    `${API_BASE_URL}/restaurants/${restaurantId}/reviews?page=${page}&limit=20`,
    { cache: "no-store" }
  );
  const data = (await res.json()) as RestaurantReviewsResponse & {
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load reviews");
  }
  return data;
}

export async function getFeaturedReviews(limit = 4) {
  const res = await fetch(
    `${API_BASE_URL}/restaurants/reviews/featured?limit=${limit}`,
    { cache: "no-store" }
  );
  const data = (await res.json()) as FeaturedReviewsResponse & {
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load featured reviews");
  }
  return data;
}

export async function getRestaurantReviewSummary(restaurantId: string) {
  const res = await fetch(
    `${API_BASE_URL}/restaurants/${restaurantId}/reviews/summary`,
    { cache: "no-store" }
  );
  const data = (await res.json()) as ReviewSummaryResponse & {
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load review summary");
  }
  return data;
}

export async function submitReview(
  body: {
    restaurantId: string;
    rating: number;
    comment: string;
    title?: string;
  },
  chefToken: string
) {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${chefToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as SubmitReviewResponse & {
    message?: string;
    errors?: string[];
  };
  if (!res.ok) {
    throw new Error(
      data.errors?.join?.(", ") || data.message || "Failed to submit review"
    );
  }
  return data;
}

export async function getMyReviews(chefToken: string) {
  const res = await fetch(`${API_BASE_URL}/reviews/me`, {
    headers: { Authorization: `Bearer ${chefToken}` },
    cache: "no-store",
  });
  const data = (await res.json()) as MyReviewsResponse & { message?: string };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your reviews");
  }
  return data;
}

export async function uploadChefProfilePhoto(chefToken: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/chef/uploads/profile-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${chefToken}` },
    body: formData,
  });

  const data = (await res.json()) as {
    success: boolean;
    data?: { profilePhotoUrl: string; storedUrl?: string };
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || "Failed to upload profile photo");
  }

  return data;
}

export async function getChefMe(chefToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/chef-me`, {
    headers: { Authorization: `Bearer ${chefToken}` },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    success: boolean;
    chef?: ChefProfile;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Failed to load chef profile");
  }
  return data.chef;
}

export type RestaurantClaimPayload = {
  restaurantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  relationshipToBusiness:
    | "owner"
    | "manager"
    | "authorized_representative"
    | "other";
  jobTitle?: string;
  proofSummary: string;
  proofDocumentUrls?: string[];
};

export const CLAIM_ATTACHMENT_ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const CLAIM_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export async function uploadRestaurantClaimAttachment(
  file: File,
  claimantName: string,
  restaurantId: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("claimantName", claimantName);
  formData.append("restaurantId", restaurantId);

  const res = await fetch(`${API_BASE_URL}/restaurant-claims/upload-attachment`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as {
    success: boolean;
    data?: { publicUrl: string; displayUrl?: string; key?: string };
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || "Failed to upload attachment");
  }

  return data.data!;
}

export async function submitRestaurantClaim(body: RestaurantClaimPayload) {
  const res = await fetch(`${API_BASE_URL}/restaurant-claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as {
    success: boolean;
    message?: string;
    data?: { _id: string };
  };

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit claim");
  }

  return data;
}
