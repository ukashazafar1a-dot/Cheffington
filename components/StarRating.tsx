"use client";

type StarRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
};

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const starClass = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="flex items-center gap-1" role={readOnly ? "img" : "group"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`${starClass} leading-none transition ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${star <= value ? "text-[#FF8400]" : "text-gray-300"}`}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
