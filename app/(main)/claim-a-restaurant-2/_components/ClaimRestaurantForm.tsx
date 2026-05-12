import Button from '@/components/Button'
import Link from 'next/link'
const ClaimRestaurantForm = () => {
    return (
        <div className='page-width-narrow max-sm:px-0!'>
            <form>
                <div className="mb-5.5">
                    <label className="block mb-5 text-lg font-medium! ">Username or Email Address</label>
                    <input type="email" placeholder="" className="input-field border! border-black bg-[#EFEFEF]" />
                </div>
                <div className="mb-5.5">
                    <label className="block mb-5 text-lg font-medium! ">Username or Email Address</label>
                    <input type="email" placeholder="" className="input-field border! border-black bg-[#EFEFEF]" />
                </div>
                <div className="mb-5.5">
                    <label className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                        <input type="checkbox" className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color" />
                        <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">Takes Reservations</span>
                    </label>
                </div>
                <Link href="/claim-a-restaurant-3">
                <Button className='w-full!' title='Send'  />
                </Link>
                <div className='flex items-center justify-between mt-5.5 gap-1 gap-y-4 flex-wrap'>
                    <div className='body-text'>Not a member?  <a href='/join-2-create-profile' className='underline underline-offset-2  '>Sign up here. </a></div>
                    <a href='' className='underline underline-offset-2 body-text'>Forgot password?</a>

                </div>
            </form>
        </div>
    )
}

export default ClaimRestaurantForm
