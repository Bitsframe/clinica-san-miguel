"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export const ImageCarousel = ({
  imagesData,
}: {
  imagesData: (string | null)[] | undefined;
}) => {
  const images = (imagesData ?? []).filter(Boolean) as string[];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [imagesData]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#F8F5F0]">
        <div className="flex flex-col items-center gap-2 text-[#6C7582]">
          <ImageIcon className="h-10 w-10 opacity-40" />
          <span className="text-sm font-poppins">No photos available</span>
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <section className="w-full space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm group">
        <Image
          src={activeImage}
          alt="Clinic photo"
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#19192C] shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#19192C] shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === activeIndex
                  ? "border-[#C1001F] ring-2 ring-[#C1001F]/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
