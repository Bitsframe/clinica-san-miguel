"use client";

import { styles } from "@/app/[locale]/styles";
import { Location } from "@/components";

// Slick Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Arrows icons
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useSupabase } from "@/context/supabaseContext";
import { useTranslations } from "next-intl";

function SampleNextArrow(props: { className: any; style: any; onClick: any }) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        fontSize: "52px",
        opacity: "1",
        color: "#626262",
        transform: `translateX(${170}%`,
      }}
    >
      <IoIosArrowForward />
    </button>
  );
}

function SamplePrevArrow(props: { className: any; style: any; onClick: any }) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        fontSize: "52px",
        opacity: "1",
        color: "#626262",
        transform: `translateX(${-270}%`,
      }}
    >
      <IoIosArrowBack />
    </div>
  );
}

export const Locations = () => {
  const settings = {
    dots: false,
    arrows: true,
    dotsClass: "slick-dots",
    infinite: true,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerPadding: "60px",
    rows: 1,
    initialSlide: 0,
    nextArrow: (
      <SampleNextArrow
        className={undefined}
        style={undefined}
        onClick={undefined}
      />
    ),
    prevArrow: (
      <SamplePrevArrow
        className={undefined}
        style={undefined}
        onClick={undefined}
      />
    ),
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const t = useTranslations("common");

  const { locations } = useSupabase();

  return (
    <section className="flex flex-col justify-center items-center my-14">
      <h1 className={`${styles.sectionHeadText} text-[#C1001F] uppercase`}>
        {t("location_title")}
      </h1>
      <h3 className={`${styles.sectionSubText} text-[#000000]`}>
        {t("location_sub_title")}
      </h3>

     <article className="w-[100vw] xsm:w-[65vw] sm:w-[70vw] md:w-[65vw] lg:w-[50vw] block justify-center h-[40vh] sm:h-[35vh] md:h-[30vh] lg:h-[25vh] mx-auto my-10">
        {/* @ts-ignore */}
        <Slider {...settings}>
          {locations.map((location) => (
            <Location
              key={location.id}
              locationName={location.title}
              number={location.phone}
              route={""}
              location={location.direction}
              address={location.address}
              id={null}
            />
          ))}
        </Slider>
      </article>
    </section>
  );
};
