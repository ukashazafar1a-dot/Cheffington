import Button from "@/components/Button";
import type { PublicRestaurant } from "@/types/restaurant";

type Props = { restaurant?: PublicRestaurant; compact?: boolean };

const RestaurantsDetails = ({ restaurant, compact = false }: Props) => {
  const name = restaurant?.name ?? "Name of Restaurant";
  const cuisine = restaurant?.cuisine ?? "Type of restaurant";

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between md:gap-6 gap-4 ${compact ? "mt-1" : "mt-2"}`}>
      <div className="flex flex-row gap-6 items-center justify-between w-full max-w-full">
        <div className={`flex items-center w-full max-w-full ${compact ? "md:gap-5 gap-4" : "md:gap-6 gap-4"}`}>
          <div className="relative">
            <div
              className={
                compact
                  ? "md:w-24 md:h-24 w-16 h-16 rounded-full bg-white border-4 border-[#ff8400]/40 flex items-center justify-center overflow-hidden shadow-sm"
                  : "md:w-26 md:h-26 w-16 h-17 rounded-full bg-white border-4 border-[#ff8400]/40 flex items-center justify-center overflow-hidden shadow-sm"
              }
            />
          </div>
          <div>
            <h1
              className={
                compact
                  ? "md:text-4xl text-2xl text-gray-900 tracking-[-8%] md:leading-10 leading-8"
                  : "md:text-5xl text-2xl text-gray-900 mt-2 tracking-[-8%] md:leading-12 leading-8"
              }
            >
              {name}
            </h1>
            <p
              className={
                compact
                  ? "md:text-lg text-sm text-gray-600 tracking-[-8%] leading-7"
                  : "md:text-xl text-sm text-gray-600 tracking-[-8%] leading-8"
              }
            >
              {cuisine}
            </p>
          </div>
        </div>
      </div>

      {!restaurant && (
        <Button
          className="text-sm! px-6! py-2! min-h-12!"
          title="22 Chef Reviews"
        />
      )}
    </div>
  );
};

export default RestaurantsDetails;
