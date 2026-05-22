import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-width py-20 text-center">
      <h1 className="text-2xl font-bold">Restaurant not found</h1>
      <p className="text-gray-600 mt-2">It may be unpublished or removed.</p>
      <Link
        href="/restaurants"
        className="inline-block mt-6 text-[#ff8400] font-semibold underline"
      >
        Back to restaurants
      </Link>
    </main>
  );
}
