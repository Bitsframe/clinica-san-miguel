import { Metadata } from "next";
import { styles } from "@/app/[locale]/styles";
import { ServicesComponent } from "./ServicesComponent";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Medical Services",
  description:
    "Explore the full range of medical services offered at Clinica San Miguel — primary care, pediatrics, women's health, lab work, and more across Texas.",
  alternates: {
    canonical: "/services",
    languages: {
      en: "/services",
      es: "/es/services",
    },
  },
};

const Services = ({
  params,
}: {
  params: Promise<{ locale: string }>; 
}) => {
  // Destructure inside the body to "await" it manually
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("common");

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

        <ServicesComponent />
      </section>
    </main>
  );
};

export default Services;
