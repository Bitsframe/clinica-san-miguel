"use client";

import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { mission as missionImage } from "@/assets/images/cover";
import Image from "next/image";

export const CommunityMission = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const { mission, mission_es } = useSupabase();

  const data = locale === "es" ? mission_es : mission;

  return (
    <section className="bg-[#0F172A] text-white rounded-2xl px-6 py-12 md:px-10 md:py-16 w-full mx-auto flex flex-col lg:flex-row gap-10 max-w-[75vw] sm:px-0 sm:py-0">
      {/* Left Side - Mission */}
      <div className="flex-1 space-y-0 relative lg:pt-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">{t("community_mission_title")}</h2>
          <p className="text-base text-gray-300 leading-relaxed">
            {t("community_mission_description")}
          </p>
        </div>

        <div className="relative w-full h-[500px] z-20 translate-y-28">
          <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src={missionImage}
              alt="Mission"
              fill
              className="object-cover rounded-xl"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Features (Dynamic from DB) */}
      <div className="flex-1 pt-40 lg:pt-8 lg:ml-24">
        <div className="space-y-12">
          {data?.sort((a, b) => a.id - b.id).map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-[67px] h-[67px] rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Image
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

        {/* <div className="mt-20">
          <button className="bg-[#C1001F] hover:bg-red-800 text-white text-base font-medium px-6 py-3 rounded-full transition w-fit">
            {t("book_your_visit")}
          </button>
        </div> */}
      </div>
    </section>
  );
};
