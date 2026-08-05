"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./_components/HeroSection";
import ChefReviewForRestaurants from "./_components/ChefReviewForRestaurants";
import Adertising from "./_components/Adertising";
import ChefWebsiteButton from "./_components/ChefWebsiteButton";
import type { ChefProfile } from "@/types/chef";
import { formatAccountRoleLabel } from "@/types/chef";
import type { MyReview } from "@/types/review";
import { getChefMe, getMyReviews } from "@/lib/api-client";

const OWNER_APP_URL =
  process.env.NEXT_PUBLIC_OWNER_APP_URL ?? "http://localhost:3002";

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
        const chefData = await getChefMe(token);
        setChef(chefData);
        if (chefData?.applicationType) {
          window.localStorage.setItem(
            "chefApplicationType",
            chefData.applicationType
          );
        }

        // Reviews are chef-only; business owners still get their profile page.
        if (chefData?.applicationType !== "business_owner") {
          try {
            const reviewsRes = await getMyReviews(token);
            setReviews(reviewsRes.data ?? []);
          } catch {
            setReviews([]);
          }
        } else {
          setReviews([]);
        }
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
        Loading profile...
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
            detail: {
              name,
              profilePhotoUrl: displayUrl,
              roleLabel: formatAccountRoleLabel(next.applicationType),
              applicationType: next.applicationType,
            },
          })
        );
      }
      return next;
    });
  };

  const isBusinessOwner = chef?.applicationType === "business_owner";
  const roleLabel = formatAccountRoleLabel(chef?.applicationType);

  return (
    <div>
      <HeroSection
        chef={chef}
        reviewCount={reviews.length}
        onPhotoUpdated={handlePhotoUpdated}
        roleLabel={roleLabel}
      />

      <div className="relative z-0 -mt-8 flex flex-col page-width">
        <ChefWebsiteButton website={chef?.website} />

        {isBusinessOwner ? (
          <div className="mb-18 rounded-xl border border-black/10 bg-white px-6 py-8">
            <p className="text-lg font-semibold text-black">
              You&apos;re signed in as a Business Owner
            </p>
            <p className="mt-2 text-gray-600">
              Manage restaurants from the business owner dashboard. You can still
              advertise on Cheffington and claim restaurants from this website.
            </p>
            <a
              href={`${OWNER_APP_URL.replace(/\/$/, "")}/login`}
              className="mt-4 inline-block font-semibold text-[#FF8400] underline"
            >
              Open business owner dashboard
            </a>
          </div>
        ) : (
          <div className="mb-18 flex items-start gap-6 max-xl:flex-wrap max-xl:pb-5">
            <ChefReviewForRestaurants chef={chef} reviews={reviews} />
            <Adertising />
          </div>
        )}
      </div>
    </div>
  );
}
