"use client";

import { styles } from "@/app/[locale]/styles";
import { ImageCarousel, Testimonial } from "@/components";
// import Image from "next/image";
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
import { useTranslation } from "react-i18next";
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
  const router = useRouter();

  const handleService = () => {
    router.push(`/services/${id}`);
  };
  return (
    <article className=" w-full bg-[#D9D9D9] flex justify-between items-center p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full aspect-square flex w-10 h-10 justify-center items-center bg-[#C1001F]">
          {icon && (
            <Image
              src={icon}
              alt={"service icon"}
              className="object-contain aspect-square w-10 h-10 rounded-[50%]"
              width={40}
              height={40}
            />
          )}
        </div>

        <h3 className="text-[18px] text-black font-semibold font-poppins">
          {name}
        </h3>
      </div>
      <Link href={`/services/${id}`}>
        <div
          // onClick={handleService}
          className="cursor-pointer rounded-full aspect-square flex w-10 h-10 justify-center items-center bg-black"
        >
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
    fetchTestimonialsData();
  }, [fetchTestimonialsData]);

  useEffect(() => {
    if (filteredData) {
      const ratings = filteredData.map((item) => parseFloat(item.rating));
      const totalResults = ratings.length;
      const sumOfRatings = ratings.reduce((acc, rating) => acc + rating, 0);
      const averageRating = totalResults > 0 ? sumOfRatings / totalResults : 0;
      const averageRatingFormatted = averageRating.toFixed(2);
      console.log("Average Rating:", averageRatingFormatted);

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
      const daysString = days.map((lable) => transformLableCase(lable)).join(", ");
      return (
        <p
          key={timing}
          className="flex flex-col items-start text-[16px] text-black font-normal"
        >
          <span className="font-semibold">{daysString}:</span>
          <span className="pb-1"> {timing}</span>
        </p>
      );
    }
  );
  return (
    <>
      <main className="flex flex-col gap-10 justify-center items-center py-5 px-2 md:px-[5%] lg:px-[10%]">
        <section className="flex flex-col justify-start gap-10 w-full">
          <h2 className={`${styles.sectionHeadText} text-headingColor`}>
            {/* Clinica San Miguel Houston, TX Office */}
            {title}
          </h2>

          <article className="flex flex-col lg:flex-row justify-center w-full items-start gap-5">
            <div className="w-full lg:w-1/2">
              <ImageCarousel imagesData={locationGallery} />
            </div>
            <div className="flex flex-col w-full lg:w-1/2 gap-4">
              <Button
                text={t("str7")}
                size={{ width: "250px", height: "50px" }}
                route={""}
                bgColor={"#C1001F"}
                textColor={"#ffffff"}
                onClick={() => setOpenAppointmentModal(true)}
              />

              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-black capitalize">
                    {t("str1")}:
                  </h3>
                  <p className="text-[16px] text-black font-normal">{phone}</p>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-black capitalize">
                    {t("str2")}:
                  </h3>
                <div className="text-[16px] text-black font-normal space-y-1">
              {displayTimings}
            </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-black capitalize">
                    {t("str3")}:
                  </h3>
                  <p className="text-[16px] text-black font-normal">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="flex flex-col justify-start gap-5 w-full">
          <h2
            className={`${styles.sectionHeadText} text-headingColor`}
            style={{ textAlign: "left" }}
          >
            {t("str4")}:
          </h2>
          <article className="flex flex-col gap-3 justify-start">
            <div className="flex flex-col justify-start gap-3">
              <div className="text-[40px] md:text-[60px] lg:text-[80px] text-customGray">
                {totalRatings.toFixed(1)}/5
              </div>
              <div className="hidden lg:block">
                <StarRatings
                  rating={totalRatings}
                  starDimension="45px"
                  starSpacing="1px"
                  numberOfStars={5}
                  starRatedColor="#C1001F"
                />
              </div>
            </div>
          </article>

          <article className="flex flex-wrap justify-start gap-5 items-center">
            {filteredData?.map((item, index) => (
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

        <section className="flex flex-col justify-start gap-5 w-full">
          <h2
            className={`${styles.sectionHeadText} text-headingColor`}
            style={{ textAlign: "left" }}
          >
            {t("str5")}:
          </h2>
          <article className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {services_data.map((item, index) => (
              // id={service.id}
              // heading={service.title}
              // icon={service.icon}
              // description={service.description}
              // mode={service.id % 2 === 0 ? "light" : "dark"}
              // key={service.id}
              <ServiceTab
                key={item.id}
                id={item.id}
                name={item.title}
                icon={item.icon}
              />
            ))}
          </article>
        </section>

        <section className="flex flex-col justify-start gap-5 w-full">
          <h2
            className={`${styles.sectionHeadText} text-headingColor`}
            style={{ textAlign: "left" }}
          >
            {t("str6")}:
          </h2>

          <div className="min-w-[300px] w-[80vw] max-w-[1200px] rounded-[60px]">
            <Map height={600} location={direction} />
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