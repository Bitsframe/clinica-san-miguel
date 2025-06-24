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
    <section className="w-full bg-[#E1E3E6] py-16 lg:mt-20 max-w-[90%] mx-auto rounded-xl h-[40rem]">
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

          <div className="grid grid-cols-2 gap-4 relative justify-items-end">
            {/* First Image */}
            <div className="col-span-2 overflow-hidden mt-10 sm:mt-10 lg:-mt-40 rounded-xl h-[20rem] sm:h-[25rem] md:h-[31.25rem] lg:h-[37.5rem] xl:h-[30rem] hidden sm:block">

              <Image
                src={family}
                alt="Family running"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>

            {/* Second Image */}
           <div className="col-span-1 sm:col-span-1 lg:absolute lg:left-0 lg:-bottom-[21rem] lg:w-[50%] aspect-square lg:aspect-square rounded-xl overflow-hidden hidden sm:block">

              <Image
                src={mission}
                alt="Mission"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Third Image */}
           <div className="col-span-1 sm:col-span-1 lg:absolute lg:right-0 lg:-bottom-[11rem] lg:w-[45%] lg:h-[10rem] lg:ml-4 aspect-square lg:aspect-auto rounded-xl overflow-hidden hidden sm:block">

              <Image
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
