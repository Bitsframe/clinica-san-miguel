"use client";

import Image, { type StaticImageData } from "next/image";
import { getSupabaseImageUrl } from "@/utils/supabaseImage";

type StoryItem = {
  id: number;
  image: string | StaticImageData;
  heading: string;
  description: string;
};

type AboutStorySectionProps = {
  items: StoryItem[];
  heading: string;
};

const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return getSupabaseImageUrl(src, { width, quality: quality ?? 75 });
};

export default function AboutStorySection({ items, heading }: AboutStorySectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C] text-center">
        {heading}
      </h2>

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, index) => {
          const isReversed = index % 2 === 1;

          return (
            <article
              key={item.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm ${
                isReversed ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={`relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden bg-[#F8F5F0] ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-4 sm:p-6"
                  {...(typeof item.image === "string" ? { loader: customLoader } : {})}
                />
              </div>

              <div className={`space-y-3 ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#C1001F]/10 text-sm font-bold text-[#C1001F]">
                  {index + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-poppins text-[#19192C] leading-snug">
                  {item.heading.replace(/\r?\n/g, " ")}
                </h3>
                <p className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
