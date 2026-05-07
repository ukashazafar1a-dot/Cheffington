import React from 'react'

import RestaurantsImages from './RestaurantsImages';
import RestaurantsDetails from './RestaurantsDetails';
import RetaurantsMap from './RetaurantsMap';

const HeroSection = () => {
    return (
        <div>
            <section className="bg-black min-h-120">
                <div className="page-width">
                    <div className="flex align-center justify-center gap-6 p-4">
                        <div className="col-span-12 lg:col-span-8 space-y-10">
                            <RestaurantsImages />
                            <RestaurantsDetails />
                        </div>
                        <RetaurantsMap />
                    </div>
                </div>
            </section>

        </div>
    )
}

export default HeroSection
