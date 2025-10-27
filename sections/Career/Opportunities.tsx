"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale } from "next-intl";
import { useLazyLoad } from "@/hooks/useLazyLoad";  
import Spinner from "@/components/Spinner";


export const Opportunities = () => {
  const locale = useLocale();
  const { fetchLocalizedTable } = useSupabase();
  const [opportunities, setOpportunities] = useState<any[]>([]); 
  const [hasFetched, setHasFetched] = useState(false);

  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });  

  useEffect(() => {
    if (isVisible && !hasFetched) {
      // Fetch data only when the section becomes visible
      fetchLocalizedTable("career", locale)
        .then((rows) => {
          setOpportunities(rows);
          setHasFetched(true);
          console.log("✅ Opportunities data fetched");
        })
        .catch((err) => console.error("❌ Opportunities fetch error:", err));
    }
  }, [isVisible, hasFetched, fetchLocalizedTable, locale]);

  return (
    <section ref={ref}>
      <ul>
        {hasFetched && opportunities.length > 0 ? (
          opportunities.map((item, index) => (
            <li
              className="list-disc text-[16px] xl:text-[20px] text-[#000000] font-poppins"
              key={index}
            >
              {item.Text}
            </li>
          ))
        ) : (
         <div className="flex justify-center items-center py-10">
  <Spinner />
</div>
        )}
      </ul>
    </section>
  );
};
