"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import AboutService from "@/components/services/AboutService";
import QuestionAnswers from "@/components/services/QuestionAnswers";
import FAQs from "@/components/services/FAQs";
import EndNote from "@/components/services/EndNote";

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

      console.log("🟢 Combined service data:", combinedData);
      setCombined(combinedData);
      setLoading(false);
    };

    fetchData();
  }, [locale, id, fetchLocalizedRowById]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!combined) return <div className="p-10 text-center">Service not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <AboutService
        title={combined.title}
        about_content={combined.description}
        subheading={combined.subheading}
        sub_content={combined.sub_content}
        image_url={combined.image }
      />

      {combined.question_answers && (
        <QuestionAnswers items={combined.question_answers} />
      )}

      {combined.faqs && (
        <FAQs faqs={combined.faqs} />
      )}

      <EndNote end_tagline={combined.end_tagline} note={combined.note} />
    </div>
  );
}
