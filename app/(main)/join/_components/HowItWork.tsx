import Button from '@/components/Button';
const HowItWork = () => {

    const steps = [
        {
            number: 1,
            text: "Create a profile.",
            link: "/join-2-create-profile",
        },
        {
            number: 2,
            text: "Enter your professional email or upload a recent restaurant pay stub",
            link: false,
        },
        {
            number: 3,
            text: "Receive verification",
            link: false,
        },
        {
            number: 4,
            text: "Share your love for your favorite restaurants",
            link: false,
        },
    ];

    return (
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block relative mb-6 page-width-narrow mb0">
                <h2 className="text-[40px] tracking-tight border-b-2 border-black pb-4">
                    How it Works
                </h2>

            </div>
            <p className="md:text-[33px] text-xl leading-relaxed tracking-tight text-black/80 md:mt-12 mt-6 mb-6 md:mb-12">
                Cheffington is a place for chefs to share their love of their
                favorite eateries across the globe. No bad reviews, only great food.
            </p>

            <div className="flex flex-col items-center  w-full max-w-2xl md:gap-14 gap-8">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="flex flex-col items-center group md:gap-14 gap-8"
                    >
                        <div className="border border-black rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="md:text-[33px] text-xl font-bold text-black">
                                {step.number}
                            </span>
                        </div>
                        {step.link ? (
                            <a
                                href="/join-2-create-profile"
                                className=" md:text-[33px] text-xl  text-black group-hover:text-[#FF8400] transition-colors underline decoration-black/10 decoration-2 underline-offset-4 group-hover:decoration-[#FF8400]"
                            >
                                {step.text}
                            </a>
                        ) : (
                            <p className="md:text-[33px] text-xl tracking-tight text-black leading-snug px-4 md:px-0">
                                {step.text}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className=" mt-8 md:mt-12 ">
                <Button title="Get Started" href='/join-2-create-profile' />
            </div>
        </section>
    )
}

export default HowItWork
