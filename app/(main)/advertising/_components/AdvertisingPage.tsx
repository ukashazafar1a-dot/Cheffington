import Image from "next/image";
import { MEDIA_KIT_URL } from "@/data/site";
import AdvertisingRequestForm from "./AdvertisingRequestForm";

const AdvertisingPage = () => {
  return (
    <section className="flex flex-col items-center pt-14 pb-44">
      <div className="w-full page-width">
        <div className="flex items-center gap-2 justify-center">
          <Image
            src="/plus.png"
            alt="Quote Left"
            width={80}
            height={80}
            className="object-contain object-center max-sm:w-[50px] max-sm:h-[50px]"
          />
          <h1 className="title tracking-tighter">
            Your <span className="text-[#FF8400]">Business</span>
            <br />
            <span className="text-[#FF8400]">Hungry</span> Eyes
          </h1>
        </div>

        <div className="w-full h-0.5 bg-black my-8" />
        <p className="subtitle text-center pb-6 md:pb-8">
          Get <span className="text-[#FF8400]">More Leads</span> for Your Business
          <br />
          When You <span className="text-[#FF8400]">Advertise With Us</span>
        </p>
        <div className="flex justify-center pb-6 md:pb-10">
          {/* Relative PDF path: use <a> so it opens in a new tab (Button treats
              http(s) as external; site paths use Next Link). */}
          <a
            href={MEDIA_KIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary flex items-center justify-center gap-2"
          >
            Media Kit
          </a>
        </div>
      </div>

      <AdvertisingRequestForm />
    </section>
  );
};

export default AdvertisingPage;
