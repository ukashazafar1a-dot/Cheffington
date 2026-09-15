export default function LaunchingSoonBanner() {
  return (
    <section className="page-width py-6 md:py-10">
      <div className="rounded-3xl border-2 border-black bg-white px-6 py-8 text-center shadow-[6px_6px_0_0_#000] md:px-12 md:py-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8400] md:text-sm">
          Coming soon
        </p>
        <h2 className="mb-4 text-3xl font-black tracking-tight text-black md:text-5xl">
          Launching Soon
        </h2>
        <p className="mx-auto max-w-2xl text-base text-black/80 md:text-xl">
          Cheffington is not live yet. Please do not place orders, submit
          payments, or treat this site as open for business.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-black/70 md:text-base">
          You&apos;re welcome to look around — just know listings, ads, and
          checkout are still in preview until we officially launch.
        </p>
      </div>
    </section>
  );
}
