"use client";

import { AdditionalService } from "@/components";
import { Locations, Services, Testimonials } from "@/sections";
import { additionalServices } from "@/constants";
import { styles } from "@/app/[locale]/styles";

const AdditionalServices = () => {
  return (
    <main>
      <section className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
            additional services
          </h1>
        </div>

        <article className="w-full font-poppins bg-[#19192C] flex justify-center items-center text-center p-3 my-5 text-[16px] xl:text-[20px] text-[#F8F5F0]">
          Our highly qualified staff will assist you quickly and without an
          appointment. Come directly to our facilities. We speak English and
          Spanish.
        </article>

        <article className="flex flex-wrap justify-center items-center gap-8 my-[5%]">
          {additionalServices.map((service) => (
            <AdditionalService
              image={service.image}
              heading={service.heading}
              description={service.description}
              key={service.id}
            />
          ))}
        </article>
      </section>

      <div className="w-full flex justify-center">
        <Services />
      </div>
      <Locations />
      <Testimonials headingFlag={true} mode={"light"} />
    </main>
  );
};

export default AdditionalServices;
