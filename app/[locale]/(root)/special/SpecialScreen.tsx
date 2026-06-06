"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { TableRow } from "@/@types/database.types";
import { Link } from "@/navigation";
import { CalendarDays, Sparkles, Tag } from "lucide-react";
import { LazyImageWithLoader } from "@/components/LazyImageWithLoader";
import { useLazyLoad } from "@/hooks/useLazyLoad";

type SpecialPictureRow = Pick<
  TableRow<"special_picture">,
  "id" | "file_path" | "title" | "created_at"
>;

type SpecialItem = {
  id: number;
  title: string;
  imageUrl: string;
};

function SpecialSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm animate-pulse space-y-5">
      <div className="h-8 w-2/3 mx-auto bg-gray-200 rounded" />
      <div className="aspect-[4/5] sm:aspect-[3/4] max-w-xl mx-auto bg-gray-100 rounded-xl" />
    </div>
  );
}

type SpecialScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  noSpecials: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
};

export default function SpecialScreen({
  eyebrow,
  title,
  description,
  noSpecials,
  ctaTitle,
  ctaDescription,
  ctaButton,
}: SpecialScreenProps) {
  const [specials, setSpecials] = useState<SpecialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useLazyLoad({ triggerOnce: true, rootMargin: "200px" });

  useEffect(() => {
    if (!isVisible) return;

    let mounted = true;

    const fetchSpecials = async () => {
      try {
        const { data, error } = await supabase
          .from("special_picture")
          .select("id,file_path,title,created_at")
          .eq("display", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load specials:", error.message);
          return;
        }

        const mapped = (data ?? []).map((row: SpecialPictureRow) => {
          const { data: publicUrl } = supabase.storage
            .from("special_picture")
            .getPublicUrl(row.file_path);

          return {
            id: row.id,
            title: row.title?.trim() || "Special Offer",
            imageUrl: publicUrl.publicUrl,
          };
        });

        if (mounted) setSpecials(mapped);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchSpecials();
    return () => {
      mounted = false;
    };
  }, [isVisible]);

  const showGridSkeleton = !isVisible || loading;

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F]">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] leading-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      <section ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        {showGridSkeleton ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpecialSkeleton />
            <SpecialSkeleton />
          </div>
        ) : specials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8F5F0] px-6 py-16 text-center">
            <Tag className="mx-auto h-10 w-10 text-[#C1001F]/40 mb-3" />
            <p className="text-base font-medium text-[#19192C] font-poppins">
              {noSpecials}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 sm:gap-8 ${
              specials.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {specials.map((poster, index) => (
              <article
                key={poster.id}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-2 border-b border-gray-100 bg-[#FAFAFA] px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C1001F]/10">
                    <Sparkles className="h-4 w-4 text-[#C1001F]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold font-poppins text-[#19192C] leading-snug">
                    {poster.title}
                  </h2>
                  {index === 0 && specials.length > 1 && (
                    <span className="ml-auto rounded-full bg-[#C1001F] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 bg-[#F8F5F0]">
                    <LazyImageWithLoader
                      src={poster.imageUrl}
                      alt={poster.title}
                      sizes="(max-width: 1024px) 100vw, 560px"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="rounded-2xl border border-gray-100 bg-[#F8F5F0] px-6 sm:px-10 py-10 sm:py-12 text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C1001F]/10">
            <CalendarDays className="h-6 w-6 text-[#C1001F]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
            {ctaTitle}
          </h2>
          <p className="text-base text-[#3D3D3C] font-inter max-w-xl mx-auto leading-relaxed">
            {ctaDescription}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#C1001F] px-8 py-3.5 text-sm font-semibold font-poppins text-white shadow-sm hover:bg-[#a30019] transition-colors"
          >
            {ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
