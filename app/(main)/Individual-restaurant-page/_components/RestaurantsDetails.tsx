import Button from '@/components/Button'
import React from 'react'

const RestaurantsDetails = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-6 gap-4 mt-2">
            <div className="flex flex-row gap-6 items-center justify-between w-full max-w-full">
                <div className='flex items-center md:gap-6 gap-4 w-full max-w-full'>
                    <div className="relative">
                        <div className="md:w-26 md:h-26 w-16 h-17 rounded-full bg-[#FFF1E1] border-4 border-[#FFF1E1] flex items-center justify-center overflow-hidden"></div>
                    </div>
                    <div>
                        <h1 className="md:text-5xl text-2xl text-[#FFF1E1] mt-2 tracking-[-8%] md:leading-12 leading-8">
                            Name of Restaurant
                        </h1>
                        <p className="md:text-xl text-sm text-[#FFF1E1]  tracking-[-8%] leading-8 ">
                            Type of restaurant
                        </p>
                    </div>
                </div>
            </div>

            <Button className='text-sm! px-6! py-2! min-h-12! ' title='22 Chef Reviews' />
        </div>


    )
}

export default RestaurantsDetails
