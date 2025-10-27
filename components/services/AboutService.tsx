"use client";

import Image from "next/image";

type AboutServiceProps = {
  title: string;
  about_content: string | null;
  image_url: string | null;
};

export default function AboutService({
  title,
  about_content,
  image_url,
}: AboutServiceProps) {
  return (
    <section className="w-full flex flex-col md:flex-row items-stretch md:gap-0">
      {/* Image */}
      {image_url && (
        <div className="relative w-full md:w-1/3 h-64 md:h-[400px] flex-shrink-0 overflow-hidden rounded-lg md:rounded-r-none">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </div>
      )}

    {/* About box */}
<div className="w-full md:w-2/3 max-w-prose px-4 py-4 md:px-6 md:py-4 flex flex-col gap-4 bg-neutral-700 text-white md:mt-20 self-start">
  <h2 className="text-2xl md:text-5xl font-bold">About</h2>
  {about_content && (
    <p className="text-base md:text-3xl font-extralight leading-relaxed">
      {about_content}
    </p>
  )}
</div>

    </section>
  );
}
