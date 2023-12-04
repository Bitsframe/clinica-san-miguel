"use client";

import { styles } from "@/app/styles";
import {
  blood_work,
  blood_work_icon,
  dentistry,
  dentistry_icon,
  diabetes,
  diabetes_icon,
  high_blood_pressure,
  high_blood_pressure_icon,
  ultrasound,
  ultrasound_icon,
  weight_loss,
  weight_loss_icon,
} from "@/assets/images";
import { Treatment } from "@/components";

// Slick Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export const Treatments = () => {
  const settings = {
    dots: true,
    dotsClass: "slick-dots",
    infinite: true,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    rows: 2,
    // slidesPerRow: 2,
    appendDots: (dots: any) => <ul>{dots}</ul>,
    customPaging: (i: any) => <div className="ft-slick__dots--custom"></div>,
    // nextArrow: (
    //   <SampleNextArrow
    //     className={undefined}
    //     style={undefined}
    //     onClick={() => slider?.current?.slickNext()}
    //   />
    // ),
    // prevArrow: (
    //   <SamplePrevArrow
    //     className={undefined}
    //     style={undefined}
    //     onClick={() => slider?.current?.slickPrev()}
    //   />
    // ),
    responsive: [
      // {
      //   breakpoint: 1400,
      //   settings: {
      //     slidesToShow: 3,
      //     slidesToScroll: 1,
      //     rows: 2,
      //     slidesPerRow: 3,
      //   },
      // },
      {
        breakpoint: 800,
        settings: {
          // arrows: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          rows: 1,
          // slidesPerRow: 2,
        },
      },
      {
        breakpoint: 704,
        settings: {
          // arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          // slidesPerRow: 1,
        },
      },
    ],
  };

  const treatments = [
    {
      id: 1,
      heading: "Blood Work",
      image: blood_work,
      icon: blood_work_icon,
      description:
        "Clinica San Miguel, with 12 Texas locations, provides essential blood testing services. Call or book online for comprehensive health care management",
      mode: "light",
    },
    {
      id: 2,
      heading: "Dentistry",
      image: dentistry,
      icon: dentistry_icon,
      description:
        "Clinica San Miguel in North West Dallas, Texas, offers essential dental care for healthy teeth and gums. Prevent complications like decay and gum disease. Call or book online for an appointment today.",
      mode: "dark",
    },
    {
      id: 3,
      heading: "High Blood Pressure",
      image: high_blood_pressure,
      icon: high_blood_pressure_icon,
      description:
        "Clinica San Miguel offers comprehensive care for high blood pressure at 12 clinics across Texas, including Dallas, Houston, and other locations. Call or book online for an appointment to improve your heart health.",
      mode: "light",
    },
    {
      id: 4,
      heading: "Ultrasounds ",
      image: ultrasound,
      icon: ultrasound_icon,
      description:
        "Clinica San Miguel provides ultrasounds at 12 Texas locations, including Dallas and Houston. Understand your body better; book an ultrasound online or by phone for comprehensive insights into your health.",
      mode: "light",
    },
    {
      id: 5,
      heading: "Diabetes ",
      image: diabetes,
      icon: diabetes_icon,
      description:
        "Expert diabetes care across 12 Texas locations in Dallas, Houston, and more. Prevent complications, call or book online.",
      mode: "dark",
    },
    {
      id: 6,
      heading: "Weight Loss ",
      image: weight_loss,
      icon: weight_loss_icon,
      description:
        "Discover effective, medically supervised weight loss at Clinica San Miguel's 12 Texas locations, including Dallas and Houston. Schedule your visit today by calling or booking online anytime.",
      mode: "light",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-10 my-[5%] mx-14">
      <article className="flex w-full flex-col gap-5 items-center">
        <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
          top treatments
        </h1>
        <p className={`${styles.sectionSubText} text-[#19192C]`}>
          &quot;Revitalize Your Well-being with the Best-Recommended
          Treatments&quot;
        </p>
      </article>

      <div className="w-[95vw] sm:w-[95vw] md:w-[90vw] lg:w-[80vw] xl:w-[75vw] block justify-center h-auto mx-auto my-10">
        <Slider {...settings}>
          {treatments.map((treatment) => (
            <Treatment
              heading={treatment.heading}
              image={treatment.image}
              icon={treatment.icon}
              description={treatment.description}
              mode={treatment.id % 2 === 0 ? "dark" : "light"}
              key={treatment.id}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
};
