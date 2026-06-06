"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import {
  elderly_left,
  elderly_right,
  family,
  HomeBackground,
  doctor,
} from "@/assets/images/cover";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const collageImages = [
  { src: elderly_left, alt: "Doctor with patient", className: "col-span-1 row-span-1" },
  { src: family, alt: "Family outdoors", className: "col-span-2 row-span-2" },
  { src: elderly_right, alt: "Care conversation", className: "col-span-1 row-span-2" },
  { src: HomeBackground, alt: "Parent and child", className: "col-span-2 row-span-1" },
  { src: doctor, alt: "Medical team", className: "col-span-1 row-span-1" },
];

export function AboveFooter() {
  const t = useTranslations("above_footer");
  const router = useRouter();

  return (
    <section className="relative w-full bg-white py-12 px-4 sm:px-6 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-[#0F172A] text-white rounded-2xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins leading-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-inter leading-relaxed mb-6">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="bg-[#C1001F] hover:bg-[#a30019] text-white px-8 py-3 rounded-full text-sm font-semibold font-poppins transition-colors"
              >
                {t("cta_book")}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <AiFillStar key={idx} size={16} />
                ))}
              </div>
              <span className="text-gray-200 font-poppins">{t("reviews")}</span>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-4 grid-rows-3 gap-2.5 h-[240px] md:h-[280px] lg:h-[300px] w-full max-w-lg lg:max-w-none lg:ml-auto">
            {collageImages.map(({ src, alt, className }) => (
              <div
                key={alt}
                className={`relative rounded-xl overflow-hidden border border-white/10 ${className}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
