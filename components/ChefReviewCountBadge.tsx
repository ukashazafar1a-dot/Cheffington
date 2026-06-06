import { formatChefReviewCount } from "@/lib/format-chef-review-count";

type ChefReviewCountBadgeProps = {
  count?: number;
  className?: string;
};

export default function ChefReviewCountBadge({
  count = 0,
  className = "",
}: ChefReviewCountBadgeProps) {
  const safe = Math.max(0, Math.floor(Number(count) || 0));

  return (
    <p
      className={`text-sm font-semibold text-[#c45f00] ${className}`.trim()}
      aria-label={formatChefReviewCount(safe)}
    >
      {formatChefReviewCount(safe)}
    </p>
  );
}
