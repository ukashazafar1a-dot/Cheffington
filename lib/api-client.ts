import type {
  PublicRestaurantListResponse,
  PublicRestaurantResponse,
} from "@/types/restaurant";
import type {
  MyReviewsResponse,
  RestaurantReviewsResponse,
  ReviewSummaryResponse,
  SubmitReviewResponse,
} from "@/types/review";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export type ApplicationType = "chef" | "business_owner";

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
