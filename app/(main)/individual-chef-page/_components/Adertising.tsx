import AdSlot from "@/components/AdSlot";
import { SITE_AD_SLOTS } from "@/lib/ad-slot-keys";

const Adertising = () => {
  return (
    <div className="xl:w-[30%] lg:pt-32">
      <AdSlot slot={SITE_AD_SLOTS.CHEF_SIDEBAR} variant="sidebar" />
    </div>
  );
};

export default Adertising;
