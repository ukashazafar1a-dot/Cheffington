import Link from "next/link";
import { getFeaturedReviews } from "@/lib/api-client";

export const dynamic = "force-dynamic";

function chefDisplayName(chef?: {
  firstName?: string;
  lastName?: string;
}) {
  if (!chef) return "Chef";
  return `${chef.firstName ?? ""} ${chef.lastName ?? ""}`.trim() || "Chef";
}

function chefInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ChefRecommends() {
  let reviews: Awaited<ReturnType<typeof getFeaturedReviews>>["data"] = [];
  let loadFailed = false;

  try {
    const res = await getFeaturedReviews(4);
    reviews = res.data ?? [];
  } catch {
    loadFailed = true;
    reviews = [];
  }

  if (reviews.length === 0) {
    return (
      <section className="lg:my-32 my-24 max-sm:my-18">
        <div className="page-width">
          <h2 className="title text-center">Chef Recommends</h2>
          <p className="subtitle md:mb-12 mb-8 text-center">
            No bad reviews. Only great food.
          </p>
          <p className="text-center text-lg text-gray-700">
            {loadFailed
              ? "Could not load chef reviews. Make sure the backend is running on port 5000, then refresh."
              : "Chef reviews will appear here once published."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:my-32 my-24 max-sm:my-18">
      <div className="page-width">
        <h2 className="title text-center">Chef Recommends</h2>
        <p className="subtitle md:mb-12 mb-8 text-center">
          No bad reviews. Only great food.
        </p>
        <div className="flex flex-wrap justify-start gap-4">
          {reviews.map((review) => {
            const name = chefDisplayName(review.chef);
            const quote = review.comment?.trim() || "";
            const restaurantId = review.restaurant?.id;
            const restaurantName = review.restaurant?.name;

            return (
              <article
                key={review._id}
                className="w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-black bg-white p-3.5 text-left shadow-[3px_3px_0_0_#000] transition-transform duration-200 hover:-translate-y-0.5 sm:w-[320px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#FFF1E1]">
                    {review.chef?.profilePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.chef.profilePhotoUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#FF8400]">
                        {chefInitials(name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold leading-tight">
                      {name}
                    </h4>
                    {restaurantName && restaurantId ? (
                      <Link
                        href={`/restaurants/${restaurantId}`}
                        className="mb-1 block truncate text-[11px] font-bold uppercase tracking-wide text-[#FF8400] underline-offset-2 hover:underline"
                      >
                        {restaurantName}
                      </Link>
                    ) : null}
                    <p className="line-clamp-2 text-sm leading-snug text-black/75">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
