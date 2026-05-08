import Button from '@/components/Button'

const ChefButton = () => {
    return (
        <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2  max-sm:mb-0   py-10 max-xl:flex-wrap ">
            <Button title='WEBSITE' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
            <Button title='ADD REVIEW' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
            <Button title='VIEW MENU ' className='min-h-10! text-[14px]! px-4! min-w-36! max-sm:min-w-30!' />
        </div>
    )
}

export default ChefButton
