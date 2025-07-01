"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { mission as missionImage } from "@/assets/images/cover";
import Image from "next/image";
import { TableRow } from "@/@types/database.types";
import { useLazyLoad } from "@/hooks/useLazyLoad";  

type MissionRow = TableRow<"Mission">;

export default function CommunityMission() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();

  const [data, setData] = useState<MissionRow[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Using useLazyLoad hook
  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });

  useEffect(() => {
    if (isVisible && !hasFetched) {
      fetchLocalizedTable("Mission", locale)
        .then((rows) => {
          setData(rows);
          setHasFetched(true);
          console.log("✅ CommunityMission data fetched");
        })
        .catch((err) => console.error("CommunityMission fetch error:", err));
    }
  }, [isVisible, hasFetched, fetchLocalizedTable, locale]);

  return (
    <section
      ref={ref}  // Adding ref here to track visibility for lazy loading
      className="bg-[#0F172A] text-white py-12 md:py-8 rounded-2xl mt-8 mx-4 sm:mx-0"
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-16 flex flex-col lg:flex-row gap-10">
        {/* Left side */}
        <div className="flex-1 space-y-0 relative lg:pt-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {t("community_mission_title")}
            </h2>
            <p className="text-base text-gray-300 leading-relaxed">
              {t("community_mission_description")}
            </p>
          </div>
          <div className="relative w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1600px] mx-auto 
              h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] xl:h-[100vh] 2xl:h-[110vh] z-20 hidden sm:block sm:translate-y-20">
            <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={missionImage}
                alt="Mission"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 pt-8 lg:pt-8 lg:ml-24">
          <div className="space-y-12">
            {data
              ?.sort((a, b) => a.id - b.id)
              .map((item) =>
                item.Icon ? (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-[67px] h-[67px] rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Image
                        src={item.Icon}
                        alt={item.Title ?? ""}
                        width={24}
                        height={24}
                
                        className="object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-lg text-white">
                        {item.Title}
                      </h3>
                      <p className="text-sm text-gray-400">{item.Text}</p>
                    </div>
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
