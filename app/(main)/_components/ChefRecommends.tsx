import Link from "next/link";
import { getFeaturedReviews } from "@/lib/api-client";

export const dynamic = "force-dynamic";

function chefDisplayName(chef?: {
  firstName?: string;
  lastName?: string;
}) {
  if (!chef) return "Chef";
  return `${chef.firstName ?? ""} ${chef.lastName ?? ""}`.trim() || "Chef";
}

function chefInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ChefRecommends() {
  let reviews: Awaited<ReturnType<typeof getFeaturedReviews>>["data"] = [];
  let loadFailed = false;

  try {
    const res = await getFeaturedReviews(4);
    reviews = res.data ?? [];
  } catch {
    loadFailed = true;
    reviews = [];
  }

  if (reviews.length === 0) {
    return (
      <section className="lg:my-32 my-24 max-sm:my-18">
        <div className="page-width">
          <h2 className="title text-center">Chef Recommends</h2>
          <p className="subtitle md:mb-12 mb-8 text-center">
            No bad reviews. Only great food.
          </p>
          <p className="text-center text-lg text-gray-700">
            {loadFailed
              ? "Could not load chef reviews. Make sure the backend is running on port 5000, then refresh."
              : "Chef reviews will appear here once published."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:my-32 my-24 max-sm:my-18">
      <div className="page-width">
        <h2 className="title text-center">Chef Recommends</h2>
        <p className="subtitle md:mb-12 mb-8 text-center">
          No bad reviews. Only great food.
        </p>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {reviews.map((review) => {
            const name = chefDisplayName(review.chef);
            const quote = review.comment?.trim() || "";
            const restaurantId = review.restaurant?.id;
            const restaurantName = review.restaurant?.name;

            return (
              <article
                key={review._id}
                className="relative flex min-h-[300px] flex-col justify-end overflow-hidden bg-[#D9D9D9] p-4 text-left md:p-8"
              >
                <div className="flex items-start gap-6 max-sm:flex-wrap">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#56A8F5] md:h-32 md:w-32">
                    {review.chef?.profilePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.chef.profilePhotoUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white md:text-3xl">
                        {chefInitials(name)}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 basis-2/3 flex-col justify-center max-sm:basis-full">
                    <h4 className="mb-1 text-xl font-bold">{name}</h4>
                    {restaurantName && restaurantId ? (
                      <Link
                        href={`/restaurants/${restaurantId}`}
                        className="mb-2 text-sm font-bold uppercase underline hover:text-black/70"
                      >
                        {restaurantName}
                      </Link>
                    ) : null}
                    <p className="text-xl font-normal leading-tight tracking-tight">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
