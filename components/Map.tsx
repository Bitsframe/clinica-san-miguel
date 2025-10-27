// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface MapProps {
  location: string;
  height: number;
}

export const Map: React.FC<MapProps> = ({ height, location }) => {
  // const parts = location?.split("/");
  // const lastPart = parts[parts?.length - 1];

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  // });

  return (
    <iframe
      src={`https://www.google.com/maps/embed?pb=${location}`}
      // src={location}
      // width="350"
      height={height}
      className="w-[100%] rounded-t-[5px]"
      style={{ borderRadius: "5px 0 5px 0" }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
    // <GoogleMap
    //   mapContainerClassName="map-container"
    //   center={center}
    //   zoom={10}
    // />
  );
};

export const GroupedMap = ({
  height,
  width,
  location,
}: {
  height: number;
  width: number;
  location: string | undefined;
}) => {
  return (
    <iframe
      src={`https://www.google.com/maps/d/embed?mid=${location}`}
      // src={location}
      width={width}
      height={height}
      className="w-[100%] rounded-t-[5px]"
      style={{ borderRadius: "5px 0 5px 0" }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};
