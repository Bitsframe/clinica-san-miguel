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

      setCombined(combinedData);
      setLoading(false);
    };

    fetchData();
  }, [locale, id, fetchLocalizedRowById]);

  if (loading) return <ServiceSkeleton />;

  if (!combined)
    return (
      <div className="p-10 flex justify-center items-center min-h-screen text-lg text-red-600">
        Service not found.
      </div>
    );

  return (
    <main className="w-full px-4 py-10 md:px-6 lg:px-8 max-w-screen-xl mx-auto space-y-10">
      {/* Page Header matching your screenshot */}
      <div className="text-center space-y-1 mb-12">
        <p className="text-[20px] md:text-[24px] text-gray-700 font-medium">What we Offer</p>
        <h1 className="text-5xl md:text-6xl font-bold text-[#C8102E]">
          Services
        </h1>
      </div>

      {/* FORCED GRID FOR TABLETS:
          grid: activates grid layout
          grid-cols-1: 1 card on mobile
          md:grid-cols-2: 2 cards on iPad/Tablets (Forced)
          lg:grid-cols-3: 3 cards on Desktop
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {/* If AboutService is a single card, you might need to map your data here */}
        <AboutService
          title={combined.title}
          about_content={combined.description}
          image_url={combined.image}
        />
        
        {/* Placeholder: If you have more cards to show in this specific section, 
            they will now automatically snap into 2 columns on tablets. */}
      </section>

      <div className="bg-white rounded-xl p-8 mt-12 shadow-md border border-gray-100">
        <section>
          <SubContentSection
            subheading={combined.subheading}
            sub_content={combined.sub_content}
          />
        </section>
      </div>

      {combined.question_answers && (
        <section className="pt-10">
          <QuestionAnswers items={combined.question_answers} />
        </section>
      )}

      {combined.faqs && (
        <section className="pt-10">
          <FAQs faqs={combined.faqs} locale={locale} />
        </section>
      )}

      <section className="pt-10 pb-20">
        <EndNote end_tagline={combined.end_tagline} note={combined.note} />
      </section>
    </main>
  );
}