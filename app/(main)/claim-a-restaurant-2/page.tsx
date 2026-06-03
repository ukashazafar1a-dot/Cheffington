import { Suspense } from "react";
import ClaimRestaurantForm from "./_components/ClaimRestaurantForm";
import Hero from "./_components/Hero";



const page = () => {
    return (
        <div className="lg:py-24 md:py-14 py-12">
            <div className="page-width">
                <Hero />
                <Suspense fallback={<p className="text-neutral-800">Loading form...</p>}>
                  <ClaimRestaurantForm />
                </Suspense>
            </div>
        </div>
    );
};

export default page;