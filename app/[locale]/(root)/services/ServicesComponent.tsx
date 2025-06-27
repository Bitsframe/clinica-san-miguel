"use client";

import { CompactService } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale } from "next-intl";
import { useMemo } from "react";

export const ServicesComponent = () => {
  const locale = useLocale();

  const { services, services_es } = useSupabase();

  const data = locale === "es" ? services_es : services;

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.id - b.id);
  }, [data]);


  useMemo
  return (
    <article className="flex flex-wrap justify-center items-center gap-5">
      {sortedData.map((service) => (
        <CompactService
          id={service.id}
          heading={service.title}
          icon={service.icon}
          description={service.description}
          // mode={service.id % 2 === 0 ? "light" : "dark"}
          mode={"light"}
          key={service.id}
        />
      ))}
    </article>
  );
};
