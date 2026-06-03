import Link from "next/link";

const CodeField = ({ claimId }: { claimId?: string }) => {
    return (
        <div className="">
            <section className="rounded-[9px] border-3 border-black bg-[#FF8000] p-6 md:px-9.75 md:py-10">
                <h2 className="mb-4 text-2xl font-bold tracking[-8%] leading-1">
                    Application status: Pending review
                </h2>
                {claimId ? (
                    <p className="mb-3 text-lg">
                        Claim ID: <span className="font-semibold">{claimId}</span>
                    </p>
                ) : null}
                <p className="text-lg">
                    Expected review time is usually 1-3 business days. We may contact you
                    for additional proof before approval.
                </p>
            </section>
            <p className="text-[20px] mt-12 text-center tracking-[-8%] leading-normal">
                Need assistance?{" "}
                <span>
                    <Link href={'/advertising'} className="underline">Contact us.</Link>
                </span>
            </p>
        </div>
    )
}

export default CodeField
