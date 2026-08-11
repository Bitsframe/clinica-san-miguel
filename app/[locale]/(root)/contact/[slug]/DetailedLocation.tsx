
"use client";

import { ImageCarousel } from "@/components";
import StarRatings from "react-star-ratings";
import { Map } from "@/components/Map";
import { RequestAppointment } from "@/components/Modal/RequestAppointment";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

const ServiceTab = ({
  name,
  icon,
  id,
}: {
  id: number;
  name: string | null | undefined;
  icon: string | null | undefined;
}) => (
  <Link href={`/services/${id}`}>
    <article className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#C1001F]/30 hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10 overflow-hidden">
          {icon ? (
            <Image src={icon} alt="" width={24} height={24} className="object-contain" />
          ) : (
            <Star className="h-4 w-4 text-[#C1001F]" />
          )}
        </div>
        <h3 className="text-sm sm:text-base font-semibold font-poppins text-[#19192C] truncate">
          {name}
        </h3>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#C1001F] transition-colors group-hover:bg-[#C1001F] group-hover:text-white">
        <ChevronRight className="h-4 w-4" />
      </div>
    </article>
  </Link>
);

function LocationDetailSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded" />
      <div className="h-10 w-2/3 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-full" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export const DetailedLocation = ({ 
  slug,
  initialLocation,
  initialImages,

}: { 
  slug: string;
  initialLocation: any;
  initialImages: (string | null)[];

}) => {
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations("location");
  const tc = useTranslations("contact_page");
  const locale = useLocale();
  const { services, services_es } = useSupabase();
  const services_data = locale === "es" ? services_es : services;

  const detailData = useSupabase().detailData;

  const location = initialLocation;
  const locationGallery = initialImages;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const ratings = filteredData.map((item: any) => parseFloat(item.rating));
      const totalResults = ratings.length;
      const sumOfRatings = ratings.reduce((acc: number, rating: number) => acc + rating, 0);
      setTotalRatings(totalResults > 0 ? sumOfRatings / totalResults : 0);
    }
  }, [filteredData]);

  const {
    id,
    title,
    phone,
    address,
    mon_timing,
    tuesday_timing,
    wednesday_timing,
    thursday_timing,
    friday_timing,
    saturday_timing,
    sunday_timing,
    direction,
  } = location || {};

  if (!location) {
    return (
      <main className="w-full max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold font-poppins text-[#19192C]">
          {tc("location_not_found_title")}
        </h1>
        <p className="text-[#3D3D3C] font-inter">{tc("location_not_found_body")}</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C1001F] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc("back_to_locations")}
        </Link>
      </main>
    );
  }

  const timings = [
    { day: "Mon", timing: mon_timing },
    { day: "Tue", timing: tuesday_timing },
    { day: "Wed", timing: wednesday_timing },
    { day: "Thu", timing: thursday_timing },
    { day: "Fri", timing: friday_timing },
    { day: "Sat", timing: saturday_timing },
    { day: "Sun", timing: sunday_timing },
  ].filter((row) => row.timing);

  type GroupedTimings = Record<string, string[]>;
  const groupedTimings: GroupedTimings = timings.reduce((acc, row) => {
    const key = row.timing as string;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row.day);
    return acc;
  }, {} as GroupedTimings);

  return (
    <>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        <div className="space-y-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3D3D3C] hover:text-[#C1001F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tc("back_to_locations")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-[#19192C] leading-tight">
            {title}
          </h1>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <ImageCarousel imagesData={locationGallery} />

          <div className="flex flex-col gap-5">
            <button
              type="button"
              onClick={() => setOpenAppointmentModal(true)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#C1001F] px-8 py-3.5 text-sm font-semibold font-poppins text-white shadow-sm hover:bg-[#a30019] transition-colors"
            >
              <CalendarDays className="h-5 w-5" />
              {t("str7")}
            </button>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
              {phone && (
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10">
                    <Phone className="h-5 w-5 text-[#C1001F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#19192C] font-poppins mb-1">
                      {t("str1")}
                    </h3>
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="text-base text-[#3D3D3C] hover:text-[#C1001F] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {Object.keys(groupedTimings).length > 0 && (
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10">
                    <Clock className="h-5 w-5 text-[#C1001F]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#19192C] font-poppins">
                      {t("str2")}
                    </h3>
                    {Object.entries(groupedTimings).map(([timing, days]) => (
                      <div key={timing} className="text-sm text-[#3D3D3C] font-inter">
                        <span className="font-medium text-[#19192C]">
                          {days.join(", ")}:
                        </span>{" "}
                        {timing}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10">
                    <MapPin className="h-5 w-5 text-[#C1001F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#19192C] font-poppins mb-1">
                      {t("str3")}
                    </h3>
                    <p className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>



        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
            {t("str5")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services_data
              .filter((item) => item.title?.toLowerCase() !== "others")
              .slice(0, 9)
              .map((item) => (
                <ServiceTab
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  icon={item.icon}
                />
              ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
            {t("str6")}
          </h2>
          <div className="w-full h-[360px] sm:h-[450px] overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <Map height={450} location={direction} />
          </div>
        </section>
      </main>

      {openAppointmentModal && (
        <RequestAppointment
          detailedData={[location]}
          locationID={parseInt(slug)}
          handleClose={() => setOpenAppointmentModal(false)}
          openModal={openAppointmentModal}
        />
      )}
    </>
  );
};
