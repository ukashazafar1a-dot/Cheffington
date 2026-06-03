import CodeField from './CodeField'
import Hero from './Hero'


const ClaimRestaurantForm = ({
  claimId,
  restaurantName,
}: {
  claimId?: string;
  restaurantName?: string;
}) => {
    return (
        <div className="flex flex-col items-center py-10 md:py-16  font-sans text-black">
            <div className='page-width'>
                <Hero restaurantName={restaurantName} />
                <CodeField claimId={claimId} />
            </div>
        </div>
    )
}

export default ClaimRestaurantForm
