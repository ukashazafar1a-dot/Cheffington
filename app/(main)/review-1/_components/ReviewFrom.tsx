"use client";

import Button from "@/components/Button";
import { submitReview } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ReviewFromProps = {
  restaurantId: string;
  restaurantName?: string;
};

const ReviewFrom = ({ restaurantId, restaurantName }: ReviewFromProps) => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("chefToken")
        : null;

    if (!token) {
      router.push(
        `/sign-in?returnUrl=${encodeURIComponent(`/review-1?restaurantId=${restaurantId}`)}`
      );
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review.");
      return;
    }

    setLoading(true);
    try {
      const result = await submitReview(
        {
          restaurantId,
          comment: comment.trim(),
          title: title.trim() || undefined,
        },
        token
      );

      if (result.flagged) {
        router.push("/review-flagged");
        return;
      }

      router.push(`/restaurants/${restaurantId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[9px] border-3 border-black px-4 py-8 md:px-7 md:py-20">
      {restaurantName ? (
        <p className="mb-4 text-sm font-medium text-gray-700">
          Reviewing: <span className="font-bold text-gray-900">{restaurantName}</span>
        </p>
      ) : null}

      <h2 className="mb-2 text-2xl font-bold tracking-[-8%] sm:text-3xl md:text-4xl">
        Share your Chef&apos;s Notes...
      </h2>
      <p className="mb-4 text-[18px] tracking-[-8%] md:text-[20px]">
        Don&apos;t forget to tell us about...
      </p>

      <div className="mb-4.5 flex flex-wrap gap-2 max-md:flex-wrap">
        {["your favorite dishes", "the experience", "the ambiance"].map((tag) => (
          <span
            key={tag}
            className="rounded-[6px] bg-black px-3 py-3 text-center text-[14px] font-medium text-[#FFF1E1] sm:text-[16px] md:basis-1/3 md:text-[20px]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title (optional)"
          className="input-field mb-4 w-full border border-black p-3"
          maxLength={120}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Positive reviews only. Negative reviews will be removed and your account will be flagged."
          className="input-field h-44 border border-black p-4 md:h-96"
        />
        <p className="mt-1 text-xs text-gray-500">{comment.trim().length} characters</p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="relative mt-10 flex justify-center">
        <Button
          title="Share"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ReviewFrom;
