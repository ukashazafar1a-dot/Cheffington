import Button from "@/components/Button";
import Image from "next/image";
import RestaurantNameSuggest from "./RestaurantNameSuggest";

const DEFAULT_SUBTITLE =
  "Restaurant reviews by chefs, not your mom's cat sitter.";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getHomepageSubtitle() {
  try {
    const res = await fetch(`${API_BASE_URL}/site-copy`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_SUBTITLE;
    const json = await res.json();
    const value = json?.data?.homepage_subtitle;
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return DEFAULT_SUBTITLE;
  } catch {
    return DEFAULT_SUBTITLE;
  }
}

const Hero = async () => {
  const subtitle = await getHomepageSubtitle();

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
          <p className="subtitle">{subtitle}</p>
        </div>
        <form action="/restaurants" method="get" className="form-search-card relative z-20 overflow-visible">
          <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative z-20 flex flex-col space-y-2">
              <label className="form-search-label" htmlFor="hero-name">
                Restaurant
              </label>
              <RestaurantNameSuggest id="hero-name" name="name" />
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
