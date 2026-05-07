import React from 'react'

import RestaurantsImages from './RestaurantsImages';
import RestaurantsDetails from './RestaurantsDetails';
import RetaurantsMap from './RetaurantsMap';

const HeroSection = () => {
    return (
        <div>
            <section className="bg-black xl:min-h-130 xl:h-130">
                <div className="page-width">
                    <div className="flex align-center justify-center max-xl:flex-wrap gap-6 pt-5 max-xl:pb-5">
                        <div className="flex flex-col xl:w-[68%] w-full">
                            <RestaurantsImages />
                            <RestaurantsDetails />
                        </div>
                        <div className=" xl:w-[30%] w-full">
                            <RetaurantsMap />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default HeroSection
