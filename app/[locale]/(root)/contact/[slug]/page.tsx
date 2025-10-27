import { DetailedLocation } from "./DetailedLocation";

const LocationDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>; // ✅ Fake Promise type to satisfy .next/type check
}) => {
  const { slug } = await params;

  return <DetailedLocation slug={slug} />;
};

export default LocationDetails;
