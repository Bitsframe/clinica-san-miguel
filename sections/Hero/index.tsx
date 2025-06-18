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
    <section className=" flex flex-col gap-20 justify-center md:justify-start items-center md:items-start">
      <article className="flex flex-col mt-[10%] sm:mt-[5%] md:mt-10 md:flex-row w-[95%] lg:w-[100%] justify-center items-center gap-10">
        <div className="flex flex-col items-end justify-end gap-5 w-auto order-2 md:order-1 md:w-1/2">
          <div className="w-[100%] md:w-[95%] lg:w-[80%] xl:w-[60%] flex flex-col gap-5">
            <div className="text-[25px] md:text-[30px] text-center md:text-left lg:text-[48px] leading-[25px] md:leading-[30px] lg:leading-[48px] font-poppins font-bold text-[#000000]">
              {data?.title}
            </div>
            <p className="text-[16px] text-center md:text-left font-poppins text-[#19192C] leading-[25px]">
              {data?.content}
            </p>

            <div className="flex gap-7 justify-center md:justify-start items-center">
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
        <div className="w-[100%] sm:w-[90%] flex justify-center md:justify-start order-1 md:order-2 md:w-1/2">
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
    <main className="flex flex-col relative gap-6 w-[100vw]">
<article className="w-full min-h-screen m-0 px-4">
  <div className="relative w-full h-[100vh] overflow-hidden rounded-3xl">
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 rounded-2xl" />

    {/* Background Image */}
    <Image
      src={HomeBackground}
      alt="Home Background"
      fill
      sizes="100vw"
      priority
      className="object-cover rounded-2xl"
    />
  </div>

        {/* <article className="w-full md:w-1/2 flex justify-start order-1 md:order-2">
          <div className="w-[100%]  flex flex-col items-center justify-center gap-5">
            <Image alt="" src={Logo} className="w-[300px] aspect-auto" />
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-[25px] sm:text-[35px] lg:text-[50px]  font-semibold font-poppins">
                {t("section1_title")}<span className="text-headingColor text-[40px] sm:text-[45px] lg:text-[60px] font-bold"> $19!</span>
                <span className="text-[#C1001F]">$19!</span>
              </h2>
              <p className="text-[16px] text-[#6B6B6B]">
                {t("section1_subtitle")}
              </p>
            </div>
            <div className="flex gap-7 justify-center md:justify-start items-center">
              <Button
                text={t("section1_button")}
                size={{ width: "214px", height: "55px" }}
                route={""}
                bgColor={"#C1001F"}
                textColor={"#ffffff"}
                onClick={redirectToContact}
              />
            </div>
          </div>
        </article> */}
       

      <div className="absolute inset-x-0 bottom-[100px] z-20 flex flex-col items-start pl-52 sm:pl-36 text-white">


            {/* Stars and Review */}
          <div className="flex items-center mb-2 space-x-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
             className="w-6 h-6 text-[#ffbd66]"  // Increased size + lighter color
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.17 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>

        ))}
      <span className="text-[16px] font-extralight leading-[100%] tracking-[0] font-poppins">
          {t("section1_span")}
        </span>
      </div>


      {/* Main Heading */}
      <h1 className="text-[48px] font-semibold leading-[100%] tracking-[0] font-inter mb-4 max-w-2xl">
  {t("section1_h1")}
</h1>



      {/* Subtext */}
      <p className="text-base sm:text-lg max-w-2xl mb-6">
          {t("section1_p")}
      </p>

      {/* Buttons */}
          <div className="flex flex-wrap gap-4">
      <button
        onClick={redirectToContact}
        className="bg-[#C1001F] text-white font-medium text-[15px] leading-[100%] tracking-[0] font-poppins px-6 py-4 rounded-full hover:bg-red-700 transition"
      >
        {t("section1_button1")}
      </button>

      <button className="border border-white text-white font-medium text-[15px] leading-[100%] tracking-[0] font-poppins px-6 py-4 rounded-full hover:bg-white hover:text-black transition">
        {t("section1_button2")}
      </button>
    </div>
    </div>

      </article>
    </main>
  );
};
