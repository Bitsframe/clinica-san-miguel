"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import Slider from "react-slick";
import Link from "next/link";
import { getSupabaseImageUrl } from "@/utils/supabaseImage";
import { TreatmentSliderSkeleton } from "@/components/loading/TreatmentSliderSkeleton";
import { useSupabase } from "@/context/supabaseContext";
import { TableRow } from "@/@types/database.types";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { useRouter } from "next/navigation"; 

type TreatmentRow = TableRow<"services">;

function isValidImageSrc(src: string | null | undefined): src is string {
  if (!src?.trim()) return false;
  return (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

function isCompleteTreatment(treatment: TreatmentRow): boolean {
  return (
    isValidImageSrc(treatment.image) &&
    Boolean(treatment.title?.trim()) &&
    Boolean(treatment.description?.trim()) &&
    treatment.description!.trim().toLowerCase() !== "desc"
  );
}

export const Treatments = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();
  const router = useRouter(); // ✅ Initialize router

  const [data, setData] = useState<TreatmentRow[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<number>>(new Set());

  const markBrokenImage = useCallback((id: number) => {
    setBrokenImageIds((prev) => new Set(prev).add(id));
  }, []);

  const treatments = useMemo(
    () =>
      data
        .filter((elem) => elem.id !== 25)
        .filter(isCompleteTreatment)
        .filter((treatment) => !brokenImageIds.has(treatment.id))
        .sort((a, b) => a.id - b.id)
        .slice(0, 6),
    [data, brokenImageIds]
  );

  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });

  useEffect(() => {
    if (isVisible && !hasFetched) {
      setLoading(true);
      fetchLocalizedTable("services", locale)
        .then((rows) => {
          setData(rows);
          setHasFetched(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isVisible, hasFetched, fetchLocalizedTable, locale]);

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
    customPaging: () => <div className="ft-slick__dashes--custom"></div>,
    responsive: [
      {
        breakpoint: 1040,
        settings: { slidesToShow: 2, slidesToScroll: 1, rows: 2 },
      },
      {
        breakpoint: 720,
        settings: { slidesToShow: 2, slidesToScroll: 1, rows: 1 },
      },
      {
        breakpoint: 704,
        settings: { slidesToShow: 1, slidesToScroll: 1, rows: 1 },
      },
    ],
  };

  return (
    <section
      ref={ref}
      className="flex flex-col justify-center gap-10 my-[5%] w-full px-4 md:px-8 xl:px-0"
    >
      {/* Header */}
      <div className="container mx-auto">
        <article className="w-full flex flex-col gap-5 text-left">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[40px] font-semibold leading-[100%] tracking-[0] text-[#1B2432] font-[Inter] lg:ml-8">
              {t("treatments_title")}
              <br />
              {t("treatments_title2")}
            </h1>
            <Link href="/services" className="hidden md:block" aria-label="View all services">
              <button aria-label="View all services" className="p-3 bg-[#C1001F] hover:bg-[#a30019] text-white rounded-full transition flex items-center justify-center mr-[2rem]">
                <ExternalLink className="w-6 h-6 text-white" />
              </button>
            </Link>
          </div>
          <p className="text-[16px] font-normal leading-[100%] tracking-[0] text-[#4B5563] font-[Poppins] lg:ml-8">
            {t("treatments_sub_title")}
          </p>
        </article>
      </div>

      {isVisible && (
        <div className="container mx-auto">
          {loading ? (
            <TreatmentSliderSkeleton />
          ) : (
            /* @ts-ignore */
            <Slider {...settings}>
              {treatments.map((treatment) => (
                  <div key={treatment.id} className="px-4 py-4 mb-4">
                    <div
                      className="flex flex-col w-full max-w-sm mx-auto 
                        h-72 sm:h-72 md:h-60 lg:h-[24rem]
                        overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-full h-48 pt-3 px-3 overflow-hidden rounded-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getSupabaseImageUrl(treatment.image, { width: 384, quality: 75 })}
                          alt={treatment.title || ""}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-md"
                          onError={() => markBrokenImage(treatment.id)}
                        />
                      </div>

                      <div className="flex flex-col flex-1 py-3 px-3 bg-white rounded-lg shadow-md">
                        <div className="flex flex-col items-start text-left">
                          <h3 className="text-base font-semibold text-zinc-900">
                            {treatment.title}
                          </h3>
                          <p className="text-sm text-zinc-600 mt-2 line-clamp-3 overflow-hidden">
                            {treatment.description}
                          </p>
                          <div className="mt-auto pt-4">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/services/${treatment.id}`)
                              } // ✅ Button routing here
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
          )}
        </div>
      )}

      {/* Mobile CTA */}
      <Link href="/services" className="block md:hidden mt-10 mx-auto w-max">
        <button className="w-56 h-12 bg-[#C1001F] hover:bg-[#a30019] text-white rounded-full transition flex items-center justify-center text-base font-medium">
          {t("treatments_cta_button")}
        </button>
      </Link>
    </section>
  );
};
