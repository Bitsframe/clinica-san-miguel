"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import {
  mission,
  elderly_left,
  elderly_right,
  family,
  HomeBackground,
  doctor,
} from "@/assets/images/cover";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function AboveFooter() {
  const t = useTranslations("above_footer");
  const router = useRouter();

  return (
    <section className="relative w-full bg-white py-12 px-4 flex justify-center items-center overflow-visible mt-20">
      <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] bg-[#0F172A] text-white rounded-2xl px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-14 lg:py-16 lg:h-[30rem] overflow-visible">

        {/* ✅ Text Content */}
        <div className="max-w-xl z-10 relative px-2 sm:px-4 md:px-6 lg:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight md:leading-snug mb-4">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:leading-relaxed">
            {t("description")}
          </p>

          {/* ✅ Buttons */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="bg-[#C1001F] hover:bg-red-800 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full text-sm font-medium"
            >
              {t("cta_book")}
            </button>
            {/* <button className="border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-[#0F172A] transition">
              {t("cta_find")}
            </button> */}
          </div>

          {/* ✅ Rating */}
          <div className="flex items-center gap-2 text-sm text-white">
            <div className="flex gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <AiFillStar key={idx} size={16} />
              ))}
            </div>
            <span className="text-white">{t("reviews")}</span>
          </div>
        </div>

        {/* Floating Images - Hidden on phones (sm) and visible on larger screens (lg) */}
         <div className="hidden lg:block">
          <Image
            src={elderly_left}
            alt="img1"
            className="absolute -top-4 right-[20%] w-24 h-24 object-cover rounded-xl"
          />
          <Image
            src={family}
            alt="img2"
            className="absolute -top-8 right-[5%] w-36 h-40 object-cover rounded-xl"
          />
          <Image
            src={mission}
            alt="img3"
            className="absolute top-[48%] right-[17%] w-24 h-24 object-cover rounded-xl"
          />
          <Image
            src={elderly_right}
            alt="img4"
            className="absolute top-[52%] right-[5%] w-28 h-28 object-cover rounded-xl"
          />
          <Image
            src={HomeBackground}
            alt="img5"
            className="absolute -bottom-6 right-[23%] w-32 h-32 object-cover rounded-xl"
          />
          <Image
            src={doctor}
            alt="img6"
            className="absolute -bottom-6 right-[15%] w-16 h-16 object-cover rounded-xl"
          />
        </div>

        
      </div>
    </section>
  );
}
