"use client";

import Image from "next/image";

type AboutHeroProps = {
  eyebrow: string;
  headline: string;
  intro: string;
  imageUrl: string | null;
};



export default function AboutHero({
  eyebrow,
  headline,
  intro,
  imageUrl,
}: AboutHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col justify-center gap-5 order-2 lg:order-1">
          {eyebrow && (
            <p className="text-sm sm:text-base font-medium uppercase tracking-wider text-[#C1001F]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] leading-tight">
            {headline}
          </h1>
          {intro && (
            <p className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed max-w-xl">
              {intro}
            </p>
          )}
        </div>

        {imageUrl && (
          <div className="relative order-1 lg:order-2 h-64 sm:h-80 lg:h-[420px] rounded-xl overflow-hidden border border-gray-100 shadow-md bg-[#F8F5F0]">
            <Image
              src={imageUrl}
              alt={headline}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>
        )}
      </div>
    </section>
  );
}
