import { Metadata } from "next";
import { styles } from "@/app/[locale]/styles";
import { ServicesComponent } from "./ServicesComponent";
import { getTranslations } from "next-intl/server";

import { buildPageMetadata } from "@/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "Medical Services",
    description: "Explore the full range of medical services offered at Clinica San Miguel — primary care, pediatrics, women's health, lab work, and more across Texas.",
    path: "/services",
  });
}

import { supabase } from "@/supabaseClient";

const Services = async ({
  params,
}: {
  params: Promise<{ locale: string }>; 
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const tableName = locale === "es" ? "services_es" : "services";
  const { data: rawServices } = await supabase.from(tableName).select("*");
  let servicesData = rawServices || [];
  
  if (locale === "es" && servicesData.length === 0) {
    const { data: fallbackData } = await supabase.from("services").select("*");
    servicesData = fallbackData || [];
  }

  return (
    <main className="flex flex-col gap-5">
      <section className="flex flex-col justify-center items-center my-10">
        <div className="flex flex-col justify-center items-center">
          <p className={`${styles.sectionSubText} text-[#19192C]`}>
            {t("services_sub_title")}
          </p>
          <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
            {t("services_title")}
          </h1>
        </div>

        <ServicesComponent initialServices={servicesData} />
      </section>
    </main>
  );
};

export default Services;
