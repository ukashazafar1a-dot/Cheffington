
import RestaurantsList from './(main)/_components/RestaurantsList'
import Hero from './(main)/_components/Hero'
import ChefRecommends from './(main)/_components/ChefRecommends'
import HomepageFeaturedAd from './(main)/_components/HomepageFeaturedAd'


const page = () => {
  return (
    <main className='w-full'>
      <Hero />
      <HomepageFeaturedAd />
      <RestaurantsList />
      <ChefRecommends />
    </main>
  )
}

export default page