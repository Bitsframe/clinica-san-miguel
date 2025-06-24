"use client";

import { styles } from "@/app/[locale]/styles";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

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
    <div className="w-full rounded-md bg-gradient-to-r from-[#D3D4D6] to-[#F4F5F6] border border-[#D1D5DB] shadow-sm transition-all">

      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors hover:bg-[#D1D5DB]/20"
      >
      <h4 className="text-[16px] font-poppins font-normal text-[#0D0D28]">
          {question}
        </h4>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#0D0D28] text-2xl"
        >
          {isOpen ? <IoIosRemove /> : <IoIosAdd />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-5 text-[#444] font-poppins text-base"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
