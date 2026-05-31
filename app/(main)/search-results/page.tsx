import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const FORWARDED_PARAMS = [
  "name",
  "cuisine",
  "location",
  "chef",
  "near",
  "nearLat",
  "nearLng",
  "sort",
] as const;

/** Legacy route — forwards to /restaurants with the same filters. */
export default async function SearchResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const key of FORWARDED_PARAMS) {
    const value = params[key];
    if (typeof value === "string" && value.length > 0) {
      qs.set(key, value);
    }
  }

  const query = qs.toString();
  redirect(query ? `/restaurants?${query}` : "/restaurants");
}
