"use client";

import Image from "next/image";
import { DollarSign, DoorOpen, Users, MapPin } from "lucide-react";
import { elderly_right, family, mission } from "@/assets/images/cover";
import { useTranslations } from "next-intl";

export function TrustedPartner() {
  const t = useTranslations("trusted");

  const features = [
    {
      icon: <DollarSign className="w-5 h-5 text-white" />,
      title: t("features.affordable_title"),
      desc: t("features.affordable_desc"),
    },
    {
      icon: <DoorOpen className="w-5 h-5 text-white" />,
      title: t("features.welcoming_title"),
      desc: t("features.welcoming_desc"),
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: t("features.community_title"),
      desc: t("features.community_desc"),
    },
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      title: t("features.locations_title"),
      desc: t("features.locations_desc"),
    },
  ];

  return (
    <section className="w-full max-w-[90vw] bg-[#E1E3E6] px-6 py-16 md:px-20 lg:px-32 rounded-3xl mx-6 overflow-visible relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("heading")}
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-xl">
            {t("paragraph")}
          </p>

          <div className="space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-[#C1001F] rounded-full w-10 h-10 flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-base md:text-lg text-gray-900">
                    {f.title}
                  </h4>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative">
          <div className="col-span-2 overflow-hidden -mt-32 rounded-xl h-[18.75rem] sm:h-[25rem] md:h-[31.25rem] lg:h-[37.5rem] xl:h-[30rem]">
            <Image
              src={family}
              alt="Family running"
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="absolute left-0 -bottom-64 rounded-xl overflow-hidden w-[20rem] h-[10rem] sm:h-[12rem] md:h-[13.5rem] lg:h-[15rem]">
            <Image
              src={mission}
              alt="Mission"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="absolute right-0 -bottom-44 w-[6rem] h-[4rem] sm:w-[8rem] sm:h-[5rem] md:w-[15rem] md:h-[10rem] rounded-xl overflow-hidden">
            <Image
              src={elderly_right}
              alt="Elderly"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
