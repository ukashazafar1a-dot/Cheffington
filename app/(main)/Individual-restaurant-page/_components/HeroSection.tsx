import type { PublicRestaurant } from "@/types/restaurant";
import RestaurantsImages from "./RestaurantsImages";
import RestaurantsDetails from "./RestaurantsDetails";
import RetaurantsMap from "./RetaurantsMap";

function formatMapAddress(restaurant: PublicRestaurant) {
  return [
    restaurant.addressLine1,
    restaurant.addressLine2,
    `${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`,
    restaurant.country,
  ]
    .filter(Boolean)
    .join(", ");
}

type Props = { restaurant?: PublicRestaurant };

const HeroSection = ({ restaurant }: Props) => {
  const images =
    restaurant?.images && restaurant.images.length > 0
      ? restaurant.images
      : undefined;

  return (
    <div>
      <section className="bg-black xl:min-h-130 pb-10 max-xl:pb-8">
        <div className="page-width">
          <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5">
            <div className="flex flex-col xl:w-[68%] w-full">
              <RestaurantsImages images={images} />
              <RestaurantsDetails restaurant={restaurant} />
            </div>
            <div className="xl:w-[30%] w-full">
              <RetaurantsMap
                address={restaurant ? formatMapAddress(restaurant) : undefined}
                phone={restaurant?.phone}
                website={restaurant?.website}
                locationName={restaurant?.name}
                compact={!!restaurant}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
