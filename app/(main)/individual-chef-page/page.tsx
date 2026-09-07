"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./_components/HeroSection";
import ChefReviewForRestaurants from "./_components/ChefReviewForRestaurants";
import Adertising from "./_components/Adertising";
import EditChefProfileForm from "./_components/EditChefProfileForm";
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
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const chefToken = window.localStorage.getItem("chefToken");
      if (!chefToken) {
        router.push("/sign-in?returnUrl=/individual-chef-page");
        return;
      }
      setToken(chefToken);

      try {
        const chefData = await getChefMe(chefToken);
        setChef(chefData);
        if (chefData?.applicationType) {
          window.localStorage.setItem(
            "chefApplicationType",
            chefData.applicationType
          );
        }

        try {
          const reviewsRes = await getMyReviews(chefToken);
          setReviews(reviewsRes.data ?? []);
        } catch {
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

      <div className="relative z-0 flex flex-col page-width pt-6 md:pt-8">
        {isBusinessOwner ? (
          <div className="mb-6 flex items-start gap-6 max-xl:flex-wrap">
            <div className="w-full rounded-xl border border-black/10 bg-white px-6 py-8 xl:w-[68%]">
              <p className="text-lg font-semibold text-black">
                You&apos;re signed in as a Business Owner
              </p>
              <p className="mt-2 text-gray-600">
                Manage restaurants from the business owner dashboard. On this site
                you can leave reviews, advertise, claim restaurants, and edit your
                public profile (including About).
              </p>
              <a
                href={`${OWNER_APP_URL.replace(/\/$/, "")}/login`}
                className="mt-4 inline-block font-semibold text-[#FF8400] underline"
              >
                Open business owner dashboard
              </a>
            </div>
            {/* Reserve space under the hanging address card */}
            <div className="hidden xl:block xl:w-[300px] xl:shrink-0" aria-hidden="true" />
          </div>
        ) : null}

        {token && chef ? (
          <div className="mb-4 flex items-start gap-6 max-xl:flex-wrap">
            <div className="w-full xl:w-[68%]">
              <EditChefProfileForm
                chef={chef}
                token={token}
                onSaved={(updated) => setChef(updated)}
              />
            </div>
            {/* Reserve space under the hanging address card */}
            <div className="hidden xl:block xl:w-[300px] xl:shrink-0" aria-hidden="true" />
          </div>
        ) : null}

        <div className="mb-18 flex items-start gap-6 max-xl:flex-wrap max-xl:pb-5">
          <ChefReviewForRestaurants chef={chef} reviews={reviews} />
          <Adertising />
        </div>
      </div>
    </div>
  );
}
