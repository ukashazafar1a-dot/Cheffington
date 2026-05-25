import Button from '@/components/Button';

type Props = {
  website?: string;
};

function normalizeWebsiteUrl(website: string) {
  const trimmed = website.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

const ChefWebsiteButton = ({ website }: Props) => {
  const websiteUrl = website?.trim() ? normalizeWebsiteUrl(website) : undefined;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2 mb-14 max-sm:mb-0 xl:-mt-14 py-8 max-xl:flex-wrap ">
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
    </div>
  );
};

export default ChefWebsiteButton;
