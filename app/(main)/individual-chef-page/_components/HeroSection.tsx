import RestaurantsDetails from './RestaurantsDetails';
import RestaurantsMap from './RetaurantsMap';

import type { ChefProfile } from '@/types/chef';

interface HeroSectionProps {
  chef?: ChefProfile;
}

const HeroSection = ({ chef }: HeroSectionProps) => {
  return (
    <div>
      <section className="bg-black xl:min-h-[235] xl:h-[235]">
        <div className="page-width">
          <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5 max-xl:pb-5">
            <div className="flex flex-col xl:w-[68%] w-full">
              <RestaurantsDetails chef={chef} />
            </div>
            <div className=" xl:w-[30%] w-full">
              <RestaurantsMap
                address={chef?.addressLine1 ? `${chef.addressLine1}, ${chef.city}, ${chef.state} ${chef.zipCode}` : undefined}
                phone={chef?.phone}
                website={chef?.website}
                locationName={chef?.currentRestaurant || 'Chef Location'}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
