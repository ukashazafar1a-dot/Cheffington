import { getRestaurantReviews } from "@/lib/api-client";
import ChefReviewCard from "@/app/(main)/_components/ChefReviewCard";
import WriteReviewLink from "@/components/WriteReviewLink";
import ChefReviewCountBadge from "@/components/ChefReviewCountBadge";
import type { PublicReview } from "@/types/review";

type Props = {
  restaurantId: string;
  restaurantName: string;
  reviewCount?: number;
};

function reviewAuthor(review: PublicReview) {
  return review.author || review.chef;
}

function reviewAuthorLabel(review: PublicReview) {
  if (review.authorType === "business_owner") return "Business owner";
  if (review.author?.roleLabel) return review.author.roleLabel;
  if (review.authorType === "chef" || review.chef) return "Chef";
  return undefined;
}

export default async function RestaurantReviews({
  restaurantId,
  restaurantName,
  reviewCount = 0,
}: Props) {
  let reviews: Awaited<ReturnType<typeof getRestaurantReviews>>["data"] = [];

  try {
    const reviewsRes = await getRestaurantReviews(restaurantId);
    reviews = reviewsRes.data ?? [];
  } catch {
    // Keep empty state if API unavailable
  }

  return (
    <section className="mt-12 border-t border-black/10 pt-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Reviews</h2>
          {reviews.length === 0 ? (
            <ChefReviewCountBadge count={reviewCount} className="mt-2 text-gray-600" />
          ) : null}
        </div>
        <WriteReviewLink restaurantId={restaurantId} />
      </div>

      {reviews.length > 0 ? (
        <div className="rounded-3xl border-2 border-black bg-white px-5 py-2 md:px-8 md:py-4">
          {reviews.map((review) => {
            const author = reviewAuthor(review);
            const authorType = review.authorType || "chef";
            const chefName = author
              ? `${author.firstName} ${author.lastName}`.trim()
              : authorType === "business_owner"
                ? "Business owner"
                : "Chef";
            return (
              <ChefReviewCard
                key={review._id}
                chefName={chefName}
                chefId={author?.id ? String(author.id) : undefined}
                profilePhotoUrl={author?.profilePhotoUrl}
                restaurantName={restaurantName}
                showRestaurantName={false}
                authorLabel={reviewAuthorLabel(review)}
                affiliations={
                  author?.affiliatedRestaurants?.map(
                    (restaurant) => restaurant.name
                  ) ?? []
                }
                title={review.title?.trim() || undefined}
                comment={review.comment}
                date={review.createdAt}
                media={review.media}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
