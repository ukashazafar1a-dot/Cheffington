import Link from "next/link";
import {
  getRestaurantReviewSummary,
  getRestaurantReviews,
} from "@/lib/api-client";
import ChefReviewCard from "@/app/(main)/_components/ChefReviewCard";
import StarRating from "@/components/StarRating";

type Props = {
  restaurantId: string;
  restaurantName: string;
};

export default async function RestaurantReviews({
  restaurantId,
  restaurantName,
}: Props) {
  let summary = { averageRating: 0, reviewCount: 0 };
  let reviews: Awaited<ReturnType<typeof getRestaurantReviews>>["data"] = [];

  try {
    const [summaryRes, reviewsRes] = await Promise.all([
      getRestaurantReviewSummary(restaurantId),
      getRestaurantReviews(restaurantId),
    ]);
    summary = summaryRes.data;
    reviews = reviewsRes.data ?? [];
  } catch {
    // Keep empty state if API unavailable
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chef reviews</h2>
          {summary.reviewCount > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StarRating value={Math.round(summary.averageRating)} readOnly size="sm" />
              <span className="text-sm text-gray-600">
                {summary.averageRating.toFixed(1)} · {summary.reviewCount}{" "}
                {summary.reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No reviews yet.</p>
          )}
        </div>
        <Link
          href={`/review-1?restaurantId=${restaurantId}`}
          className="button button--primary inline-flex w-fit px-6 py-3 text-sm"
        >
          Write a review
        </Link>
      </div>

      {reviews.length > 0 ? (
        <div className="rounded-3xl border-2 border-black p-4 md:p-8">
          {reviews.map((review) => {
            const chefName = review.chef
              ? `${review.chef.firstName} ${review.chef.lastName}`.trim()
              : "Chef";
            return (
              <ChefReviewCard
                key={review._id}
                chefName={chefName}
                restaurantName={restaurantName}
                rating={review.rating}
                title={review.title?.trim() || undefined}
                comment={review.comment}
                date={review.createdAt}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
