
import ChefReviewCard from '../../_components/ChefReviewCard'
import ChefButton from './ChefButtons'

const ChefReviewForRestaurants = () => {
    return (
        <div className='xl:w-[68%] w-full max-w-full'>
            <h1 className="subtitle ">Chef Notes</h1>
            <ChefButton />
            <div className="border-2 border-black rounded-3xl p-4 md:p-8 space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <ChefReviewCard key={i} />
                ))}

            </div>
        </div>
    )
}

export default ChefReviewForRestaurants
