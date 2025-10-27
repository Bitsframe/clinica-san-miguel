"use client";

import { styles } from "@/app/[locale]/styles";
import { about } from "@/assets/images";
import { About } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";

export const AboutSection = () => {
  const t = useTranslations("common");
  const locale = useLocale();

  const { aboutShort, aboutShort_es } = useSupabase();

  // console.log("LOCale:", locale);

  const content =
    locale === "es" ? aboutShort_es?.[0]?.content : aboutShort?.[0]?.content;

  return (
    <section className="w-full flex flex-col justify-center gap-10 items-center my-14">
      <h1 className={`${styles.sectionHeadText} flex text-[#C1001F]`}>
        {t("about_us_title")}
      </h1>
      <About image={about} heading={t("about_us_title")} content={content} />
    </section>
  );
};
