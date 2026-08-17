import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import ChefReviewCard from "@/app/(main)/_components/ChefReviewCard";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";
import { getPublicChef } from "@/lib/api-client";
import {
  displayWebsiteLabel,
  formatChefFullName,
  formatChefSubtitle,
} from "@/types/chef";

type Props = { params: Promise<{ id: string }> };

type ProfileRestaurant = {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  cuisine?: string;
  images?: string[];
};

function SocialLink({ href, label }: { href?: string; label: string }) {
  const url = href?.trim();
  if (!url) return null;
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a
      href={normalized}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FF8400] transition hover:border-[#FF8400] hover:bg-[#FF8400]/10"
    >
      {label}
    </a>
  );
}

function chefInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function RestaurantRow({
  restaurant,
  badge,
}: {
  restaurant: ProfileRestaurant;
  badge: string;
}) {
  const thumb = restaurant.images?.[0];
  const location = [restaurant.city, restaurant.state].filter(Boolean).join(", ");

  return (
    <Link
      href={`/restaurants/${restaurant._id}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-[#FF8400]/40 hover:shadow-md"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FFF1E1]">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#FF8400]">
            {restaurant.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-gray-900 group-hover:text-[#FF8400]">
          {restaurant.name}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
          {location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {location}
            </span>
          ) : null}
          {restaurant.cuisine ? <span>{restaurant.cuisine}</span> : null}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-[#FF8400]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c45f00]">
        {badge}
      </span>
    </Link>
  );
}

export default async function PublicChefPage({ params }: Props) {
  const { id } = await params;

  let chef;
  try {
    chef = await getPublicChef(id);
  } catch {
    notFound();
  }

  const fullName = formatChefFullName(chef) || "Chef";
  const subtitle = formatChefSubtitle(chef);
  const websiteLabel = displayWebsiteLabel(chef.website);
  const websiteHref = chef.website?.trim()
    ? chef.website.startsWith("http")
      ? chef.website
      : `https://${chef.website}`
    : undefined;
  const restaurantLinkLabel = displayWebsiteLabel(chef.currentRestaurantUrl);
  const restaurantLinkHref = chef.currentRestaurantUrl?.trim()
    ? chef.currentRestaurantUrl.startsWith("http")
      ? chef.currentRestaurantUrl
      : `https://${chef.currentRestaurantUrl}`
    : undefined;
  const listedRestaurantNames = new Set(
    [
      ...(chef.ownedRestaurants ?? []).map((r) => r.name?.trim().toLowerCase()),
      ...(chef.affiliatedRestaurants ?? []).map((r) =>
        r.name?.trim().toLowerCase()
      ),
    ].filter(Boolean)
  );
  const workplaceLabel = chef.currentRestaurant?.trim() || "";
  const nameAlreadyListed =
    Boolean(workplaceLabel) &&
    listedRestaurantNames.has(workplaceLabel.toLowerCase());
  const showWorkplaceRow =
    Boolean(restaurantLinkHref) ||
    (Boolean(workplaceLabel) && !nameAlreadyListed);
  const reviewCount = chef.reviews?.length ?? 0;
  const hasRestaurants =
    Boolean(chef.ownedRestaurants?.length) ||
    Boolean(chef.affiliatedRestaurants?.length) ||
    showWorkplaceRow;

  return (
    <div className="pb-16">
      <section className="bg-black">
        <div className="page-width px-4 pt-12 pb-10 sm:px-6 md:pt-16 md:pb-12 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5 md:gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#FF8400] bg-[#FF8400] shadow-[0_0_0_4px_rgba(255,132,0,0.25)] md:h-32 md:w-32">
                {chef.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={chef.profilePhotoUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-[#FFF1E1] md:text-4xl">
                    {chefInitials(fullName)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8400]">
                  Chef profile
                </p>
                <h1 className="text-3xl font-black tracking-tight text-[#FFF1E1] md:text-5xl">
                  {fullName}
                </h1>
                {subtitle ? (
                  <p className="mt-2 text-sm text-white/70 md:text-base">
                    {subtitle}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <SocialLink href={chef.instagramUrl} label="Instagram" />
                  <SocialLink href={chef.facebookUrl} label="Facebook" />
                  <SocialLink href={chef.spotifyUrl} label="Spotify" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {websiteHref ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#FFF1E1] transition hover:border-[#FF8400] hover:text-[#FF8400]"
                >
                  <Globe className="h-4 w-4" aria-hidden />
                  {websiteLabel || "Website"}
                </a>
              ) : null}
              <div className="rounded-full bg-[#FF8400] px-4 py-2 text-sm font-black uppercase tracking-wide text-black">
                {reviewCount === 1 ? "1 chef review" : `${reviewCount} chef reviews`}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-width px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
          <div className="min-w-0 flex-1 space-y-12">
            <section>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#FF8400]">
                About
              </h2>
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm md:px-6">
                {chef.bio?.trim() ? (
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                    {chef.bio.trim()}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    This chef hasn&apos;t added an about section yet.
                  </p>
                )}
              </div>
            </section>

            {hasRestaurants ? (
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#FF8400]">
                  Restaurants
                </h2>
                <div className="space-y-3">
                  {chef.ownedRestaurants?.map((restaurant) => (
                    <RestaurantRow
                      key={`owned-${restaurant._id}`}
                      restaurant={restaurant}
                      badge="Owns"
                    />
                  ))}
                  {chef.affiliatedRestaurants?.map((restaurant) => (
                    <RestaurantRow
                      key={`affiliated-${restaurant._id}`}
                      restaurant={restaurant}
                      badge="Affiliated"
                    />
                  ))}
                  {showWorkplaceRow ? (
                    restaurantLinkHref ? (
                      <a
                        href={restaurantLinkHref}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-[#FF8400]/40 hover:shadow-md"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E1]">
                          <Globe className="h-6 w-6 text-[#FF8400]" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-gray-900 group-hover:text-[#FF8400]">
                            {workplaceLabel || "Restaurant"}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {restaurantLinkLabel || restaurantLinkHref}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#FF8400]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c45f00]">
                          Workplace
                        </span>
                      </a>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-4 text-sm font-medium text-gray-700">
                        {workplaceLabel}
                      </div>
                    )
                  ) : null}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#FF8400]">
                Reviews
              </h2>
              {reviewCount === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-5 text-center text-gray-500">
                  No published reviews yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-1 shadow-sm md:px-6">
                  {chef.reviews?.map((review) => (
                    <ChefReviewCard
                      key={review._id}
                      chefName={fullName}
                      chefId={chef._id}
                      profilePhotoUrl={chef.profilePhotoUrl}
                      restaurantName={review.restaurant?.name}
                      affiliations={(chef.affiliatedRestaurants ?? []).map(
                        (restaurant) => restaurant.name
                      )}
                      title={review.title?.trim() || undefined}
                      comment={review.comment}
                      date={review.updatedAt ?? review.createdAt}
                      compact
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="w-full shrink-0 xl:w-[300px]">
            <AdSlot slot={SITE_AD_SLOTS.CHEF_SIDEBAR} variant="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
