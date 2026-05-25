import Button from '@/components/Button';
import ChefProfileAvatar from './ChefProfileAvatar';
import {
  formatChefFullName,
  formatChefSubtitle,
  type ChefProfile,
} from '@/types/chef';

type RestaurantsDetailsProps = {
  chef?: ChefProfile;
  reviewCount?: number;
  onPhotoUpdated?: (displayUrl: string) => void;
};

const RestaurantsDetails = ({
  chef,
  reviewCount = 0,
  onPhotoUpdated,
}: RestaurantsDetailsProps) => {
  const fullName = formatChefFullName(chef) || "Chef";
  const subtitle = formatChefSubtitle(chef);
  const reviewLabel =
    reviewCount === 1
      ? "1 CHEF REVIEW"
      : `${reviewCount} CHEF REVIEWS`;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-6 gap-4 mt-2">
      <div className="flex flex-row gap-6 items-center justify-between w-full max-w-full">
        <div className='flex items-center md:gap-6 gap-4 w-full max-w-full'>
          <ChefProfileAvatar
            profilePhotoUrl={chef?.profilePhotoUrl}
            chefName={fullName}
            editable
            onPhotoUpdated={onPhotoUpdated}
          />
          <div>
            <h1 className="md:text-5xl text-2xl text-[#FFF1E1] mt-2 tracking-[-8%] md:leading-12 leading-8">
              {fullName}
            </h1>
            {subtitle ? (
              <p className="md:text-xl text-sm text-[#FFF1E1] tracking-[-8%] leading-8 ">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <Button
        className='text-sm! px-6! py-2! min-h-12!'
        title={reviewLabel}
      />
    </div>
  );
};

export default RestaurantsDetails;
