import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

const Adertising = () => {
  return (
    // xl:pt-* clears the hanging location card; extra space so the ad label never touches it
    <div className="pointer-events-none xl:w-[30%] max-xl:mt-10 xl:pt-44">
      <div className="pointer-events-auto">
        <AdSlot slot={SITE_AD_SLOTS.CHEF_SIDEBAR} variant="sidebar" />
      </div>
    </div>
  );
};

export default Adertising;
