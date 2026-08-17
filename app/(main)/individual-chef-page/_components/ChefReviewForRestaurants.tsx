"use client";

import { useEffect, useState } from "react";
import ChefReviewCard from "../../_components/ChefReviewCard";
import ChefAffiliatedRestaurants from "./ChefAffiliatedRestaurants";
import ChefButton from "./ChefButtons";
import { getPublishedRestaurants } from "@/lib/api-client";
import {
  affiliatedNamesFromIds,
  formatChefFullName,
  type ChefProfile,
} from "@/types/chef";
import type { PublicRestaurant } from "@/types/restaurant";
import type { MyReview } from "@/types/review";

type Props = {
  chef?: ChefProfile;
  reviews: MyReview[];
};

const ChefReviewForRestaurants = ({ chef, reviews }: Props) => {
  const chefName = formatChefFullName(chef) || "Chef";
  const [restaurants, setRestaurants] = useState<PublicRestaurant[]>([]);
  const affiliatedNames = affiliatedNamesFromIds(
    chef?.affiliatedRestaurantIds,
    restaurants
  );

  useEffect(() => {
    const ids = chef?.affiliatedRestaurantIds ?? [];
    if (ids.length === 0) {
      setRestaurants([]);
      return;
    }

    let cancelled = false;
    getPublishedRestaurants()
      .then((res) => {
        if (!cancelled) setRestaurants(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setRestaurants([]);
      });
    return () => {
      cancelled = true;
    };
  }, [chef?.affiliatedRestaurantIds]);

  return (
    <div className="xl:w-[68%] w-full max-w-full">
      <h1 className="subtitle">About</h1>
      <ChefButton chef={chef} website={chef?.website} />

      <div className="mb-10 rounded-3xl border-2 border-black p-6">
        {chef?.bio?.trim() ? (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 md:text-lg">
            {chef.bio}
          </p>
        ) : (
          <p className="text-gray-600">
            Add an about section in Edit profile — who you are, where you work,
            and your background.
          </p>
        )}
      </div>

      <ChefAffiliatedRestaurants chef={chef} restaurants={restaurants} />

      <h2 className="subtitle mb-4">Reviews</h2>
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
              chefId={chef?._id}
              profilePhotoUrl={chef?.profilePhotoUrl}
              restaurantName={review.restaurant?.name ?? "Restaurant"}
              affiliations={affiliatedNames}
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
