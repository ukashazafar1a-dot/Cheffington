"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  restaurantId: string;
  className?: string;
};

export default function WriteReviewLink({ restaurantId, className = "" }: Props) {
  const [isChefLoggedIn, setIsChefLoggedIn] = useState(false);

  useEffect(() => {
    setIsChefLoggedIn(!!window.localStorage.getItem("chefToken"));
  }, []);

  if (!isChefLoggedIn) {
    return null;
  }

  return (
    <Link
      href={`/review-1?restaurantId=${restaurantId}`}
      className={`button button--primary inline-flex w-fit px-6 py-3 text-sm ${className}`}
    >
      Write a review
    </Link>
  );
}
