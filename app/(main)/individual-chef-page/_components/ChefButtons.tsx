import Button from '@/components/Button';

type ChefButtonProps = {
  website?: string;
  latestRestaurantId?: string;
};

function normalizeWebsiteUrl(website: string) {
  const trimmed = website.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

const ChefButton = ({ website, latestRestaurantId }: ChefButtonProps) => {
  const websiteUrl = website?.trim() ? normalizeWebsiteUrl(website) : undefined;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2  max-sm:mb-0   py-10 max-xl:flex-wrap ">
      {websiteUrl ? (
        <Button
          title="WEBSITE"
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
      <Button
        title="ADD REVIEW"
        href="/review"
        className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!"
      />
      {latestRestaurantId ? (
        <Button
          title="VIEW MENU "
          href={`/restaurants/${latestRestaurantId}`}
          className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!"
        />
      ) : (
        <Button
          title="VIEW MENU "
          disabled
          className="min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30! opacity-50"
        />
      )}
    </div>
  );
};

export default ChefButton;
