import ClaimRestaurantForm from "./_components/ClaimRestaurant";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ClaimPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const claimId =
    typeof params.claimId === "string" ? params.claimId : undefined;
  const restaurantName =
    typeof params.restaurantName === "string" ? params.restaurantName : undefined;

  return (
    <ClaimRestaurantForm claimId={claimId} restaurantName={restaurantName} />
  );
};

export default ClaimPage;