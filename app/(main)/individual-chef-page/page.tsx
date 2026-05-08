
import HeroSection from "./_components/HeroSection";
import ChefReviewForRestaurants from "./_components/ChefReviewForRestaurants";
import Adertising from "./_components/Adertising";
import ChefWebsiteButton from "./_components/ChefWebsiteButton";

const page = () => {

  return (
    <div className="">
      <HeroSection />
      <div className="flex flex-col  -mt-8 relative z-10 page-width">
        <div className="flex flex-col">
          <ChefWebsiteButton />
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
