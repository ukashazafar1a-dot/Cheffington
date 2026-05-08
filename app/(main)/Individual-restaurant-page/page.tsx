
import React from "react";

import HeroSection from "./_components/HeroSection";
import RestaurantsButtons from "./_components/RestaurantsButtons";
import RestaurantsFeatures from "./_components/RestaurantsFeatures";
import ChefReviewForRestaurants from "./_components/ChefReviewForRestaurants";
import Adertising from "./_components/Adertising";

const page = () => {

  return (
    <div className="">
      <HeroSection />
      <div className="flex flex-col gap-12 -mt-8 relative z-10 page-width">
        <div className="flex flex-col">
          <RestaurantsButtons />
          <RestaurantsFeatures />
        </div>
        <div className="flex items-start max-xl:flex-wrap gap-6 max-xl:pb-5 mb-18">
          <ChefReviewForRestaurants />
          <Adertising />
        </div>
      </div>
    </div>
  );
};

export default page;
