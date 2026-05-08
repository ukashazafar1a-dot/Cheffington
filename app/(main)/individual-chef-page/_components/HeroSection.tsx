import RestaurantsDetails from "./RestaurantsDetails"
import RestaurantsMap from "./RetaurantsMap"

const HeroSection = () => {
    return (
        <div>
            <section className="bg-black xl:min-h-[235] xl:h-[235]">
                <div className="page-width">
                    <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5 max-xl:pb-5">
                        <div className="flex flex-col xl:w-[68%] w-full">
                            <RestaurantsDetails />
                        </div>
                        <div className=" xl:w-[30%] w-full">
                            <RestaurantsMap />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default HeroSection
