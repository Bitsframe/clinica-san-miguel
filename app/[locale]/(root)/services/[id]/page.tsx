"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import AboutService from "@/components/services/AboutService";
import SubContentSection from "@/components/services/SubContentSection";
import QuestionAnswers from "@/components/services/QuestionAnswers";
import FAQs from "@/components/services/FAQs";
import EndNote from "@/components/services/EndNote";
import ServiceSkeleton from "@/components/services/ServiceSkeleton";



export default function ServicePage() {
  const { fetchLocalizedRowById } = useSupabase();
  const locale = useLocale();
  const params = useParams();
  const id = params?.id as string;

  const [combined, setCombined] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [baseData, detailData] = await Promise.all([
        fetchLocalizedRowById("services", locale, Number(id)),
        fetchLocalizedRowById("allservices", locale, Number(id)),
      ]);

      const combinedData = {
        ...(baseData || {}),
        ...(detailData || {}),
      };

      console.log("Combined service data:", combinedData);
      setCombined(combinedData);
      setLoading(false);
    };

    fetchData();
  }, [locale, id, fetchLocalizedRowById]);

  if (loading)
    return (
     <ServiceSkeleton />
    );

  if (!combined)
    return (
      <div className="p-10 flex justify-center items-center min-h-screen text-lg text-red-600">
        Service not found.
      </div>
    );

  return (
    <main className="w-full px-4 py-10 md:px-6 lg:px-8 max-w-screen-xl mx-auto space-y-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-red-700 leading-tight">
        {combined.title}
      </h1>

      <section>
        <AboutService
          title={combined.title}
          about_content={combined.description}
          image_url={combined.image}
        />
      </section>

      <section>
        <SubContentSection
          subheading={combined.subheading}
          sub_content={combined.sub_content}
        />
      </section>

      {combined.question_answers && (
        <section>
          <QuestionAnswers items={combined.question_answers} />
        </section>
      )}

      {combined.faqs && (
        <section>
          <FAQs faqs={combined.faqs} />
        </section>
      )}

      <section>
        <EndNote end_tagline={combined.end_tagline} note={combined.note} />
      </section>
    </main>
  );
}
