import type {
  PublicRestaurantListResponse,
  PublicRestaurantResponse,
} from "@/types/restaurant";

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
