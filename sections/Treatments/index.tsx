"use client";

import { styles } from "@/app/[locale]/styles";
import { viewAllArrow } from "@/assets/images";
import { Treatment } from "@/components";

// Slick Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "@/navigation";
import Image from "next/image";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";

export const Treatments = () => {
  const settings = {
    dots: true,
    dotsClass: "slick-dots",
    infinite: true,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    rows: 2,
    appendDots: (dots: any) => <ul>{dots}</ul>,
    customPaging: (i: any) => <div className="ft-slick__dots--custom"></div>,

    responsive: [
      {
        breakpoint: 1040,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          rows: 2,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          rows: 1,
        },
      },
      {
        breakpoint: 704,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  const t = useTranslations("home");
  const locale = useLocale();

  const { services, services_es } = useSupabase();

  const data = locale === "es" ? services_es : services;

  return (
    <section className="flex flex-col justify-center gap-10 my-[5%] mx-0 px-4 md:px-8 lg:px-10 xl:px-0 w-[100vw] md:w-[96vw] lg:w-[95vw] xl:w-[75vw] mx-auto ">
  <article className="flex w-full flex-col gap-5 items-start text-left">
    <h1 className="text-[40px] font-semibold leading-[100%] tracking-[0] text-[#1B2432] font-[Inter]">
      {t("treatments_title")}
      <br />
      {t("treatments_title2")}
    </h1>
    <p className="text-[16px] font-normal leading-[100%] tracking-[0] text-[#6C7582] font-[Poppins]">
      {t("treatments_sub_title")}
    </p>
  </article>
      {/* <Link href={"/services"}>
        <div className="flex justify-end items-end flex-col mr-10">
          <p className="text-[14px] text-[#626262] font-poppins">View more</p>
          <Image
            src={viewAllArrow}
            alt={"view all arrow icon"}
            className="w-[75px] aspect-auto"
          />
        </div>
      </Link> */}
      <div className="w-[100vw] md:w-[96vw] lg:w-[95vw] xl:w-[75vw] block justify-center h-auto mx-auto my-10">
  {/* @ts-ignore */}
  <Slider {...settings}>
    {data
      .filter((elem) => elem.id !== 25)
      .sort((a, b) => a.id - b.id)
      .slice(0, 6)
      .map((treatment) => (
         <div key={treatment.id} className="px-4 py-6 mb-6">
       <div className="flex flex-col h-full w-full max-w-[100%] sm:max-w-[100%] md:max-w-[100%] lg:max-w-[95%] xl:max-w-[90%] overflow-hidden rounded-xl border border-gray-400 bg-white shadow-sm hover:shadow-md transition">

           <div className="w-full h-[40%] sm:h-[50%] md:h-[60%] p-[4%] flex justify-center items-center">
              <Image
                src={treatment.image}
                alt={treatment.title}
                width={300}  // Set image width
                height={200}
                // className="object-cover"
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col flex-1 gap-3 p-6">
              <h3 className="text-lg font-semibold text-zinc-900">
                {treatment.title}
              </h3>
              <p className="text-sm text-zinc-600 line-clamp-5">
                {treatment.description}
              </p>
              <button
                type="button"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-gray-200 px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-gray-300 transition"
              >
                View Details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
  </Slider>
</div>
<div className="w-[60%] sm:w-[40%] md:w-[25%] lg:w-[20%] xl:w-[10%] mx-auto py-4">
  <button className="w-full h-[60px] [background-color:#C1001F] hover:[background-color:#a30019] text-white font-medium text-base rounded-full transition">
    Explore All Services
  </button>
</div>




    </section>
  );
};
