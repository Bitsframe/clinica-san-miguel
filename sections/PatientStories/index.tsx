"use client";

import Slider from "react-slick";
import { Star, StarHalf, Star as StarOutline, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSupabase } from "@/context/supabaseContext";
import { useRef } from "react";

export function PatientStories() {
  const t = useTranslations("testimonies");
  const { testinomial } = useSupabase();
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="w-full bg-white px-6 py-16 md:px-20 lg:px-32">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            {t("description")}
          </p>
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {testinomial.map((testimonial, index) => {
          const rating = parseFloat(String(testimonial.rating || "0"));
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating % 1 >= 0.5;
          const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

          return (
            <div key={index} className="px-2">
             <div className="bg-[#F4F5F6] p-6 rounded-xl relative overflow-hidden shadow-sm h-[13rem] flex flex-col justify-start items-start text-left">

                {/* Star Rating */}
                <div className="flex gap-1 mb-2 mt-2 text-[#C1001F]">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} fill="currentColor" stroke="none" className="w-4 h-4" />
                  ))}
                  {hasHalfStar && (
                    <StarHalf key="half" fill="currentColor" stroke="none" className="w-4 h-4" />
                  )}
                  {[...Array(emptyStars)].map((_, i) => (
                    <StarOutline key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-800 font-medium text-base leading-snug mb-2 line-clamp-3">
                  “{testimonial.review}”
                </p>

                {/* Author */}
                <p className="text-sm text-gray-500 font-medium">{testimonial.name}</p>

                {/* Decorative Symbol */}
                <div className="absolute bottom-0 right-2 opacity-40 text-[120px] leading-none font-extrabold text-gray-300 select-none">
                  //
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}
