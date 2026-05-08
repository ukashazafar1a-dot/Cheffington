import React from 'react'

const ChefReviewCard = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 pb-8 sm:pb-10 border-b  last:border-0 last:pb-0">
            {/* Reviewer */}
            <div className="sm:w-32 shrink-0 flex flex-row sm:flex-col xl:items-center max-md:justify-start justify-center gap-4 ">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-300 rounded-full shrink-0" />
                <div className="flex flex-col items-center max-md:justify-center gap-1">
                    <p className="text-sm font-bold leading-tight tracking-[2%]">Jane Doe</p>
                    <p className=" text-sm font-bold uppercase underline leading-tight tracking-[2%]">
                        Restaurant
                    </p>
                    <p className="text-sm  text-[#FF8400] font-bold underline leading-tight tracking-[2%]">
                        14 Reviews
                    </p>
                </div>
            </div>

            {/* Review Content */}
            <div className="flex-1">
                <h3 className="font-bold text-xl  leading-tight tracking-[2%]">
                    Title of Review
                </h3>
                <p className=" font-normal md:mb-10 mb-4 uppercase text-xl  leading-tight tracking-[2%]">
                    Month XX, YEAR
                </p>
                <p className="md:text-xl text-sm leading-relaxed text-justify font-bold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo metus vitae urna eleifend,
                    a tristique sapien fringilla. Aliquam scelerisque ante tellus, eget consequat mi sollicitudin vel.
                    Duis viverra semper mauris. Pellentesque iaculis purus sollicitudin ligula cursus vestibulum.
                    Integer aliquam urna vitae porta ultrices. Fusce aliquam odio vel nunc lacinia volutpat ac non diam.
                </p>
            </div>
        </div>
    );
}

export default ChefReviewCard
