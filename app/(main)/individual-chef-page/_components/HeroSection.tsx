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
      {/* Short black band on xl; map hangs below into the page (overflow visible). */}
      <section className="relative z-10 bg-black xl:h-[200px]">
        <div className="page-width relative h-full">
          <div className="flex h-full flex-col gap-5 py-5 max-xl:pb-6 xl:flex-row xl:items-center xl:justify-between xl:gap-8 xl:py-0">
            <div className="min-w-0 xl:max-w-[58%] xl:pr-4">
              <RestaurantsDetails
                chef={chef}
                reviewCount={reviewCount}
                onPhotoUpdated={onPhotoUpdated}
                roleLabel={roleLabel}
              />
            </div>

            {/* Far-right address card; hangs past the short black band on desktop */}
            <div className="relative z-20 w-full shrink-0 xl:absolute xl:right-0 xl:top-5 xl:w-[300px]">
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
                geocodePrecision={
                  chef?.geocodePrecision as GeocodePrecision | undefined
                }
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
