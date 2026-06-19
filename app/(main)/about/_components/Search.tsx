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
        <div className="form-search-card relative w-full">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <label className="form-search-label">Cuisine</label>
              <input type="text" className="form-search-input" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label">Location</label>
              <input type="text" className="form-search-input" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="form-search-label">Chef</label>
              <input type="text" className="form-search-input" />
            </div>
            <div className="relative">
              <Button title="Let's Eat" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
