import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

const Adertising = () => {
  return (
    <div className="pointer-events-none xl:w-[30%] lg:pt-32">
      <div className="pointer-events-auto">
        <AdSlot slot={SITE_AD_SLOTS.CHEF_SIDEBAR} variant="sidebar" />
      </div>
    </div>
  );
};

export default Adertising;
