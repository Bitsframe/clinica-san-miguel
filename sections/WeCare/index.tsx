"use client";

import Image from "next/image";
import { elderly_left, elderly_right } from "@/assets/images/cover";
import { useTranslations } from "next-intl";

export function WeCare() {
  const t = useTranslations("wecare");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-20 lg:px-32 mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("heading")}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {t("paragraph")}
            </p>
          </div>

          <div className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow">
            <Image
              src={elderly_right}
              alt="Elderly woman with caregiver"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow">
            <Image
              src={elderly_left}
              alt="Doctor performing check-up"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              {t("sub_heading")}
            </h3>
            <p className="text-gray-600 text-base md:text-lg">
              {t("sub_paragraph")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
