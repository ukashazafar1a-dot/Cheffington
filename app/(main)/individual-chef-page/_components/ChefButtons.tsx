import Button from '@/components/Button';
import { displayWebsiteLabel, toExternalHref, type ChefProfile } from '@/types/chef';

type ChefButtonProps = {
  chef?: ChefProfile;
  website?: string;
};

const ChefButton = ({ chef, website }: ChefButtonProps) => {
  const websiteUrl = toExternalHref(website ?? chef?.website);
  const websiteLabel = displayWebsiteLabel(website ?? chef?.website) || "WEBSITE";
  const socialLinks = [
    { href: toExternalHref(chef?.instagramUrl), title: "INSTAGRAM" },
    { href: toExternalHref(chef?.facebookUrl), title: "FACEBOOK" },
    { href: toExternalHref(chef?.spotifyUrl), title: "SPOTIFY" },
  ].filter((link): link is { href: string; title: string } => Boolean(link.href));

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2 max-sm:mb-0 py-10 max-xl:flex-wrap">
      {websiteUrl ? (
        <Button
          title={websiteLabel || "WEBSITE"}
          href={websiteUrl}
          className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!"
        />
      ) : (
        <Button
          title="WEBSITE"
          disabled
          className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30! opacity-50"
        />
      )}
      {socialLinks.map((link) => (
        <Button
          key={link.title}
          title={link.title}
          href={link.href}
          className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!"
        />
      ))}
      <Button
        title="ADD REVIEW"
        href="/review"
        className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!"
      />
    </div>
  );
};

export default ChefButton;
