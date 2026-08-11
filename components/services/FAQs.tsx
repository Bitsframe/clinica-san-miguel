"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqAnswerBlock = {
  type: "paragraph" | "bullet";
  content: string;
};

type Faq = {
  question: string;
  answer: FaqAnswerBlock[] | string | string[];
};

type FaqsProps = {
  faqs: Faq[] | null;
  heading: string;
};

function renderFaqAnswer(answer: Faq["answer"]) {
  if (Array.isArray(answer)) {
    if (typeof answer[0] === "string") {
      return (
        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-[#3D3D3C] ml-1">
          {(answer as string[]).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-2">
        {(answer as FaqAnswerBlock[]).map((block, i) => {
          if (block.type === "paragraph") {
            return (
              <p key={i} className="text-sm sm:text-base text-[#3D3D3C] leading-relaxed">
                {block.content}
              </p>
            );
          }
          if (block.type === "bullet") {
            return (
              <ul key={i} className="list-disc list-inside text-sm sm:text-base text-[#3D3D3C] ml-1">
                <li>{block.content}</li>
              </ul>
            );
          }
          return null;
        })}
      </div>
    );
  }

  if (typeof answer === "string") {
    return <p className="text-sm sm:text-base text-[#3D3D3C] leading-relaxed">{answer}</p>;
  }

  return null;
}

export default function Faqs({ faqs, heading }: FaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
        {heading}
      </h2>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-semibold font-poppins text-[#19192C] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#C1001F] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  {renderFaqAnswer(faq.answer)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
