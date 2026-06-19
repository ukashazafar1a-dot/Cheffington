type ChefReviewCardProps = {
  chefName?: string;
  restaurantName?: string;
  profilePhotoUrl?: string;
  title?: string;
  comment?: string;
  date?: string;
  /** Hide restaurant label when already on that restaurant's page */
  showRestaurantName?: boolean;
};

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const ChefReviewCard = ({
  chefName = "Jane Doe",
  restaurantName = "Restaurant",
  profilePhotoUrl,
  title,
  comment = "",
  date,
  showRestaurantName = true,
}: ChefReviewCardProps) => {
  const displayTitle = title?.trim();
  const formattedDate = formatReviewDate(date);
  const initials = chefName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <article className="flex gap-4 border-b border-black/10 py-6 first:pt-0 last:border-b-0 last:pb-0 md:gap-6 md:py-8">
      <div className="shrink-0">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#FFF1E1] md:h-20 md:w-20">
          {profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePhotoUrl}
              alt={chefName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-base font-bold text-[#FF8400] md:text-lg">
              {initials}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-base font-bold text-gray-900 md:text-lg">{chefName}</p>
          {formattedDate ? (
            <time className="shrink-0 text-xs text-gray-500 md:text-sm">
              {formattedDate}
            </time>
          ) : null}
        </div>

        {showRestaurantName && restaurantName ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#c45f00] underline underline-offset-2">
            {restaurantName}
          </p>
        ) : null}

        {displayTitle ? (
          <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900">
            {displayTitle}
          </h3>
        ) : null}

        {comment ? (
          <p className="text-base leading-relaxed text-gray-800 md:text-lg">
            {comment}
          </p>
        ) : null}
      </div>
    </article>
  );
};

export default ChefReviewCard;
