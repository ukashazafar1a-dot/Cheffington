import type { PublicRestaurant } from "@/types/restaurant";
import RestaurantsImages from "./RestaurantsImages";
import RestaurantsDetails from "./RestaurantsDetails";
import RestaurantHeroCover from "./RestaurantHeroCover";
import RetaurantsMap from "./RetaurantsMap";

type Props = { restaurant?: PublicRestaurant };

const HeroSection = ({ restaurant }: Props) => {
  if (restaurant) {
    const coverImageUrl = restaurant.images?.[0];

    return (
      <div>
        <section className="bg-[var(--bg-hero)] border-b border-[#ff8400]/20 pb-6 max-xl:pb-5">
          <div className="page-width pt-5 max-xl:pt-4">
            <RestaurantHeroCover
              name={restaurant.name}
              cuisine={restaurant.cuisine}
              coverImageUrl={coverImageUrl}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-[var(--bg-hero)] border-b border-[#ff8400]/20 xl:min-h-130 pb-10 max-xl:pb-8">
        <div className="page-width">
          <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5">
            <div className="flex flex-col xl:w-[68%] w-full">
              <RestaurantsImages />
              <RestaurantsDetails />
            </div>
            <div className="xl:w-[30%] w-full">
              <RetaurantsMap />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
