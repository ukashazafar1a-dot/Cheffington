import Button from "@/components/Button";
import Image from "next/image";

const Hero = () => {
  return (
    <section>
      <div className="page-width">
        <div className="flex items-center justify-center">
          <Image
            src={"/image1.png"}
            alt="Chicken Chef"
            width={578}
            height={653}
          />
        </div>
        <div className="text-center mb-14">
          <h1 className="title mb-2">Eat Like a Chef.</h1>
          <p className="subtitle">
            Restaurant reviews by Chef&apos;s, not your mom&apos;s cat sitter.
          </p>
        </div>
        <form
          action="/search-results"
          method="get"
          className="bg-transparent border-black border-3 px-4 py-5 rounded-[9px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl" htmlFor="hero-cuisine">
                Cuisine
              </label>
              <input
                id="hero-cuisine"
                name="cuisine"
                type="text"
                suppressHydrationWarning
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl" htmlFor="hero-location">
                Location
              </label>
              <input
                id="hero-location"
                name="location"
                type="text"
                suppressHydrationWarning
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="uppercase text-xl" htmlFor="hero-chef">
                Chef
              </label>
              <input
                id="hero-chef"
                name="chef"
                type="text"
                suppressHydrationWarning
                className="bg-transparent border-b focus:border-black outline-none pb-1"
              />
            </div>
            <Button title="Let's Eat" type="submit" className="w-full md:w-auto" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
