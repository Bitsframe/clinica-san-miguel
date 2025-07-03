
import { styles } from "@/app/[locale]/styles";
import { LocationsData } from "./constants";
import { getTranslations } from "next-intl/server";

const Contact = async ({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ Fake Promise type
}) => {
  const { locale } = await params; 
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="flex flex-col gap-5">
      <section className="flex flex-col justify-center items-center my-10">
        <div className="flex flex-col justify-center items-center">
          <h1 className={`${styles.sectionHeadText} text-[#C1001F] uppercase`}>
            {t("location_title")}
          </h1>
          <p className={`${styles.sectionSubText} text-[#19192C]`}>
            {t("location_sub_title")}
          </p>
        </div>
        <article className="flex flex-wrap justify-center items-center gap-5">
          <LocationsData />
        </article>
      </section>

      {/* <Testimonials headingFlag={true} mode={"light"} /> */}
    </main>
  );
};

export default Contact;
