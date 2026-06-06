import { notFound } from "next/navigation";
import { getPublishedRestaurant } from "@/lib/api-client";
import HeroSection from "../../Individual-restaurant-page/_components/HeroSection";
import RestaurantSidebar from "./_components/restaurant-sidebar";
import RestaurantContentSections from "./_components/restaurant-content-sections";
import RestaurantReviews from "./_components/restaurant-reviews";

type Props = { params: Promise<{ id: string }> };

export default async function RestaurantDetailPage({ params }: Props) {
  const { id } = await params;

  let restaurant;
  try {
    const res = await getPublishedRestaurant(id);
    restaurant = res.data;
  } catch {
    notFound();
  }

  return (
    <div>
      <HeroSection restaurant={restaurant} />
      <div className="page-width pb-18 mt-10 lg:mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          <aside className="min-w-0">
            <RestaurantSidebar restaurant={restaurant} />
          </aside>
          <main className="min-w-0">
            <RestaurantContentSections sections={restaurant.contentSections} />
            <RestaurantReviews
              restaurantId={id}
              restaurantName={restaurant.name}
              reviewCount={restaurant.reviewCount ?? 0}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
