import React from 'react'

const RestaurantsFeatures = () => {
    const features = [
        ["Outdoor seating", "Accepts reservations"],
        ["Accepts credit cards", "Delivery"],
        ["Kid friendly", "Wheelchair accessible"],
        ["Take-out", "Wifi"],
        ["Pet-friendly"],
    ];
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm ">
            {features.map((row, idx) => (
                <React.Fragment key={idx}>
                    {row.map((item) => (
                        <div key={item} className="flex  gap-3 items-center justify-start">
                            <span className="text-2xl leading-none font-bold">
                                •
                            </span>
                            <span className="text-sm font-bold tracking-[2%]">
                                {item}
                            </span>
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    )
}

export default RestaurantsFeatures
