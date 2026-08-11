"use client";

import { styles } from "@/app/[locale]/styles";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import FAQsLoadingSkeleton from "@/components/loading/FAQsLoadingSkeleton"; // ✅ Import here

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
    <div className="w-full rounded-md bg-gradient-to-r from-[#A9A9A9] to-[#D1D3D4] border border-[#D1D5DB] shadow-sm transition-all">
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors hover:bg-[#D1D5DB]/20"
      >
        <span className="text-[16px] font-poppins font-normal text-[#0D0D28]">
          {question}
        </span>
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

export const FAQs = ({ initialFaqsData = [] }: { initialFaqsData?: any[] }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  // Data is passed from server component
  const faqsData = initialFaqsData;
  const hasFetched = true;

  const t = useTranslations("home");
  const locale = useLocale();
  // Removed client-side fetching as data comes from server

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="flex w-full flex-col items-center py-[4%] bg-[#F4F5F6] mt-20"
    >
      <h2 className={`${styles.sectionHeadText} text-[#0D0D28]`}>
        {t("faq_title")}
      </h2>
      <p className="text-base text-[#4B5563] text-center max-w-xl mt-2 leading-relaxed">
        {t("faq_subtitle")}
      </p>

      {faqsData && faqsData.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqsData.map((faq: any) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      <div className="flex flex-col w-full max-w-2xl gap-4 mt-10 px-4 sm:px-0">
        {!hasFetched ? (
          <FAQsLoadingSkeleton />
        ) : (
          faqsData.map(
            (
              faq: { id: number; question: string; answer: string },
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
          )
        )}
      </div>
    </section>
  );
};
