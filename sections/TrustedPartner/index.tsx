"use client";

import React from "react";
import { DollarSign } from "lucide-react"; 
import { useSupabase } from "@/context/supabaseContext"; 
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { elderly_right, family, mission } from "@/assets/images/cover"; 

export function TrustedPartner() {
  const t = useTranslations("trusted");
  const locale = useLocale();  
  const { features, features_es } = useSupabase(); 

  

  const data = locale === "es" ? features_es : features;


 

  return (
<section className="w-full bg-[#E1E3E6] py-10 lg:py-14 max-w-[95%] mx-auto rounded-lg min-h-[30rem]">
  <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 rounded-xl overflow-visible relative">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Text Content */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {t("heading")}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-lg">
          {t("paragraph")}
        </p>

        <div className="space-y-5">
          {data.map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="bg-[#C1001F] rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <Image
                  src={f.icon || ""}
                  alt={`Icon for ${f.title}` || ""}
                  width={24}
                  height={24}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm md:text-base text-gray-900">
                  {f.title}
                </h4>
                <p className="text-xs text-gray-600">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-3 relative justify-items-end">
        {/* First Image */}
        <div className="col-span-2 overflow-hidden rounded-lg h-[18rem] sm:h-[22rem] md:h-[26rem] hidden sm:block
  md:-translate-y-6 lg:-translate-y-28 xl:-translate-y-14 transform">
          <Image
            src={family}
            alt="Family running"
            width={300}
            height={200}
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>

        {/* Second Image */}
       <div className="col-span-1 lg:absolute lg:left-0 lg:-bottom-[14rem] lg:w-[50%] aspect-square rounded-lg overflow-hidden hidden sm:block 
  md:-translate-y-6 lg:-translate-y-24 xl:-translate-y-14 transform">

          <Image
            src={mission}
            alt="Mission"
            width={300}
            height={200}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Third Image */}
        <div className="col-span-1 lg:absolute lg:right-0 lg:-bottom-[8rem] lg:w-[45%] lg:h-[8rem] rounded-lg overflow-hidden hidden sm:block 
  md:-translate-y-4 lg:-translate-y-24 xl:-translate-y-10 transform">

          <Image
            src={elderly_right}
            alt="Elderly"
            width={300}
            height={200}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</section>

  );
}
