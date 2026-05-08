import Button from '@/components/Button'
import Link from 'next/link'
import React from 'react'

const RestaurantsButtons = () => {
    return (
        <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2 mb-14 max-sm:mb-0 xl:-mt-14 py-8 max-xl:flex-wrap ">
            <Button title='WEBSITE' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
            <Link href="/review-1">
                <Button title='ADD REVIEW' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
            </Link>
            <Button title='VIEW MENU ' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
        </div>
    )
}

export default RestaurantsButtons
