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
        <form action="/restaurants" method="get" className="form-search-card">
          <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="hero-name">
                Restaurant
              </label>
              <input
                id="hero-name"
                name="name"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="hero-cuisine">
                Cuisine
              </label>
              <input
                id="hero-cuisine"
                name="cuisine"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="hero-location">
                Location
              </label>
              <input
                id="hero-location"
                name="location"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="hero-chef">
                Chef
              </label>
              <input
                id="hero-chef"
                name="chef"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <Button title="Let's Eat" type="submit" className="w-full lg:w-auto" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
