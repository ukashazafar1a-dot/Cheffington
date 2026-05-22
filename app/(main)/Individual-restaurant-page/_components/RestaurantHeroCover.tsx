type RestaurantHeroCoverProps = {
  name: string;
  cuisine?: string;
  coverImageUrl?: string;
};

/**
 * Single wide cover photo + restaurant identity for public /restaurants/[id] hero.
 */
const RestaurantHeroCover = ({
  name,
  cuisine,
  coverImageUrl,
}: RestaurantHeroCoverProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {coverImageUrl ? (
        <a
          href={coverImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full overflow-hidden rounded-xl border border-[#ff8400]/20 shadow-sm"
        >
          <div className="relative aspect-[16/9] w-full max-h-56 sm:max-h-64 md:max-h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={`${name} cover`}
              className="h-full w-full object-cover"
            />
          </div>
        </a>
      ) : (
        <div
          className="flex aspect-[16/9] w-full max-h-56 sm:max-h-64 md:max-h-72 items-center justify-center rounded-xl border border-dashed border-[#ff8400]/30 bg-white/40"
          aria-hidden
        >
          <span className="text-sm font-medium text-gray-500">No cover photo</span>
        </div>
      )}

      <div className="flex items-center gap-4 md:gap-5">
        <div
          className="md:h-24 md:w-24 h-16 w-16 shrink-0 rounded-full border-4 border-[#ff8400]/40 bg-white shadow-sm"
          aria-hidden
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-[-0.04em] text-gray-900 md:text-4xl md:leading-10 leading-8">
            {name}
          </h1>
          {cuisine ? (
            <p className="text-sm tracking-[-0.04em] text-gray-600 md:text-lg md:leading-7 leading-6">
              {cuisine}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeroCover;
