"use client";


// Slick Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import  Link from "next/link";
import { ExternalLink } from "lucide-react"; 

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
    customPaging: (i: any) => <div className="ft-slick__dashes--custom"></div>,


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
  <section className="flex flex-col justify-center gap-10 my-[5%] w-full px-4 md:px-8 xl:px-0">
    {/* Header Section */}
    <div className="container mx-auto">
      <article className="w-full flex flex-col gap-5 text-left">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[40px] font-semibold leading-[100%] tracking-[0] text-[#1B2432] font-[Inter] lg:ml-16">
            {t("treatments_title")}
            <br />
            {t("treatments_title2")}
          </h1>

          <Link href="/services"  className="hidden md:block">
          <button className="p-3 bg-[#C1001F] hover:bg-[#a30019] text-white rounded-full transition flex items-center justify-center mr-[4rem]">
              <ExternalLink className="w-8 h-8 text-white" />
            </button>
          </Link>
        </div>

        <p className="text-[16px] font-normal leading-[100%] tracking-[0] text-[#6C7582] font-[Poppins] lg:ml-16">
          {t("treatments_sub_title")}
        </p>
      </article>
    </div>

    {/* Treatments Slider */}
    <div className="container mx-auto">
      {/* @ts-ignore */}
      <Slider {...settings}>
        {data
          .filter((elem) => elem.id !== 25)
          .sort((a, b) => a.id - b.id)
          .slice(0, 6)
          .map((treatment) => (
            <div key={treatment.id} className="px-4 py-4 mb-4">
              <div className="flex flex-col w-full max-w-sm mx-auto 
                  h-72 sm:h-72 md:h-60 lg:h-[24rem]
                  overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition">

                  <div className="w-full h-48 pt-3 px-3 overflow-hidden rounded-md">
            {treatment.image ? (
              <Image
                src={treatment.image}
                alt={treatment.title || ""}
                  width={300}
                  height={200}
                className="w-full h-full object-cover rounded-md"
              />
            ) : null}
          </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 py-3 px-3 bg-white rounded-lg shadow-md">
                  {/* Card Content */}
                  <div className="flex flex-col items-start text-left">
                    <h3 className="text-base font-semibold text-zinc-900">
                      {treatment.title}
                    </h3>

                    <p className="text-sm text-zinc-600 mt-2 line-clamp-3 overflow-hidden">
                      {treatment.description}
                    </p>

                    {/* View Details Button */}
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-gray-200 px-4 py-1.5 text-sm font-medium text-zinc-900 hover:bg-gray-300 transition"
                      >
                        {t("treatments_view_details")}
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
              </div>
            </div>
          ))}
      </Slider>
    </div>


<Link href="/services" className="block md:hidden mt-10 mx-auto w-max">
  <button className="w-56 h-12 bg-[#C1001F] hover:bg-[#a30019] text-white rounded-full transition flex items-center justify-center text-base font-medium">
    {t("treatments_cta_button")}
  </button>
</Link>



  </section>
);
}