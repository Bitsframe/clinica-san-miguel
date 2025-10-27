"use client";

import { styles } from "@/app/[locale]/styles";
import { clinicProfessionalCover } from "@/assets/images/cover";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const AboutProfessionals = () => {
  const t = useTranslations("home");

  const title = t("section3_title");
  const title_part = title.split(" ");
  const lastWord = title_part.pop();
  return (
    <main className="flex flex-col relative gap-6 my-10 p-3 w-[100vw] md:w-[90vw] lg:w-[85vw] xl:w-[75vw]">
      <section className="flex w-full justify-center">
        <article className="flex flex-col items-start gap-6 w-full sm:w-1/2">
          <h2 className="text-[40px] md:text-[50px] font-semibold text-[#19192C]">
            {title_part.join(" ")}
            <br />
            <span className="text-[#C1001F]">{lastWord}</span>
          </h2>
          <div className="text-[20px] md:text-[25px] text-left">
            {t("section3_text")}
          </div>
        </article>

        <article className="hidden sm:flex sm:justify-center sm:items-start sm:w-1/2">
          <Image
            src={clinicProfessionalCover}
            alt="clinic Professional Cover"
            className="object-cover aspect-auto h-[650px] w-[500px] rounded-[46px]"
          />
        </article>
      </section>
    </main>
  );
};
