import ChefProfileAvatar from './ChefProfileAvatar';
import {
  formatAccountRoleLabel,
  formatChefFullName,
  formatChefSubtitle,
  type ChefProfile,
} from '@/types/chef';

type RestaurantsDetailsProps = {
  chef?: ChefProfile;
  reviewCount?: number;
  onPhotoUpdated?: (displayUrl: string) => void;
  roleLabel?: string;
};

function SocialLink({ href, label }: { href?: string; label: string }) {
  const url = href?.trim();
  if (!url) return null;
  const normalized = url.startsWith('http') ? url : `https://${url}`;
  return (
    <a
      href={normalized}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold text-[#FF8400] underline underline-offset-2"
    >
      {label}
    </a>
  );
}

const RestaurantsDetails = ({
  chef,
  reviewCount = 0,
  onPhotoUpdated,
  roleLabel,
}: RestaurantsDetailsProps) => {
  const fullName = formatChefFullName(chef) || "Chef";
  const subtitle = formatChefSubtitle(chef);
  const accountRole =
    roleLabel || formatAccountRoleLabel(chef?.applicationType);
  const isBusinessOwner = chef?.applicationType === "business_owner";
  const reviewLabel =
    reviewCount === 0
      ? "No reviews yet"
      : reviewCount === 1
        ? isBusinessOwner
          ? "1 review"
          : "1 chef review"
        : isBusinessOwner
          ? `${reviewCount} reviews`
          : `${reviewCount} chef reviews`;

  return (
    <div className="flex items-start gap-4 md:gap-6">
      <ChefProfileAvatar
        profilePhotoUrl={chef?.profilePhotoUrl}
        chefName={fullName}
        editable
        onPhotoUpdated={onPhotoUpdated}
      />

      <div className="min-w-0 flex-1 pt-1">
        <h1 className="text-2xl leading-tight tracking-[-0.06em] text-[#FFF1E1] md:text-4xl md:leading-tight">
          {fullName}
        </h1>
        <p className="mt-1 text-sm font-semibold tracking-[-0.04em] text-[#FF8400] md:text-lg">
          {accountRole}
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-sm tracking-[-0.06em] text-[#FFF1E1]/90 md:text-lg">
            {subtitle}
          </p>
        ) : null}

        <p className="mt-3 inline-flex rounded-full bg-[#FF8400] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-black md:text-sm">
          {reviewLabel}
        </p>

        <div className="mt-3 flex flex-wrap gap-4">
          <SocialLink href={chef?.instagramUrl} label="Instagram" />
          <SocialLink href={chef?.facebookUrl} label="Facebook" />
          <SocialLink href={chef?.spotifyUrl} label="Spotify" />
        </div>
      </div>
    </div>
  );
};

export default RestaurantsDetails;
