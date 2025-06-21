"use client";

import { styles } from "@/app/[locale]/styles";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

// Accordion item component
const AccordionItem = ({
  question,
  answer,
  isOpen,
  toggleAccordion,
}: {
  question: string | null | undefined;
  answer: string | null | undefined;
  isOpen: boolean;
  toggleAccordion: () => void;
}) => {
  return (
    <div className="w-full rounded-md bg-[#E1E3E6] border border-[#D1D5DB] shadow-sm transition-all ">
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <h4 className="text-[16px] font-poppins font-medium text-[#0D0D28]">
          {question}
        </h4>
        {isOpen ? (
          <IoIosArrowUp className="text-[16px] text-[#0D0D28]" />
        ) : (
          <IoIosArrowDown className="text-[16px] text-[#0D0D28]" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-[15px] text-[#444] font-poppins transition-all">
          {answer}
        </div>
      )}
    </div>
  );
};

// Main FAQs component
export const FAQs = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const t = useTranslations("home");
  const locale = useLocale();
  const { faqs, faqs_es } = useSupabase();

  const data = locale === "es" ? faqs_es : faqs;

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <section className="flex w-full flex-col items-center py-[4%] bg-[#F4F5F6] mt-20">
      <h1 className={`${styles.sectionHeadText} text-[#0D0D28]`}>
        {t("faq_title")}
      </h1>
      <h3 className="text-base text-[#606877] text-center max-w-xl mt-2 leading-relaxed">
        {t("faq_subtitle")}
      </h3>
      <div className="flex flex-col w-full max-w-2xl gap-4 mt-10">
        {data &&
          data.map(
            (
              faq: {
                id: number;
                question: string | null | undefined;
                answer: string | null | undefined;
              },
              index: number
            ) => (
              <AccordionItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={index === openAccordion}
                toggleAccordion={() => toggleAccordion(index)}
              />
            )
          )}
      </div>
    </section>
  );
};
