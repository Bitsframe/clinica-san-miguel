"use client";

import { useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineMap } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export const LocationDetailedCard = ({
  id,
  name,
  address,
  phone,
  onMapClick,
}: {
  id: number | null;
  name: string | undefined | null;
  address: string | undefined | null;
  phone?: string | null;
  onMapClick?: () => void;
}) => {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);

  const handleLocation = () => {
    router.push(`/contact/${id}`);
  };
  const t = useTranslations("location_buttons");

  return (
    <>
      <main className="bg-[#FFFEFC] rounded-[13px] min-w-[320px] w-full max-w-2xl min-h-56 sm:min-h-44 py-4 sm:py-3 flex flex-col gap-0 justify-start relative pl-4 sm:pl-6 lg:pl-8">
        {/* Added padding on mobile (pl-4), tablets and up (sm:pl-6), and laptops (lg:pl-8) */}

        <h4 className="font-poppins font-normal text-[16px] leading-[100%] tracking-[0] text-[#1B2432] mb-0 pb-0">
          {name || "Clinica San Miguel Dallas, TX Office"}
        </h4>

        <div className="flex w-full items-start justify-between pt-0 mt-6">
          <article className="flex flex-col justify-start gap-2">
            <div className="flex justify-start items-center gap-2">
              <BsTelephone className="text-[#C1001F] w-[18px] h-[18px]" />
              <p className="font-poppins font-normal text-[13px] leading-[100%] tracking-[0] text-[#1B2432]">
                {phone || "682-327-1695"}
              </p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <HiOutlineMap className="text-[#C1001F] w-[18px] h-[18px]" />
              <p className="font-poppins font-normal text-[13px] leading-[100%] tracking-[0] text-[#1B2432]">
                {address || "787 E Park Row Dr, Arlington, TX 76010"}
              </p>
            </div>
          </article>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full pb-32 sm:pb-0">
  <button
    onClick={handleLocation}
    className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-[#C1001F] text-white text-[13px] font-normal font-poppins rounded-full hover:bg-[#a6001a] transition"
  >
    {t("viewDetails")} <span className="text-[15px]">→</span>
  </button>

  <button
    onClick={() => setShowMap(true)}
    className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 border border-[#6C7582] text-[#6C7582] text-[13px] font-normal font-poppins rounded-full hover:bg-[#f4f5f6] transition"
  >
    {t("getDirections")} <span className="text-[15px]">→</span>
  </button>
</div>

      </main>

      {showMap && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-[90vw] max-w-2xl relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-3 text-black text-2xl font-bold"
            >
              ✕
            </button>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(address || "")}&output=embed`}
              height="400"
              className="w-full rounded-md"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </>
  );
};
