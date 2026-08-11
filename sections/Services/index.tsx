"use client";

import { useState, useEffect } from "react";
import { CompactService } from "@/components";
import { styles } from "@/app/[locale]/styles";
import Image from "next/image";
import { viewAllArrow } from "@/assets/images";
import { Link } from "@/navigation";

import { useLocale, useTranslations } from "next-intl";

type ServicesProps = {
  initialServices?: any[];
};

export const Services = ({ initialServices = [] }: ServicesProps) => {
  const [data, setData] = useState<any[]>(initialServices);
  const [hasFetched, setHasFetched] = useState(true);

  const t = useTranslations("common");
  const locale = useLocale();

  // Data is passed from server component, so no useEffect fetching is needed.

  return (
    <section className="flex flex-col relative gap-6 my-10 p-3 w-[100vw] md:w-[90vw] lg:w-[85vw] xl:w-[75vw]">
      <div className="flex flex-col justify-center items-center">
        <p className={`${styles.sectionSubText} text-[#19192C]`}>
          {t("services_sub_title")}
        </p>
        <h1 className={`${styles.sectionHeadText} text-[#C1001F] `}>
          {t("services_title")}
        </h1>
      </div>
      <Link href={"/services"}>
        <div className="flex justify-end items-end flex-col">
          <p className="text-[14px] text-[#626262] font-poppins">View more</p>
          <Image
            src={viewAllArrow}
            alt={"view all arrow icon"}
            className="w-[75px] aspect-auto"
          />
        </div>
      </Link>

      {/* Render services after data is fetched */}
      <article className="flex flex-wrap justify-center h-auto mx-auto">
        {hasFetched && data.length > 0 ? (
          data
            .filter((service) => service.title?.toLowerCase() !== "others")
            .slice(0, 6)
            .map((service) => (
              <CompactService
                id={service.id}
                heading={service.title}
                icon={service.icon}
                description={service.description}
                mode={service.id % 2 === 0 ? "light" : "dark"}
                key={service.id}
              />
            ))
        ) : (
          <p>Loading services...</p>  // Show a loading state until data is fetched
        )}
      </article>
    </section>
  );
};
