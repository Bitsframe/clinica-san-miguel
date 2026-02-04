
"use client";

import { styles } from "@/app/[locale]/styles";
import { ImageCarousel, Testimonial } from "@/components";
import StarRatings from "react-star-ratings";

// icons
import { IoIosArrowForward } from "react-icons/io";
import { Map } from "@/components/Map";
import { Button } from "@/utils";
import { RequestAppointment } from "@/components/Modal/RequestAppointment";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";

const ServiceTab = ({
  name,
  icon,
  id,
}: {
  id: number;
  name: string | null | undefined;
  icon: string | null | undefined;
}) => {
  return (
    <article className="w-full bg-[#D9D9D9] flex justify-between items-center p-4 rounded-sm transition-all hover:bg-gray-300">
      <div className="flex items-center gap-3">
        <div className="rounded-full aspect-square flex w-10 h-10 justify-center items-center bg-[#C1001F] shrink-0 overflow-hidden">
          {icon && (
            <Image
              src={icon}
              alt={"service icon"}
              className="object-contain"
              width={40}
              height={40}
            />
          )}
        </div>

        <h3 className="text-[16px] md:text-[18px] text-black font-semibold font-poppins">
          {name}
        </h3>
      </div>
      <Link href={`/services/${id}`}>
        <div className="cursor-pointer rounded-full aspect-square flex w-10 h-10 justify-center items-center bg-black transition-transform hover:scale-105">
          <IoIosArrowForward className="text-[16px] text-white" />
        </div>
      </Link>
    </article>
  );
};

