"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./_components/HeroSection";
import ChefReviewForRestaurants from "./_components/ChefReviewForRestaurants";
import Adertising from "./_components/Adertising";
import ChefWebsiteButton from "./_components/ChefWebsiteButton";
import type { ChefProfile } from "@/types/chef";
import type { MyReview } from "@/types/review";
import { getChefMe, getMyReviews } from "@/lib/api-client";

export default function IndividualChefPage() {
  const router = useRouter();
  const [chef, setChef] = useState<ChefProfile | undefined>(undefined);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = window.localStorage.getItem("chefToken");
      if (!token) {
        router.push("/sign-in?returnUrl=/individual-chef-page");
        return;
      }

      try {
        const [chefData, reviewsRes] = await Promise.all([
          getChefMe(token),
          getMyReviews(token),
        ]);
        setChef(chefData);
        setReviews(reviewsRes.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load chef profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="page-width py-16 text-center text-lg text-gray-700">
        Loading chef profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-width py-16 text-center text-lg text-red-600">
        {error}
      </div>
    );
  }

  const handlePhotoUpdated = (displayUrl: string) => {
    setChef((prev) => {
      const next = prev ? { ...prev, profilePhotoUrl: displayUrl } : prev;
      if (next && typeof window !== "undefined") {
        const name =
          `${next.firstName ?? ""} ${next.lastName ?? ""}`.trim() || "Chef";
        window.dispatchEvent(
          new CustomEvent("chef-profile-updated", {
            detail: { name, profilePhotoUrl: displayUrl },
          })
        );
      }
      return next;
    });
  };

  return (
    <div>
      <HeroSection
        chef={chef}
        reviewCount={reviews.length}
        onPhotoUpdated={handlePhotoUpdated}
      />

      <div className="relative z-0 -mt-8 flex flex-col page-width">
        <ChefWebsiteButton website={chef?.website} />

        <div className="mb-18 flex items-start gap-6 max-xl:flex-wrap max-xl:pb-5">
          <ChefReviewForRestaurants chef={chef} reviews={reviews} />
          <Adertising />
        </div>
      </div>
    </div>
  );
}
