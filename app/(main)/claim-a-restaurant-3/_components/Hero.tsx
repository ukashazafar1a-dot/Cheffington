const Hero = ({ restaurantName }: { restaurantName?: string }) => {
    return (
        <div className="text-center md:mb-16 mb-8">
            <h1 className="title md:mb-8 mb-4">
                Claim Request <span className="text-[#FF8400]">Submitted</span>
            </h1>

            <p className="body-text">
                We received your claim application
                {restaurantName ? (
                  <>
                    {" "}for <span className="font-semibold">{restaurantName}</span>.
                  </>
                ) : (
                  "."
                )}{" "}
                Our admin team will review your details and update you soon.
            </p>
        </div>

    )
}

export default Hero
