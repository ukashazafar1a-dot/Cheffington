import ChefReviewCard from "../../_components/ChefReviewCard";
import ChefButton from "./ChefButtons";
import { formatChefFullName, type ChefProfile } from "@/types/chef";
import type { MyReview } from "@/types/review";

type Props = {
  chef?: ChefProfile;
  reviews: MyReview[];
};

const ChefReviewForRestaurants = ({ chef, reviews }: Props) => {
  const chefName = formatChefFullName(chef) || "Chef";
  const latestRestaurantId = reviews[0]?.restaurant?.id;

  return (
    <div className="xl:w-[68%] w-full max-w-full">
      <h1 className="subtitle ">Chef Notes</h1>
      <ChefButton website={chef?.website} latestRestaurantId={latestRestaurantId} />

      {reviews.length === 0 ? (
        <p className="rounded-3xl border-2 border-black p-6 text-gray-700">
          You have not written any restaurant reviews yet. Use{" "}
          <strong>Add review</strong> to share your first chef note.
        </p>
      ) : (
        <div className="border-2 border-black rounded-3xl p-4 md:p-8 space-y-8">
          {reviews.map((review) => (
            <ChefReviewCard
              key={review._id}
              chefName={chefName}
              profilePhotoUrl={chef?.profilePhotoUrl}
              restaurantName={review.restaurant?.name ?? "Restaurant"}
              rating={review.rating}
              title={review.title?.trim() || undefined}
              comment={review.comment}
              date={review.updatedAt ?? review.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefReviewForRestaurants;
