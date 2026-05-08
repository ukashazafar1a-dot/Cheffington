import Button from "@/components/Button";
import Map from "@/components/Map";
import React from "react";
import RestaurantCard from "./_components/restaurant-card";

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
    <section>
      <div className="page-width">
        <div className="text-center mb-10 sm:mb-14 px-4">
          <p className="subtitle text-sm sm:text-base md:text-lg leading-relaxed">
            Results for <span className="text-[#FF8400]">Type of Food</span> in{" "}
            <span className="text-[#FF8400]">Town</span>.
          </p>
        </div>
        {/* Search Bar / Filter Section */}
        <div className="bg-transparent border-black border-3 px-4 py-5 rounded-[9px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl">Cuisine</label>
              <input
                type="text"
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl">Location</label>
              <input
                type="text"
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl">Chef</label>
              <input
                type="text"
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="flex-1 max-w-full lg:max-w-2xl">
            {/* Buttons */}
            <div className="flex  gap-3 my-4 sm:flex-row">
              <Button title="Sort by" />
              <Button title="Near me" />
              <Button title="More filters" />
            </div>

            {/* Sponsored Results */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 my-6">
                SPONSORED RESULTS
              </h2>

              <div className="space-y-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>

              <div className="border-2 border-black rounded-3xl p-4 md:p-8 mt-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}

                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-[420px] mt-4 lg:mt-6 mx-0 lg:mx-10">
            {/* Map */}
            <div className="bg-amber-900 h-[300px] sm:h-[400px] lg:h-[447px] w-full rounded overflow-hidden border">
              <Map lat={30.2672} lng={-97.7431} name="Chef Location" />
            </div>

            {/* Extra Box */}
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[447px] rounded overflow-hidden bg-gray-200 my-5"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
