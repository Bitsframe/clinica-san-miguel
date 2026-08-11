"use client";

import Image from "next/image";
import { Languages } from "lucide-react";

type AboutHighlightProps = {
  title: string;
  text: string;
  imageUrl: string | null;
  fallbackImage: string;
  badgeLabel: string;
};



export default function AboutHighlight({
  title,
  text,
  imageUrl,
  fallbackImage,
  badgeLabel,
}: AboutHighlightProps) {
  const displayTitle = title.replace(/\r?\n/g, " ");

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-2 relative min-h-[220px] sm:min-h-[280px] bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
          <Image
            src={imageUrl || fallbackImage}
            alt=""
            fill
            className="object-contain p-8 sm:p-10 opacity-90"
            unoptimized
          />
        </div>

        <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-4">
          <div className="inline-flex items-center gap-2 w-fit rounded-full bg-[#C1001F]/10 px-4 py-1.5">
            <Languages className="h-4 w-4 text-[#C1001F]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C1001F] uppercase tracking-wide">
              {badgeLabel}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C] leading-snug">
            {displayTitle}
          </h2>

          <p className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
