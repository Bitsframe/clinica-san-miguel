"use client";
import { direction } from "@/assets/images";
import { Button, OutlinedButton } from "@/utils";
import Image from "next/image";
import { Map } from "../Map";
import { useRouter } from "next/navigation";

export const Location = ({
  id,
  locationName,
  number,
  route,
  location,
  distanceMiles,
}: {
  id: number | null;
  locationName: string | null;
  number: string | null;
  route: string | null;
  location: string | null;
  distanceMiles?: number;
}) => {
  const router = useRouter();

  const handleLocation = () => {
    router.push(`/contact/${id}`);
  };

  return (
    location && (
      <article className="w-[320px] sm:w-[350px] h-[200px] my-4 lg:mx-10">
        <div className="relative w-full h-[120px] rounded-t-[5px]">
          <div className="h-[100px] w-[320px] sm:w-[350px]">
            <Map height={120} location={location} />
          </div>
          <div className="absolute bottom-3 right-3 z-20">
            <Image
              src={direction}
              alt={"direction arrow"}
              className="w-[33px] aspect-auto"
            />
          </div>
        </div>
        <article className="bg-[#FFFFFF] flex p-4 justify-between min-h-[80px] rounded-b-[5px]">
          <div className="flex flex-col gap-0.5 text-left max-w-[55%]">
            <h4 className="text-[16px] text-[#626262] font-poppins">
              {locationName}
            </h4>
            {distanceMiles != null && (
              <span className="text-[12px] font-poppins text-[#C1001F]">
                ~{distanceMiles} mi
              </span>
            )}
          </div>
          <article className="flex flex-col items-center  bg-white justify-center gap-2 ">
            <button
              className={`rounded-[10px] font-poppins flex justify-center items-center text-[14px] md:text-[17px] text-opacity-8`}
              style={{
                width: "130px",
                height: "30px",
                backgroundColor: "#19192C",
                color: "#FFFFFF",
              }}
              onClick={handleLocation}
            >
              Appointment
            </button>
            <button
              className={`rounded-[10px] font-poppins flex justify-center items-center text-[14px] md:text-[16px] bg-transparent text-opacity-8`}
              style={{
                width: "130px",
                height: "30px",
                color: "#19192C",
                border: `2px solid #19192C`,
              }}
            >
              {number}
            </button>
          </article>
        </article>
      </article>
    )
  );
};
