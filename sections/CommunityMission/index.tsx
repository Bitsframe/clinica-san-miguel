"use client";

import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { mission as missionImage } from "@/assets/images/cover";

import  SafeImage from "@/components/SafeImage"

export const CommunityMission = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const { mission, mission_es } = useSupabase();

  const data = locale === "es" ? mission_es : mission;

  return (
<section className="bg-[#0F172A] text-white py-12 md:py-20 rounded-2xl mt-8 mx-4 sm:mx-0">

      <div className="container mx-auto px-4 md:px-10 lg:px-16 flex flex-col lg:flex-row gap-10">
        {/* Left Side - Mission */}
        <div className="flex-1 space-y-0 relative lg:pt-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t("community_mission_title")}</h2>
            <p className="text-base text-gray-300 leading-relaxed">
              {t("community_mission_description")}
            </p>
          </div>

        <div className="relative w-full h-[500px] z-20 hidden sm:block sm:translate-y-28">


            <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
              <SafeImage
                src={missionImage}
                alt="Mission"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="flex-1 pt-8 lg:pt-8 lg:ml-24">

          <div className="space-y-12">
            {data?.sort((a, b) => a.id - b.id).map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-[67px] h-[67px] rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <SafeImage
                    src={item.Icon}
                    alt={item.Title}
                    width={24}
                    height={24}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-lg text-white">{item.Title}</h3>
                  <p className="text-sm text-gray-400">{item.Text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button if needed in future */}
          {/* <div className="mt-20">
            <button className="bg-[#C1001F] hover:bg-red-800 text-white text-base font-medium px-6 py-3 rounded-full transition w-fit">
              {t("book_your_visit")}
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
};