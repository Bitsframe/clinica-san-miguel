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
import { useRef, useEffect, useState } from "react";
import { GroupedLocations } from "@/sections/Locations/GroupedLocations";  

export const Hero = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const { heroSection, heroSection_es } = useSupabase();

  const data = locale === "es" ? heroSection_es[0] : heroSection[0];
  const [shouldScroll, setShouldScroll] = useState(false);

  const go_to_contact_handle = () => {
    router.push(`/contact`);
  };

   useEffect(() => {
    if (shouldScroll) {
      const timeout = setTimeout(() => {
        const target = document.getElementById("grouped-locations");
        if (target) {
          
          target.scrollIntoView({ behavior: "smooth" });
        } else {
         
        }
        setShouldScroll(false); 
      }, 100); 

      return () => clearTimeout(timeout);
    }
  }, [shouldScroll]);

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
  const [shouldScroll, setShouldScroll] = useState(false);

  const redirectToContact = () => {
    router.push(`/contact`);
  };

  useEffect(() => {
    if (shouldScroll) {
      const timeout = setTimeout(() => {
        const target = document.getElementById("grouped-locations");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        setShouldScroll(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [shouldScroll]);

  return (
   <main className="flex flex-col w-full relative">
  <article className="w-full relative min-h-[80vh] sm:min-h-screen lg:pt-4">
    <div className="w-full px-4 sm:px-6 lg:px-12">

      {/* ✅ Mobile Image (only on small screens) */}
      <div className="relative w-full mx-auto block sm:hidden h-[80vh] max-w-screen-xl overflow-hidden rounded-3xl">
        <Image
          src={HomeBackground}
          alt="Mobile Home"
          width={300}
          height={600}
          className="w-full h-full object-cover object-[60%_40%] rounded-3xl"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-3xl" />
      </div>

      {/* ✅ Tablet & Desktop Image (from sm and up) */}
      <div
        className="relative w-full mx-auto hidden sm:block
                   h-[80vh] md:h-[90vh] lg:h-[120vh] xl:h-[100vh] 2xl:h-[110vh]
                   max-w-screen-xl overflow-hidden rounded-3xl"
      >
        <Image
          src={HomeBackground}
          alt="Home Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center rounded-3xl"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-3xl" />
      </div>

      {/* ✅ Text Content (Shared) */}
      <div className="absolute z-20 top-[50%] sm:top-[55%] md:top-[50%] lg:top-[40%] left-6 sm:left-10 md:left-16 lg:left-28 text-white max-w-md space-y-4 px-2 sm:px-0">
  {/* ⭐ Star Rating */}
  <div className="flex items-center gap-2">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffbd66]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.17 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    ))}
    <span className="text-xs sm:text-sm md:text-base font-light">{t("section1_span")}</span>
  </div>

  {/* 🧭 Heading */}
  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold leading-snug">
    {t("section1_h1_part1")}{" "}
    <span className="text-[#C1001F]">{t("section_h1_h19")}</span>{" "}
    <span className="block">{t("section1_h1_part2")}</span>
  </h1>

  {/* 📖 Paragraph */}
  <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-snug text-white tracking-wide line-clamp-4">
    {t("section1_p")}
  </p>

  {/* 🖱️ Desktop Buttons */}
  <div className="hidden sm:flex flex-wrap gap-4 pt-4">
    <button
      onClick={redirectToContact}
      className="bg-[#C1001F] text-white font-medium text-sm sm:text-base py-3 px-6 rounded-full hover:bg-red-700 transition"
    >
      {t("section1_button1")}
    </button>
    <button
      onClick={() => setShouldScroll(true)}
      className="border border-white text-white font-medium text-sm sm:text-base py-3 px-6 rounded-full hover:bg-white hover:text-black transition"
    >
      {t("section1_button2")}
    </button>
  </div>
</div>


      {/* 📱 Mobile Buttons */}
      <div className="block sm:hidden w-full mt-8">
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={redirectToContact}
            className="bg-[#C1001F] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
          >
            {t("section1_button1")}
          </button>
          <button
            onClick={() => setShouldScroll(true)}
            className="bg-[#0F172A] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
          >
            {t("section1_button2")}
          </button>
        </div>
      </div>
    </div>
  </article>
</main>


  );
};
