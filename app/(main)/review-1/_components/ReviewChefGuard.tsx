"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewFrom from "./ReviewFrom";

type Props = {
  restaurantId: string;
  restaurantName?: string;
};

export default function ReviewChefGuard({ restaurantId, restaurantName }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("chefToken");
    if (!token) {
      router.replace(
        `/sign-in?returnUrl=${encodeURIComponent(`/review-1?restaurantId=${restaurantId}`)}`
      );
      return;
    }
    setReady(true);
  }, [restaurantId, router]);

  if (!ready) {
    return (
      <p className="py-12 text-center text-lg text-gray-700">
        Checking chef sign-in…
      </p>
    );
  }

  return (
    <ReviewFrom restaurantId={restaurantId} restaurantName={restaurantName} />
  );
}
