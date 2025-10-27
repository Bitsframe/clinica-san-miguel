import {
  Blue_and_Red_Health_Icons_Medical_Conference_Poster,
  Grey_Modern_Best_Medical_Service_Poster,
  consulta_poster,
  immigration_medical_exam_poster,
} from "@/assets/images";
import { Locations, Services, Testimonials } from "@/sections";
import Image from "next/image";
import { styles } from "@/app/[locale]/styles";
import { useTranslations } from "next-intl";

const Special = ({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ Fake async for Next.js compatibility
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("specials");

  const special_posters = [
    {
      id: 1,
      heading: t("first_special_title"),
      image: Blue_and_Red_Health_Icons_Medical_Conference_Poster,
    },
    {
      id: 2,
      heading: t("second_special_title"),
      image: consulta_poster,
    },
    {
      id: 3,
      heading: t("third_special_title"),
      image: immigration_medical_exam_poster,
    },
    {
      id: 4,
      heading: t("fourth_special_title"),
      image: Grey_Modern_Best_Medical_Service_Poster,
    },
  ];

  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-10">
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
            {t("specials_title")}
          </h1>
          <h1 className={`${styles.sectionHeadText} text-customGray`}>
            {t("specials_sub_title")}
          </h1>
        </div>

        <article className="bg-[#19192C] rounded-[20px] w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] h-full p-14 flex flex-col justify-center items-center gap-4">
          {special_posters.map((poster) => (
            <article
              className="flex flex-col gap-3 items-center justify-center"
              key={poster.id}
            >
              <h2 className="text-[25px] sm:text-[30px] md:text-[40px] lg:text-[48px] text-[#ffffff] text-center font-poppins">
                {poster.heading}
              </h2>
              <div>
                <Image
                  src={poster.image}
                  alt=""
                  className="rounded-[20px] h-full aspect-auto w-[340px] md:w-[500px] lg:w-[700px]"
                />
              </div>
            </article>
          ))}
        </article>
      </section>

      {/* <div className="w-full flex justify-center">
        <Services />
      </div>
      <Locations /> */}
      {/* <Testimonials headingFlag={true} mode={"light"} /> */}
    </main>
  );
};

export default Special;
