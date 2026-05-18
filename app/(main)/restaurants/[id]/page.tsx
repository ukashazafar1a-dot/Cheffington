import { notFound } from "next/navigation";
import { getPublishedRestaurant } from "@/lib/api-client";
import HeroSection from "../../Individual-restaurant-page/_components/HeroSection";
import RestaurantSidebar from "./_components/restaurant-sidebar";
import RestaurantContentSections from "./_components/restaurant-content-sections";

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
      <div className="page-width pb-18 mt-10 lg:mt-14 relative">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[30%] lg:sticky lg:top-24 shrink-0">
            <RestaurantSidebar restaurant={restaurant} />
          </aside>
          <main className="w-full lg:w-[70%] min-w-0">
            <RestaurantContentSections sections={restaurant.contentSections} />
          </main>
        </div>
      </div>
    </div>
  );
}
