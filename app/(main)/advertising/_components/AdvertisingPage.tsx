import Image from "next/image";
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
        <p className="subtitle text-center">
          Get <span className="text-[#FF8400]">More Leads</span> for Your Business
          <br />
          When You <span className="text-[#FF8400]">Advertise With Us</span>
        </p>
      </div>

      <AdvertisingRequestForm />
    </section>
  );
};

export default AdvertisingPage;
