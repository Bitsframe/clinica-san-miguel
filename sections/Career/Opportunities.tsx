"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { Briefcase } from "lucide-react";

function OpportunitySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse space-y-3"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export const Opportunities = () => {
  const locale = useLocale();
  const t = useTranslations("career");
  const { fetchLocalizedTable } = useSupabase();
  const [opportunities, setOpportunities] = useState<{ id: number; Text: string | null }[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });

  useEffect(() => {
    if (isVisible && !hasFetched) {
      fetchLocalizedTable("career", locale)
        .then((rows) => {
          setOpportunities(rows);
          setHasFetched(true);
        })
        .catch((err) => console.error("Opportunities fetch error:", err));
    }
  }, [isVisible, hasFetched, fetchLocalizedTable, locale]);

  return (
    <section ref={ref}>
      {!hasFetched ? (
        <OpportunitySkeleton />
      ) : opportunities.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
          {opportunities.map((item) => (
            <li key={item.id}>
              <article className="group flex h-full gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-[#C1001F]/30 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10 transition-colors group-hover:bg-[#C1001F]/15">
                  <Briefcase className="h-4 w-4 text-[#C1001F]" />
                </div>
                <p className="text-sm sm:text-base text-[#19192C] font-poppins leading-relaxed pt-1.5">
                  {item.Text}
                </p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-[#C1001F]/40 mb-3" />
          <p className="text-base font-medium text-[#19192C] font-poppins">
            {t("no_opportunities")}
          </p>
        </div>
      )}
    </section>
  );
};
