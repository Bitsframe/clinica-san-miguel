"use client";

import { ImPhone } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { HiOutlineMap } from "react-icons/hi";
import { BsTelephone } from "react-icons/bs";
import { useRouter } from "next/navigation";

export const LocationDetailedCard = ({
  id,
  name,
  address,
  phone,
}: {
  id: number | null;
  name: string | undefined | null;
  address: string | undefined | null;
  phone?: string | null;
}) => {
  const router = useRouter();

  const handleLocation = () => {
    router.push(`/contact/${id}`);
  };

  return (
  <main className="bg-[#FFFEFC] rounded-[13px] min-w-[320px] w-full max-w-2xl min-h-[179px] px-[10px] pt-[16px] pb-[10px] flex flex-col gap-0 justify-start relative">

    <h4 className="font-poppins font-normal text-[16px] leading-[100%] tracking-[0] text-[#1B2432]  mb-0 pb-0 ">
        {name || "Clinica San Miguel Dallas, TX Office"}
      </h4>

      <div className="flex w-full items-start justify-between pt-0  mt-6 ">

        <article className="flex flex-col justify-start gap-2">
          <div className="flex justify-start items-center gap-2">
            {/* <ImPhone className="text-[25px] text-[#3D3D3C]" /> */}

            <BsTelephone className="text-[#C1001F] w-[18px] h-[18px]" />

            <p className="font-poppins font-normal text-[13px] leading-[100%] tracking-[0] text-[#1B2432]">
              {phone || "682-327-1695"}
            </p>
          </div>
          <div className="flex justify-start items-center gap-2">
            {/* <FaMapLocationDot className="text-[25px] text-[#3D3D3C]" /> */}
            <HiOutlineMap className="text-[#C1001F] w-[18px] h-[18px]" />
           <p className="font-poppins font-normal text-[13px] leading-[100%] tracking-[0] text-[#1B2432]">
              {address || "787 E Park Row Dr, Arlington, TX 76010"}
            </p>
          </div>
        </article>

        
        {/* <div
          onClick={handleLocation}
          className="flex justify-center items-center text-[25px] text-white bg-black rounded-full w-[40px] h-[40px] cursor-pointer"
        >
          <IoIosArrowForward />
        </div> */}
      </div>

        <div className="flex flex-wrap gap-4 mt-4">
    <button className="flex items-center gap-2 px-6 py-3 bg-[#C1001F] text-white text-[13px] font-normal font-poppins rounded-full hover:bg-[#a6001a] transition">
      View Details <span className="text-[15px]">→</span>
    </button>

    <button className="flex items-center gap-2 px-6 py-3 border border-[#6C7582] text-[#6C7582] text-[13px] font-normal font-poppins rounded-full hover:bg-[#f4f5f6] transition">
      Get Directions <span className="text-[15px]">→</span>
    </button>
  </div>
    </main>
  );
};
