import RestaurantsDetails from './RestaurantsDetails';
import RestaurantsMap from './RetaurantsMap';

import { formatChefAddress, type ChefProfile } from '@/types/chef';
import type { GeocodePrecision } from '@/lib/geocode';

interface HeroSectionProps {
  chef?: ChefProfile;
  reviewCount?: number;
  onPhotoUpdated?: (displayUrl: string) => void;
  roleLabel?: string;
}

const HeroSection = ({
  chef,
  reviewCount = 0,
  onPhotoUpdated,
  roleLabel,
}: HeroSectionProps) => {
  const address = formatChefAddress(chef);
  const locationName =
    chef?.currentRestaurant?.trim() ||
    `${chef?.firstName ?? ""} ${chef?.lastName ?? ""}`.trim() ||
    "Chef Location";

  return (
    <div>
      <section className="bg-black xl:min-h-[235] xl:h-[235]">
        <div className="page-width">
          <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5 max-xl:pb-5">
            <div className="flex flex-col xl:w-[68%] w-full">
              <RestaurantsDetails
                chef={chef}
                reviewCount={reviewCount}
                onPhotoUpdated={onPhotoUpdated}
                roleLabel={roleLabel}
              />
            </div>
            <div className="relative z-20 xl:w-[30%] w-full">
              <RestaurantsMap
                address={address}
                addressFields={{
                  addressLine1: chef?.addressLine1,
                  addressLine2: chef?.addressLine2,
                  city: chef?.city,
                  state: chef?.state,
                  zipCode: chef?.zipCode,
                  country: chef?.country,
                }}
                lat={chef?.latitude ?? undefined}
                lng={chef?.longitude ?? undefined}
                geocodePrecision={chef?.geocodePrecision as GeocodePrecision | undefined}
                phone={chef?.phone}
                website={chef?.website}
                locationName={locationName}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
