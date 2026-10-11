import Button from "@/components/Button";

const Search = () => {
  return (
    <section className="pt-7 pb-44">
      <div className="page-width-narrow">
        <div className="w-full flex flex-col items-center">
          <h2 className="title mb-7">
            Explore <span className="text-[#FF8400]">Now</span>
          </h2>
        </div>
        <form
          action="/restaurants"
          method="get"
          className="form-search-card relative w-full"
        >
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="about-cuisine">
                Cuisine
              </label>
              <input
                id="about-cuisine"
                name="cuisine"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="about-location">
                City/State
              </label>
              <input
                id="about-location"
                name="location"
                type="text"
                placeholder="e.g. Grass Valley, CA"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="about-chef">
                Chef
              </label>
              <input
                id="about-chef"
                name="chef"
                type="text"
                suppressHydrationWarning
                className="form-search-input"
              />
            </div>
            <div className="relative">
              <Button
                title="Let's Eat"
                type="submit"
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </form>
        <p className="mt-8 text-left text-base text-black md:text-lg">
          <span className="font-bold">Questions?</span>{" "}
          <a
            href="mailto:info@cheffington.com"
            className="font-medium text-[#FF8400] hover:underline"
          >
            info@cheffington.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default Search;
