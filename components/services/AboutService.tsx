"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
type AboutServiceProps = {
  title: string;
  about_content: string | null;
  image_url: string | null;
  backLabel: string;
};

export default function AboutService({
  title,
  about_content,
  image_url,
  backLabel,
}: AboutServiceProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col justify-center gap-6 order-2 lg:order-1">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3D3D3C] hover:text-[#C1001F] transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] leading-tight">
            {title}
          </h1>

          {about_content && (
            <p className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed max-w-xl">
              {about_content}
            </p>
          )}
        </div>

        {image_url && (
          <div className="relative order-1 lg:order-2 w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-md">
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
