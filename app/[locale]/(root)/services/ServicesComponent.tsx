"use client";

import { CompactService } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { CompactServiceSkeleton } from "@/components/loading/CompactServiceSkeleton";

export const ServicesComponent = () => {
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();  
  const [data, setData] = useState<any[]>([]);  
  const [hasFetched, setHasFetched] = useState(false);  

  useEffect(() => {
  
    fetchLocalizedTable("services", locale)
      .then((rows) => {
        setData(rows);
        setHasFetched(true);
        console.log("✅ Services data fetched");
      })
      .catch((err) => console.error("❌ Services fetch error:", err));
  }, [locale, fetchLocalizedTable]); 

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.id - b.id);
  }, [data]);

  return (
    <article className="flex flex-wrap justify-center items-center gap-5">
      {hasFetched && sortedData.length > 0 ? (
        sortedData.map((service) => (
          <CompactService
            id={service.id}
            heading={service.title}
            icon={service.icon}
            description={service.description}
            mode={"light"}  // Set mode as light or dark based on your requirements
            key={service.id}
          />
        ))
      ) : (
        <>
  {[...Array(4)].map((_, index) => (
    <CompactServiceSkeleton key={index} />
  ))}
</>
      )}
    </article>
  );
};
