import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section >
      <div className="page-width ">
        <div className="flex items-center justify-center ">
          <Image
            src={"/image1.png"}
            alt="Chicken Chef"
            width={578}
            height={653}
          />
        </div>
        {/* Hero Text */}
        <div className="text-center mb-14">
          <h1 className="title mb-2">Eat Like a Chef.</h1>
          <p className="subtitle">
            Restaurant reviews by Chef’s, not your mom’s cat sitter.
          </p>
        </div>
        {/* Search Bar / Filter Section */}
        <div className=" bg-transparent border-black border-3 px-4 py-5 rounded-[9px] ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
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
               <Link href="/search-results">
                <Button title="Let's Eat" />
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
