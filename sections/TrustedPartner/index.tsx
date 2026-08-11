"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSupabase } from "@/context/supabaseContext";
import Image from "next/image";
import { elderly_right, family, mission } from "@/assets/images/cover";
import { TableRow } from "@/@types/database.types";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type FeatureRow = TableRow<"features">;

export function TrustedPartner() {
  const t = useTranslations("trusted");
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();

  const [data, setData] = useState<FeatureRow[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });

  useEffect(() => {
    if (isVisible && !hasFetched) {
      fetchLocalizedTable("features", locale)
        .then((rows) => {
          setData(rows);
          setHasFetched(true);
        })
        .catch(() => {});
    }
  }, [isVisible, hasFetched, fetchLocalizedTable, locale]);

  return (
    <section
      ref={ref}
      className="w-full bg-[#E1E3E6] py-10 lg:py-14 max-w-[95%] mx-auto rounded-lg min-h-[30rem]"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 rounded-xl overflow-visible relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Text Content (Left) */}
          <div>
            {!hasFetched ? (
              <>
                <Skeleton height={32} width="60%" className="mb-3" />
                <Skeleton height={16} width="80%" className="mb-6" />
                <div className="space-y-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                        <Skeleton circle width={20} height={20} />
                      </div>
                      <div>
                        <Skeleton height={14} width={120} className="mb-1" />
                        <Skeleton height={10} width={200} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
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
                        <h3 className="font-semibold text-sm md:text-base text-gray-900">
                          {f.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Images (Right) */}
          <div className="grid grid-cols-2 gap-3 relative justify-items-end">
            {/* First Image */}
            <div className="col-span-2 overflow-hidden rounded-lg h-[18rem] sm:h-[22rem] md:h-[26rem] hidden sm:block
  md:-translate-y-6 lg:-translate-y-28 xl:-translate-y-14 transform">
              <Image
                src={family}
                alt="Family running"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover rounded-lg shadow"
              />
            </div>

            {/* Second Image */}
            <div className="col-span-1 lg:absolute lg:left-0 lg:-bottom-[14rem] lg:w-[50%] aspect-square rounded-lg overflow-hidden hidden sm:block 
  md:-translate-y-6 lg:-translate-y-24 xl:-translate-y-14 transform">
              <Image
                src={mission}
                alt="Mission"
                width={400}
                height={400}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Third Image */}
            <div className="col-span-1 lg:absolute lg:right-0 lg:-bottom-[8rem] lg:w-[45%] lg:h-[8rem] rounded-lg overflow-hidden hidden sm:block 
  md:-translate-y-4 lg:-translate-y-24 xl:-translate-y-10 transform">
              <Image
                src={elderly_right}
                alt="Elderly"
                width={400}
                height={200}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
