import { Metadata } from "next";
import { LocationsData } from "./constants";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Find a Clinic Near You",
  description:
    "Find your nearest Clinica San Miguel location in Texas. Walk-ins welcome. Clinics serving Houston, San Antonio, and surrounding communities.",
  alternates: {
    canonical: "/contact",
    languages: {
      en: "/contact",
      es: "/es/contact",
    },
  },
};

const Contact = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="w-full py-8 sm:py-12">
      <section className="flex flex-col items-center gap-8 sm:gap-10 mb-8 sm:mb-10 px-4">
        <div className="text-center space-y-2 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F]">
            {t("link_contact")}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C]">
            {t("location_title")}
          </h1>
          <p className="text-base sm:text-lg text-[#3D3D3C] font-inter">
            {t("location_sub_title")}
          </p>
        </div>
      </section>

      <LocationsData />
    </main>
  );
};

export default Contact;
