"use client";

import { useEffect, useRef, useState, ComponentType } from "react";
import Slider from "react-slick";
import { Star, StarHalf, Star as StarOutline, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { fetchTableRows } from "@/context/supabaseContext";
import { TableRow } from "@/@types/database.types";
import { useLazyLoad } from "@/hooks/useLazyLoad";  
import { LoadingSkeletonTestimonials } from "@/components/loading/LoadingSkeletonTestimonials";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Testimonial = TableRow<"Testinomial">;

export function PatientStories({ initialTestimonials = [] }: { initialTestimonials?: Testimonial[] }) {
  const t = useTranslations("testimonies");
  const sliderRef = useRef<any>(null);
  const testimonials = initialTestimonials;
  const hasFetched = true;

  // Lazy loading hook
  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });
  // Removed client-side fetching as data comes from server
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // react-slick typings can conflict with React 18; cast to a generic component to keep JSX happy
  const SliderComponent = Slider as unknown as ComponentType<any>;

  return (
    <section ref={ref} className="w-full bg-white px-6 py-16 md:px-20 lg:px-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {hasFetched && testimonials.length > 0 ? (
        <SliderComponent ref={sliderRef} {...settings}>
          {testimonials.map((testimonial, index) => {
            const rating = parseFloat(String(testimonial.rating || "0"));
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <div key={index} className="px-2">
                <div className="bg-[#F4F5F6] p-6 rounded-xl relative overflow-hidden shadow-sm h-[13rem] flex flex-col justify-start items-start text-left">
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
                  <p className="text-gray-800 font-medium text-base leading-snug mb-2 line-clamp-3">
                    “{testimonial.review ?? "No review provided"}”
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.name ?? "Anonymous"}</p>
                  <div className="absolute bottom-0 right-2 opacity-40 text-[120px] leading-none font-extrabold text-gray-300 select-none pointer-events-none z-0">
                    //
                  </div>
                </div>
              </div>
            );
          })}
        </SliderComponent>
      ) : (
        <LoadingSkeletonTestimonials />

      )}
    </section>
  );
}
