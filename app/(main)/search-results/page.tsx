import Button from "@/components/Button";
import Map from "@/components/Map";
import RestaurantCard from "./_components/restaurant-card";
import SearchButton from "./_components/SearchButton";

const restaurants = [
  {
    id: 1,
    name: "Restaurant Name",
    cuisine: "Cuisine",
    reviews: 22,
    address: "123 Fake Street, Los Angeles, CA 12345",
  },
  {
    id: 2,
    name: "Restaurant Name",
    cuisine: "Cuisine",
    reviews: 22,
    address: "123 Fake Street, Los Angeles, CA 12345",
  },
];

const page = () => {
  return (
    <section className="py-6 md:py-14">
      <div className="page-width">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="subtitle text-sm sm:text-base md:text-lg leading-relaxed">
            Results for{" "}
            <span className="text-[#FF8400]">Type of Food</span> in{" "}
            <span className="text-[#FF8400]">Town</span>.
          </p>
        </div>

        {/* Search / Filter Section */}
        <div className="bg-transparent border-2 border-black rounded-[9px] p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

            {/* Cuisine */}
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-base sm:text-lg md:text-xl">
                Cuisine
              </label>

              <input
                type="text"
                className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-base sm:text-lg md:text-xl">
                Location
              </label>

              <input
                type="text"
                className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
              />
            </div>

            {/* Chef */}
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-base sm:text-lg md:text-xl">
                Chef
              </label>

              <input
                type="text"
                className="bg-transparent border-b border-black outline-none pb-2 text-sm sm:text-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col xl:flex-row gap-6 mt-6">

          {/* Left Side */}
          <div className="basis-[70%]">

            {/* Buttons */}
            <div className="flex flex-col items-center md:flex-row md:items-start gap-2 sm:gap-3 my-4">
              <SearchButton />
            </div>

            {/* Sponsored Results */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 my-6">
                SPONSORED RESULTS
              </h2>
              {/* Restaurant Cards */}
              <div className="space-y-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
              {/* More Results */}
              <div className="border-2 border-black rounded-3xl p-4 md:p-8 mt-6 space-y-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="basis-[30%]">
            {/* Map */}
            <div className="bg-amber-900  h-70 sm:h-87.5 md:h-100 xl:h-11.75 w-full rounded overflow-hidden border">
              <Map
                lat={30.2672}
                lng={-97.7431}
                name="Chef Location"
              />
            </div>
            {/* Extra Box */}
            <div className="w-full h-70 sm:h-87.5 md:h-100 xl:h-111.75 rounded overflow-hidden bg-gray-200 mt-5"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;