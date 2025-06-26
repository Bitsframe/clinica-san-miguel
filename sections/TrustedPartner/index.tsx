"use client";

import React from "react";
import { DollarSign } from "lucide-react"; 
import { useSupabase } from "@/context/supabaseContext"; 
import { useTranslations, useLocale } from "next-intl";
import SafeImage from "@/components/SafeImage"; 
import { elderly_right, family, mission } from "@/assets/images/cover"; 

export function TrustedPartner() {
  const t = useTranslations("trusted");
  const locale = useLocale();  
  const { features, features_es } = useSupabase(); 
  

  const data = locale === "es" ? features_es : features;
 

  return (
<section className="w-full bg-[#E1E3E6] py-16 lg:mt-20 max-w-[90%] mx-auto rounded-xl min-h-[40rem] pb-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 rounded-xl overflow-visible relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start lg:ml-0">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("heading")}
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-xl">
              {t("paragraph")}
            </p>

            <div className="space-y-6">
              {data.map((f, i) => ( // Map over the fetched data
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-[#C1001F] rounded-full w-10 h-10 flex items-center justify-center">
                    <SafeImage
                      src={f.icon}  
                      alt={`Icon for ${f.title}`}
                      className="w-8 h-8"  // Adjust the size as needed
                    />

                  </div>
                  <div>
                    <h4 className="font-semibold text-base md:text-lg text-gray-900 lg:text-2xl">
                      {f.title}
                    </h4>
                    <p className="text-sm text-gray-600 lg:text-xl">{f.description}</p> {/* Display description */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative justify-items-end">
            {/* First Image */}
            <div className="col-span-2 overflow-hidden mt-10 sm:mt-10 lg:-mt-40 rounded-xl h-[20rem] sm:h-[25rem] md:h-[31.25rem] lg:h-[37.5rem] xl:h-[30rem] hidden sm:block">
              <SafeImage
                src={family}
                alt="Family running"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>

            {/* Second Image */}
            <div className="col-span-1 sm:col-span-1 lg:absolute lg:left-0 lg:-bottom-[21rem] lg:w-[50%] aspect-square lg:aspect-square rounded-xl overflow-hidden hidden sm:block">
              <SafeImage
                src={mission}
                alt="Mission"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Third Image */}
            <div className="col-span-1 sm:col-span-1 lg:absolute lg:right-0 lg:-bottom-[11rem] lg:w-[45%] lg:h-[10rem] lg:ml-4 aspect-square lg:aspect-auto rounded-xl overflow-hidden hidden sm:block">
              <SafeImage
                src={elderly_right}
                alt="Elderly"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
