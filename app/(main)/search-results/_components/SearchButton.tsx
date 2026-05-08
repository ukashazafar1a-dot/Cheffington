import Button from '@/components/Button'
const SearchButton = () => {
    return (
        <div className="flex flex-wrap gap-x-8 gap-y-2 max-sm:gap-x-2 mb-14 max-sm:mb-0 xl:-mt-14 py-8 max-xl:flex-wrap ">
            <Button title='Sort by' className='min-h-10! text-[20px]! px-10! min-w-36! max-sm:min-w-30!' />
            <Button title='Near me' className='min-h-10! text-[20px]! px-10! min-w-36! max-sm:min-w-30!' />
            <Button title='More filters ' className='min-h-10! text-[20px]! px-4! min-w-36! max-sm:min-w-30!' />
        </div>
    )
}

export default SearchButton
