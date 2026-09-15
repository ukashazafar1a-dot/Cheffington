import Link from "next/link";
import ReviewMediaViewer from "@/components/ReviewMediaViewer";
import { getFeaturedReviews } from "@/lib/api-client";
import { chefAffiliationNames } from "@/types/chef";
import type { PublicReview } from "@/types/review";

export const dynamic = "force-dynamic";

function reviewAuthor(review: PublicReview) {
  return review.author || review.chef;
}

function chefDisplayName(
  author?: { firstName?: string; lastName?: string } | null,
  authorType?: PublicReview["authorType"]
) {
  if (!author) {
    return authorType === "business_owner" ? "Business owner" : "Chef";
  }
  return (
    `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() ||
    (authorType === "business_owner" ? "Business owner" : "Chef")
  );
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
              ? "Could not load reviews. Make sure the backend is running on port 5000, then refresh."
              : "Reviews will appear here once published."}
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
            const author = reviewAuthor(review);
            const authorType = review.authorType || "chef";
            const name = chefDisplayName(author, authorType);
            const quote = review.comment?.trim() || "";
            const restaurantId = review.restaurant?.id;
            const restaurantName = review.restaurant?.name;
            const affiliations = chefAffiliationNames(author);
            const profileId = author?.id ? String(author.id) : undefined;
            const authorLabel =
              authorType === "business_owner" ? "Business owner" : "Chef";

            return (
              <article
                key={review._id}
                className="w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-black bg-white p-3.5 text-left shadow-[3px_3px_0_0_#000] transition-transform duration-200 hover:-translate-y-0.5 sm:w-[320px]"
              >
                <div className="flex items-center gap-3">
                  {profileId ? (
                    <Link
                      href={`/chefs/${profileId}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#FFF1E1]"
                    >
                      {author?.profilePhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={author.profilePhotoUrl}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#FF8400]">
                          {chefInitials(name)}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#FFF1E1]">
                      {author?.profilePhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={author.profilePhotoUrl}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#FF8400]">
                          {chefInitials(name)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold leading-tight text-gray-900">
                      {profileId ? (
                        <Link href={`/chefs/${profileId}`} className="hover:underline">
                          {name}
                        </Link>
                      ) : (
                        name
                      )}
                    </h4>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      {authorLabel}
                    </p>
                    {affiliations.length > 0 ? (
                      <p className="mt-1 text-[11px] font-semibold leading-snug text-[#FF8400]">
                        {affiliations.join(" · ")}
                      </p>
                    ) : null}
                    {restaurantName && restaurantId ? (
                      <Link
                        href={`/restaurants/${restaurantId}`}
                        className="mt-2.5 mb-1.5 block truncate text-[11px] font-bold uppercase tracking-wide text-gray-900 underline underline-offset-2 hover:text-black"
                      >
                        {restaurantName}
                      </Link>
                    ) : null}
                    <p className="line-clamp-2 text-sm leading-snug text-black/75">
                      &ldquo;{quote}&rdquo;
                    </p>
                    {review.media?.length ? (
                      <ReviewMediaViewer
                        media={review.media}
                        maxItems={3}
                        className="mt-2 flex gap-1.5 overflow-hidden"
                        thumbClassName="h-14 w-14 shrink-0 rounded-md"
                      />
                    ) : null}
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
