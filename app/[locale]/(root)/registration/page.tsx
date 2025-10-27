import { Testimonials } from "@/sections";
import { styles } from "@/app/[locale]/styles";

import Image from "next/image";
import {
  EmergencyContact,
  Patient,
  Pharmacy,
  ReferralSource,
} from "@/components";
import { form } from "@/assets/images";

const Registration = () => {
  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-20 mb-14">
        <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
          Digital Registration
        </h1>
      </section>

      <section className="flex flex-col items-center gap-5 justify-center w-full">
        <article className="w-[95%] md:w-[90%] lg:w-[80%] p-5 md:p-10 flex items-center justify-start gap-3 bg-customGray rounded-[10px]">
          <div className="w-[15%] md:w-[10%] flex justify-start items-start">
            <Image
              src={form}
              alt={""}
              className="w-[45px] lg:w-[70px] aspect-auto"
            />
          </div>
          <div className="flex flex-col w-[85%] md:w-[90%] items-start gap-4 justify-start">
            <h1
              className={`${styles.sectionHeadText} text-[#F8F5F0]`}
              style={{ textAlign: "left" }}
            >
              General Consultation
            </h1>
            <p
              className={`${styles.sectionSubText} text-[#F8F5F0]`}
              style={{ textAlign: "left" }}
            >
              Complete this before your appointment and your provider can be
              better prepared during their time with you.
            </p>
          </div>
        </article>
        <Patient />
        <EmergencyContact />
        <article className="flex flex-col md:flex-row gap-5 items-center justify-center w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="w-full md:w-1/2">
            <ReferralSource />
          </div>
          <div className="w-full md:w-1/2">
            <Pharmacy />
          </div>
        </article>
      </section>

      <Testimonials headingFlag={true} mode={"light"} />
    </main>
  );
};

export default Registration;
