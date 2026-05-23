import StarRating from "@/components/StarRating";

type ChefReviewCardProps = {
  chefName?: string;
  restaurantName?: string;
  rating?: number;
  title?: string;
  comment?: string;
  date?: string;
};

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return "Month XX, YEAR";
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
  rating = 5,
  title,
  comment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo metus vitae urna eleifend, a tristique sapien fringilla. Aliquam scelerisque ante tellus, eget consequat mi sollicitudin vel.",
  date,
}: ChefReviewCardProps) => {
  const displayTitle = title?.trim();

  return (
    <div className="flex flex-col gap-4 border-b pb-8 last:border-0 last:pb-0 sm:flex-row md:gap-8 sm:pb-10">
      <div className="flex w-full shrink-0 flex-col items-center gap-3 text-center sm:w-36 max-sm:flex-row max-sm:items-center max-sm:gap-4 max-sm:text-left">
        <div className="h-20 w-20 shrink-0 rounded-full bg-gray-300 sm:h-24 sm:w-24 md:h-28 md:w-28" />
        <div className="flex min-w-0 flex-col items-center gap-1 max-sm:items-start">
          <p className="w-full text-sm font-bold leading-tight tracking-[2%]">{chefName}</p>
          {restaurantName ? (
            <p className="w-full text-sm font-bold uppercase leading-tight tracking-[2%] underline">
              {restaurantName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <StarRating value={rating} readOnly size="sm" />
        </div>
        {displayTitle ? (
          <h3 className="mb-2 text-xl font-bold leading-tight tracking-[2%]">{displayTitle}</h3>
        ) : null}
        <p
          className={`text-xl font-normal uppercase leading-tight tracking-[2%] ${displayTitle ? "mb-4 md:mb-6" : "mb-3 md:mb-4"}`}
        >
          {formatReviewDate(date)}
        </p>
        <p className="text-justify text-sm font-bold leading-relaxed md:text-xl">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default ChefReviewCard;
