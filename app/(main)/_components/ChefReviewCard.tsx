type ChefReviewCardProps = {
  chefName?: string;
  chefId?: string;
  restaurantName?: string;
  affiliation?: string;
  affiliations?: string[];
  profilePhotoUrl?: string;
  title?: string;
  comment?: string;
  date?: string;
  /** Hide restaurant label when already on that restaurant's page */
  showRestaurantName?: boolean;
  /** Tighter padding for stacked profile cards */
  compact?: boolean;
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
  chefId,
  restaurantName = "Restaurant",
  affiliation,
  affiliations,
  profilePhotoUrl,
  title,
  comment = "",
  date,
  showRestaurantName = true,
  compact = false,
}: ChefReviewCardProps) => {
  const affiliationNames =
    affiliations !== undefined
      ? affiliations.map((name) => name.trim()).filter(Boolean)
      : affiliation?.trim()
        ? [affiliation.trim()]
        : [];
  const displayTitle = title?.trim();
  const formattedDate = formatReviewDate(date);
  const initials = chefName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const avatar = (
    <div
      className={
        compact
          ? "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#FFF1E1] md:h-14 md:w-14"
          : "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#FFF1E1] md:h-20 md:w-20"
      }
    >
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
  );

  return (
    <article
      className={
        compact
          ? "flex gap-3 py-4 md:gap-4 md:py-5"
          : "flex gap-4 border-b border-black/10 py-6 first:pt-0 last:border-b-0 last:pb-0 md:gap-6 md:py-8"
      }
    >
      <div className="shrink-0">
        {chefId ? (
          <a href={`/chefs/${chefId}`} className="block">
            {avatar}
          </a>
        ) : (
          avatar
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {chefId ? (
              <a
                href={`/chefs/${chefId}`}
                className="text-base font-bold text-gray-900 hover:underline md:text-lg"
              >
                {chefName}
              </a>
            ) : (
              <p className="text-base font-bold text-gray-900 md:text-lg">
                {chefName}
              </p>
            )}
            {affiliationNames.length > 0 ? (
              <span className="basis-full text-sm font-semibold text-[#FF8400] md:text-base">
                {affiliationNames.join(" · ")}
              </span>
            ) : null}
          </div>
          {formattedDate ? (
            <time className="shrink-0 text-xs text-gray-500 md:text-sm">
              {formattedDate}
            </time>
          ) : null}
        </div>

        {showRestaurantName && restaurantName ? (
          <p className="mb-3 mt-2.5 text-xs font-semibold uppercase tracking-wide text-gray-900 underline underline-offset-2">
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
