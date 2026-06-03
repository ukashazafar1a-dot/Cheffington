import HeroTitle from '@/components/HeroTitle'

const Hero = () => {
    return (
        <>
            <HeroTitle className='mb-8'
                title={
                    <>
                        Submit Your <span style={{ color: "#ff8400" }}>Claim</span> Details
                    </>
                }
                subtitle={
                    <>
                        By claiming your business, you agree <br /> to our{" "}
                        <a className="underline decoration-3 underline-offset-2" href="/terms">terms</a> and{" "}
                        <a className="underline decoration-3 underline-offset-2" href="/privacy-policy">privacy policy</a>.
                    </>
                }
            />
        </>

    )
}

export default Hero
