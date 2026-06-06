import { getRestaurantReviews } from "@/lib/api-client";
import ChefReviewCard from "@/app/(main)/_components/ChefReviewCard";
import WriteReviewLink from "@/components/WriteReviewLink";
import ChefReviewCountBadge from "@/components/ChefReviewCountBadge";

type Props = {
  restaurantId: string;
  restaurantName: string;
  reviewCount?: number;
};

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
    <section className="mt-12 border-t border-gray-200 pt-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chef reviews</h2>
          <ChefReviewCountBadge count={reviewCount} className="mt-2 text-gray-600" />
        </div>
        <WriteReviewLink restaurantId={restaurantId} />
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
                profilePhotoUrl={review.chef?.profilePhotoUrl}
                restaurantName={restaurantName}
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
