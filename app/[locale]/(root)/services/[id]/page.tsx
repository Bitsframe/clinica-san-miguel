"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import AboutService from "@/components/services/AboutService";
import SubContentSection from "@/components/services/SubContentSection";
import QuestionAnswers from "@/components/services/QuestionAnswers";
import FAQs from "@/components/services/FAQs";
import EndNote from "@/components/services/EndNote";
import ServiceSkeleton from "@/components/services/ServiceSkeleton";

type ServiceDetail = {
  title?: string | null;
  description?: string | null;
  about_content?: string | null;
  image?: string | null;
  subheading?: string | null;
  sub_content?: { type: "paragraph" | "bullet"; content: string }[] | null;
  question_answers?: {
    question: string;
    answer: string | { type: "paragraph" | "bullet"; content: string }[];
  }[] | null;
  faqs?: {
    question: string;
    answer: string | string[] | { type: "paragraph" | "bullet"; content: string }[];
  }[] | null;
  end_tagline?: string | null;
  note?: string | null;
};

export default function ServicePage() {
  const { fetchLocalizedRowById } = useSupabase();
  const locale = useLocale();
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("service_detail");

  const [combined, setCombined] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      const [baseData, detailData] = await Promise.all([
        fetchLocalizedRowById("services", locale, Number(id)),
        fetchLocalizedRowById("allservices", locale, Number(id)),
      ]);

      setCombined({
        ...(baseData || {}),
        ...(detailData || {}),
      } as ServiceDetail);
      setLoading(false);
    };

    fetchData();
  }, [locale, id, fetchLocalizedRowById]);

  if (loading) return <ServiceSkeleton />;

  if (!combined?.title) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-medium text-[#C1001F]">{t("not_found")}</p>
      </div>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {combined?.title && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": combined.title,
              "provider": {
                "@type": "MedicalClinic",
                "name": "Clinica San Miguel",
                "url": "https://www.clinicsanmiguel.com"
              },
              "description": combined.description || undefined
            }),
          }}
        />
      )}
      <AboutService
        title={combined.title}
        about_content={combined.description ?? null}
        image_url={combined.image ?? null}
        backLabel={t("back_to_services")}
      />

      <SubContentSection
        subheading={combined.subheading ?? null}
        sub_content={combined.sub_content ?? null}
      />

      {combined.question_answers && combined.question_answers.length > 0 && (
        <QuestionAnswers
          items={combined.question_answers}
          heading={t("learn_more")}
        />
      )}

      {combined.faqs && combined.faqs.length > 0 && (
        <FAQs faqs={combined.faqs} heading={t("faqs_heading")} />
      )}

      {(combined.end_tagline || combined.note) && (
        <EndNote
          end_tagline={combined.end_tagline ?? null}
          note={combined.note ?? null}
        />
      )}
    </main>
  );
}
