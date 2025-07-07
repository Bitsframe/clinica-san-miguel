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
    <section className="relative  rounded-lg overflow-hidden ">
      {/* Image container */}
<div className="relative flex flex-col md:flex-row ">
  {image_url && (
    <div className="relative w-full md:w-2/5 h-64 md:h-[400px] rounded-lg overflow-hidden">
      <Image
        src={image_url}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 40vw"
      />
    </div>
  )}
</div>


      {/* Absolutely positioned About box on image's right side */}
      <div
  className="absolute top-1/2 md:right-[4.45rem] -translate-y-1/2 px-8 py-6 max-w-md"
  style={{ backgroundColor: '#6b6b6a' }}
>
  <h2 className="text-4xl font-extrabold text-white mb-4">About</h2>
  {about_content && (
    <p className="text-white text-2xl font-light leading-snug">
      {about_content}
    </p>
  )}
</div>

    </section>
  );
}
