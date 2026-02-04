"use client";

import { earth_care, heart_with_pulse, journey } from "@/assets/images";
import { useSupabase } from "@/context/supabaseContext";
import { Divider } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment } from "react";
import LoadingSkeletonAboutScreen from "@/components/loading/LoadingSkeletonAboutScreen";

const customLoader = ({ src, width, quality }: any) => {
  const urlWithoutQuery = src.split("?")[0];
  const qualityParam = quality ? `&q=${quality}` : "";
  return `${urlWithoutQuery}?w=${width}${qualityParam}`;
};

const Expertise = ({
  image,
  heading,
  description,
}: {
  image: any;
  heading: string;
  description: string;
}) => {
  return (
    <article className="flex flex-col items-center justify-center gap-3">
      <Image
        src={image}
        alt={""}
        width={70}
        height={70}
        className="w-[70px] lg:w-[100px] aspect-auto"
        loader={customLoader}
      />
      <h1 className="text-[23px] md:text-[30px] lg:text-[35px] leading-[23px] md:leading-[31px] lg:leading-[35px] text-center text-[#000000] font-bold">
        {heading}
      </h1>
      <p className="text-[18px] lg:text-[24px] leading-[24px] lg:leading-[30px] w-[90%] md:w-[80%] lg:w-[70%] text-center text-[#000000]">
        {description}
      </p>
    </article>
  );
};

const AboutScreen = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchLocalizedTable("about", locale)
      .then((rows) => {
        setData(rows[0]);
      })
      .catch((err) => console.error("Error fetching about data:", err));
  }, [locale, fetchLocalizedTable]);

  const whatwedo =
    "At Clinica San Miguel, we understand the importance of effective communication in healthcare. That's why we take pride in our team of bilingual English and Spanish-speaking providers. Our commitment to linguistic diversity ensures that every member of our community receives the highest quality healthcare services.";

  const expertise = [
    {
      id: 1,
      image: data?.image_3 || journey,
      heading:
        data?.title_3 ||
        "A Journey from Alianza Medica Hispana to Clinica San Miguel",
      description:
        data?.text_3 ||
        "Our journey began in 2015 with the establishment of Alianza Medica Hispana, our very first location. Over the years, we've grown and transformed into Clinica San Miguel, expanding our reach and enhancing our services. We now proudly serve patients aged five and older throughout Texas, offering comprehensive care for every member of your family.",
    },
    {
      id: 2,
      image: data?.image_4 || heart_with_pulse,
      heading: data?.title_4 || "Comprehensive Family Healthcare",
      description:
        data?.text_4 ||
        "What sets Clinica San Miguel apart is our commitment to comprehensive healthcare. We are your one-stop destination for a wide range of services, including preventive care, sick care, and chronic disease management. Our state-of-the-art facilities are equipped with the latest technology and our dedicated physicians have the expertise to perform on-site procedures such as abscess drainage, electrocardiograms (EKGs), ultrasounds, and bloodwork.",
    },
    {
      id: 3,
      image: data?.image_5 || heart_with_pulse,
      heading: data?.title_5 || "Meeting Diverse Healthcare Needs",
      description:
        data?.text_5 ||
        "What sets Clinica San Miguel apart is our commitment to comprehensive healthcare. We are your one-stop destination for a wide range of services, including preventive care, sick care, and chronic disease management. Our state-of-the-art facilities are equipped with the latest technology and our dedicated physicians have the expertise to perform on-site procedures such as abscess drainage, electrocardiograms (EKGs), ultrasounds, and bloodwork.",
    },
  ];

  if (!data) {
    return <LoadingSkeletonAboutScreen />;
  }

  return (
    <main className="py-[5%] flex flex-col gap-20 px-4 lg:px-[20px] items-center justify-center">
      <section className="flex flex-col items-center justify-center gap-10 lg:gap-32 w-full">
        {/* Header Section */}
        <article className="flex flex-col items-center justify-center w-full gap-5 lg:gap-8 text-center">
          <div className="flex flex-col items-center lg:items-start w-full lg:w-[60%] mx-auto">
            <h1 className="text-[48px] lg:text-[60px] text-[#000000] font-poppins font-bold leading-tight text-center lg:text-left">
              About
            </h1>
            <span className="block text-[32px] lg:text-[36px] text-[#C8102E] font-semibold mt-1 text-center lg:text-left">
              Clinica San Miguel
            </span>
          </div>
          <p className="w-full lg:w-[60%] text-[18px] lg:text-[24px] text-[#000000] text-center lg:text-left mx-auto">
            {data?.text_1}
          </p>
        </article>

        {/* Main Image */}
        <article className="w-full md:w-[85%] lg:w-[50%] flex justify-center items-center">
          {data?.image_1 ? (
            <Image
              src={data.image_1}
              alt=""
              loading="lazy"
              width={800}
              height={500}
              className="w-full aspect-auto object-contain"
              loader={customLoader}
            />
          ) : null}
        </article>

        {/* Bilingual Services Section - Updated for Tablet Stacking */}
        <article className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-16 items-center lg:items-start w-full max-w-[1200px] mx-auto">
          <div className="flex items-center lg:items-start flex-col gap-4 w-full lg:w-auto">
            <Image
              src={data?.image_2 || earth_care}
              width={60}
              height={60}
              loading="lazy"
              className="w-[60px] lg:w-[80px] aspect-auto"
              alt={""}
              loader={customLoader}
            />
            <h1 className="text-[36px] md:text-[40px] lg:text-[50px] leading-tight text-[#000000] font-poppins text-center lg:text-left">
              {data?.title_2}
            </h1>
          </div>
          <p className="w-full lg:w-[60%] text-[18px] lg:text-[24px] text-center lg:text-left text-[#000000]">
            {data?.text_2 || whatwedo}
          </p>
        </article>
      </section>

      <Divider />

      {/* Expertise Loop */}
      <div className="flex flex-col gap-20 w-full">
        {expertise.map((item, index) => (
          <Fragment key={item.id}>
            <Expertise
              image={item.image}
              heading={item.heading}
              description={item.description}
            />
            {index !== expertise.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
    </main>
  );
};

export default AboutScreen;