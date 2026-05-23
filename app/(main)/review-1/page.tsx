import { notFound } from "next/navigation";
import { getPublishedRestaurant } from "@/lib/api-client";
import Hero from "./_components/Hero";
import ReviewFrom from "./_components/ReviewFrom";

type Props = {
  searchParams: Promise<{ restaurantId?: string }>;
};

export default async function ReviewFormPage({ searchParams }: Props) {
  const { restaurantId } = await searchParams;

  if (!restaurantId) {
    notFound();
  }

  let restaurantName: string | undefined;
  try {
    const res = await getPublishedRestaurant(restaurantId);
    restaurantName = res.data.name;
  } catch {
    notFound();
  }

  return (
    <div className="py-10 md:pb-44 md:pt-20">
      <div className="page-width-narrow">
        <Hero />
        <ReviewFrom restaurantId={restaurantId} restaurantName={restaurantName} />
      </div>
    </div>
  );
}