export const DetailedLocation = ({ slug }: { slug: string }) => {
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [locationGallery, setLocationGallery] = useState<(string | null)[]>();
  const [totalRatings, setTotalRatings] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations("location");
  const locale = useLocale();
  const { services, services_es } = useSupabase();

  const services_data = locale === "es" ? services_es : services;

  const {
    detailData,
    filteredData,
    locationImages,
    fetchDetailedData,
    fetchFilteredData,
  } = useSupabase();

  const fetchDataCallback = useCallback(() => {
    fetchDetailedData("Locations", parseInt(slug));
  }, [fetchDetailedData, slug]);

  const fetchTestimonialsData = useCallback(() => {
    fetchFilteredData("Testinomial", "location_id", parseInt(slug));
  }, [fetchFilteredData, slug]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchTestimonialsData();
  }, [fetchTestimonialsData]);

  useEffect(() => {
    if (filteredData) {
      const ratings = filteredData.map((item) => parseFloat(item.rating));
      const totalResults = ratings.length;
      const sumOfRatings = ratings.reduce((acc, rating) => acc + rating, 0);
      const averageRating = totalResults > 0 ? sumOfRatings / totalResults : 0;
      setTotalRatings(averageRating);
    }
  }, [filteredData]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const handleCloseModal = () => {
    setOpenAppointmentModal(false);
  };

  const detailedData = detailData["Locations"] || [];

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
  } = detailedData[0] || {};

  useEffect(() => {
    let data = locationImages
      .filter((item) => item.location_id === id)
      .map((item) => item.image);

    setLocationGallery(data);
  }, [id, locationImages]);

  const clinicDetails = {
    phone: phone,
    timings: [
      { id: 1, day: "mon", timing: mon_timing },
      { id: 2, day: "tue", timing: tuesday_timing },
      { id: 3, day: "wed", timing: wednesday_timing },
      { id: 4, day: "thurs", timing: thursday_timing },
      { id: 5, day: "fri", timing: friday_timing },
      { id: 6, day: "sat", timing: saturday_timing },
      { id: 7, day: "sun", timing: sunday_timing },
    ],
    address: address,
  };

  type GroupedTimings = {
    [timing: string]: string[];
  };

  const groupedTimings: GroupedTimings = clinicDetails.timings.reduce(
    (acc: GroupedTimings, timing) => {
      const timingKey = timing.timing;
      if (!timingKey) return acc;
      if (acc[timingKey]) {
        acc[timingKey].push(timing.day);
      } else {
        acc[timingKey] = [timing.day];
      }
      return acc;
    },
    {}
  );

  const transformLableCase = (label: string) => {
    return label.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
  };

  const displayTimings = Object.entries(groupedTimings).map(
    ([timing, days]: [string, string[]]) => {
      const daysString = days.map((label) => transformLableCase(label)).join(", ");
      return (
        <div
          key={timing}
          className="flex flex-col items-start text-[16px] text-black font-normal leading-tight"
        >
          <span className="font-semibold">{daysString}:</span>
          <span className="pb-1"> {timing}</span>
        </div>
      );
    }
  );

  return (
    <>
      <main className="flex flex-col gap-8 md:gap-12 justify-center items-center py-8 px-4 md:px-[5%] lg:px-[10%]">
        {/* Section 1: Hero */}
        <section className="flex flex-col justify-start gap-6 w-full">
          <h2 className={`${styles.sectionHeadText} text-headingColor text-left`}>
            {title}
          </h2>

          <article className="flex flex-col lg:flex-row justify-between w-full items-start gap-6 lg:gap-10">
            <div className="w-full lg:w-1/2">
              <ImageCarousel imagesData={locationGallery} />
            </div>
            
            <div className="flex flex-col w-full lg:w-1/2 gap-6 items-start">
              <Button
                text={t("str7")}
                className="w-full md:w-[280px]"
                bgColor="#C1001F"
                textColor="#ffffff"
                onClick={() => setOpenAppointmentModal(true)}
              />

              <div className="flex flex-col gap-4 w-full">
                <div>
                  <h3 className="text-[18px] font-bold text-black capitalize">{t("str1")}:</h3>
                  <p className="text-[16px] text-black font-normal">{phone}</p>
                </div>

                <div>
                  <h3 className="text-[18px] font-bold text-black capitalize mb-1">{t("str2")}:</h3>
                  <div className="space-y-1">{displayTimings}</div>
                </div>

                <div>
                  <h3 className="text-[18px] font-bold text-black capitalize">{t("str3")}:</h3>
                  <p className="text-[16px] text-black font-normal max-w-md">{address}</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Section 2: Testimonials */}
        <section className="flex flex-col justify-start gap-6 w-full">
          <h2 className={`${styles.sectionHeadText} text-headingColor text-left`}>
            {t("str4")}:
          </h2>
          <div className="flex flex-col gap-2 items-start mb-2">
            <div className="text-[48px] md:text-[60px] lg:text-[72px] font-bold text-customGray leading-none">
              {totalRatings.toFixed(1)}/5
            </div>
            {isMounted && (
              <StarRatings
                rating={totalRatings}
                starDimension="30px"
                starSpacing="2px"
                numberOfStars={5}
                starRatedColor="#C1001F"
              />
            )}
          </div>

          <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {filteredData?.map((item) => (
              <Testimonial
                key={item.id}
                author={item.name}
                comment={item.review}
                ratings={parseFloat(item.rating)}
                mode="dark"
              />
            ))}
          </article>
        </section>

        {/* Section 3: Services */}
        <section className="flex flex-col justify-start gap-6 w-full">
          <h2 className={`${styles.sectionHeadText} text-headingColor text-left`}>
            {t("str5")}:
          </h2>
          <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services_data.map((item) => (
              <ServiceTab
                key={item.id}
                id={item.id}
                name={item.title}
                icon={item.icon}
              />
            ))}
          </article>
        </section>

        {/* Section 4: Map */}
        <section className="flex flex-col justify-start gap-6 w-full">
          <h2 className={`${styles.sectionHeadText} text-headingColor text-left`}>
            {t("str6")}:
          </h2>
          <div className="w-full h-[400px] md:h-[550px] overflow-hidden rounded-[30px] md:rounded-[50px] border border-gray-100">
            <Map height={400} location={direction} />
          </div>
        </section>
      </main>

      <RequestAppointment
        detailedData={detailedData}
        locationID={parseInt(slug)}
        handleClose={handleCloseModal}
        openModal={openAppointmentModal}
      />
    </>
  );
};