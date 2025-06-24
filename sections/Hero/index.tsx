"use client";

import { Logo } from "@/assets/images";
// import { topSectionCover } from "@/assets/images/cover";
import { HomeBackground } from '@/assets/images/cover';

import { HeroBox } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { Button, IconButton } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FaPhoneFlip } from "react-icons/fa6";

export const Hero = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const { heroSection, heroSection_es } = useSupabase();

  const data = locale === "es" ? heroSection_es[0] : heroSection[0];

  const go_to_contact_handle = () => {
    router.push(`/contact`);
  };

  return (
    <section className="flex flex-col gap-20 justify-center md:justify-start items-center md:items-start">
      <article className="flex flex-col mt-[10%] sm:mt-[5%] md:mt-10 md:flex-row w-[95%] lg:w-[100%] justify-center items-center gap-10">
        <div className="flex flex-col items-end justify-end gap-5 w-auto order-2 md:order-1 md:w-1/2">
          <div className="w-full md:w-[95%] lg:w-[80%] xl:w-[60%] flex flex-col gap-5">
            <div className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] text-center md:text-left leading-snug font-poppins font-bold text-[#000000]">
              {data?.title}
            </div>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] text-center md:text-left font-poppins text-[#19192C] leading-relaxed break-words whitespace-normal">
              {data?.content}
            </p>

            <div className="flex gap-5 sm:gap-7 justify-center md:justify-start items-center">
              <Button
                text={t("hero_section_button")}
                size={{ width: "270px", height: "73px" }}
                route={""}
                bgColor={"#3D3D3C"}
                textColor={"#ffffff"}
                onClick={go_to_contact_handle}
              />
              <IconButton
                size={{ width: "75px", height: "75px" }}
                icon={<FaPhoneFlip />}
                bgColor="#C1001F"
                fontSize={"30px"}
                route={""}
                onClick={go_to_contact_handle}
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-[90%] flex justify-center md:justify-start order-1 md:order-2 md:w-1/2">
          <HeroBox />
        </div>
      </article>
    </section>
  );
};



export const HeroTopSection = () => {
  const t = useTranslations("home");
  const router = useRouter();

  const redirectToContact = () => {
    router.push(`/contact`);
  };

  return (
    <main className="flex flex-col relative w-full">
      <article className="w-full min-h-[80vh] sm:min-h-screen relative">
        {/* Remove padding on left and right only on large screens */}
        <div className="container mx-auto px-4 sm:px-6 lg:mx-12 lg:max-w-full relative h-full">
          
          {/* Image + Overlay + Content Layer */}
          <div className="relative w-full lg:w-[110rem]  h-[80vh] sm:h-[90vh] md:h-[100vh] lg:h-[90vh] overflow-hidden rounded-md sm:rounded-3xl">

            {/* Background Image */}
            <Image
              src={HomeBackground}
              alt="Home Background"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center rounded-md sm:rounded-3xl w-full lg:w-full lg:h-[50vh] sm:h-[90vh] md:h-[100vh]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-md sm:rounded-3xl" />

            {/* Text Content Over Image */}
           <div className="absolute inset-x-0 bottom-0 lg:top-[40%] z-20 text-white px-4 sm:px-8 flex flex-col items-start justify-start lg:justify-start pb-8 pt-12 lg:w-[45%] lg:ml-32 md:w-[60%] md:ml-16">

              {/* Star Rating */}
              <div className="flex items-center mb-2 gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffbd66]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.17 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
                <span className="text-sm sm:text-base font-extralight font-poppins">
                  {t("section1_span")}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-[22px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-snug font-inter max-w-[90%] mb-2">
                {t("section1_h1_part1")}{" "}
                <span className="block lg:block">{t("section1_h1_part2")}</span>
              </h1>

              {/* Paragraph (Clamp only on phones) */}
          <p className="text-sm sm:text-base md:text-lg leading-snug text-white w-full break-words mb-4 tracking-wide lg:line-clamp-3 sm:line-clamp-none overflow-hidden">
            {t("section1_p")}
          </p>

              {/* Desktop Buttons */}
           
          <div className="hidden sm:flex flex-wrap gap-4 lg:mt-8">
          <button
          onClick={redirectToContact}
          className="bg-[#C1001F] text-white font-medium text-[15px] md:text-[16px] py-4 px-8 rounded-full hover:bg-red-700 transition"
          >
          {t("section1_button1")}
          </button>
          <button
          className="border border-white text-white font-medium text-[15px] md:text-[16px] py-4 px-12 rounded-full hover:bg-white hover:text-black transition"
          >
          {t("section1_button2")}
          </button>
          </div>

            </div>
          </div>
        </div>
      </article>

      {/* Mobile Buttons */}
      <div className="block sm:hidden w-full bg-white pt-6 pb-8">
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={redirectToContact}
            className="bg-[#C1001F] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
          >
            {t("section1_button1")}
          </button>
          <button
            className="bg-[#0F172A] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
          >
            {t("section1_button2")}
          </button>
        </div>
      </div>
    </main>
  );
};
