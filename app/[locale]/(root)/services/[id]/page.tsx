import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { supabase } from "@/supabaseClient";
import AboutService from "@/components/services/AboutService";
import SubContentSection from "@/components/services/SubContentSection";
import QuestionAnswers from "@/components/services/QuestionAnswers";
import FAQs from "@/components/services/FAQs";
import EndNote from "@/components/services/EndNote";

export const revalidate = 0;

/**
 * Confirmed cash prices, by service id. Only add an entry here once the price is
 * verified — this feeds Offer schema shown directly in Google search results.
 */
const KNOWN_SERVICE_PRICES: Record<string, number> = {
  "25": 220, // Immigration Medical Exam (USCIS civil surgeon)
};

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

/**
 * Fetch a service, falling back to the English row when a localized row is
 * missing so a partially-translated table never produces an empty page.
 */
async function getService(
  id: number,
  locale: string
): Promise<ServiceDetail | null> {
  const isEs = locale === "es";

  const read = async (
    base: "services" | "allservices"
  ): Promise<Record<string, unknown> | null> => {
    const table = isEs ? `${base}_es` : base;
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) return data as unknown as Record<string, unknown>;
    if (!isEs) return null;
    const { data: fallback } = await supabase
      .from(base)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return fallback ? (fallback as unknown as Record<string, unknown>) : null;
  };

  const [base, detail] = await Promise.all([read("services"), read("allservices")]);
  if (!base && !detail) return null;

  return { ...(base ?? {}), ...(detail ?? {}) } as ServiceDetail;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "service_detail" });

  // `/services/[id]` matches any string, so legacy slug URLs such as
  // /services/dentistry used to return HTTP 200 with a "not found" message —
  // a soft 404. Resolve known slugs to their real page, and hard-404 the rest
  // so crawlers get an honest status instead of a 200.
  if (!/^\d+$/.test(id)) {
    const { data: bySlug } = await supabase
      .from("services")
      .select("id")
      .eq("slug", id)
      .maybeSingle();

    const matchedId = (bySlug as { id?: number } | null)?.id;
    if (matchedId != null) {
      redirect(locale === "es" ? `/es/services/${matchedId}` : `/services/${matchedId}`);
    }
    notFound();
  }

  const service = await getService(Number(id), locale);

  if (!service?.title) {
    notFound();
  }

  const price = KNOWN_SERVICE_PRICES[id];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service!.title,
    provider: {
      "@type": "MedicalClinic",
      name: "Clinica San Miguel",
      url: "https://www.clinicsanmiguel.com",
    },
    description: service!.description || undefined,
    ...(price != null
      ? { offers: { "@type": "Offer", price: String(price), priceCurrency: "USD" } }
      : {}),
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AboutService
        title={service!.title}
        about_content={service!.about_content ?? service!.description ?? null}
        image_url={service!.image ?? null}
        backLabel={t("back_to_services")}
      />

      <SubContentSection
        subheading={service!.subheading ?? null}
        sub_content={service!.sub_content ?? null}
      />

      {service!.question_answers && service!.question_answers.length > 0 && (
        <QuestionAnswers
          items={service!.question_answers}
          heading={t("learn_more")}
        />
      )}

      {service!.faqs && service!.faqs.length > 0 && (
        <FAQs faqs={service!.faqs} heading={t("faqs_heading")} />
      )}

      {(service!.end_tagline || service!.note) && (
        <EndNote
          end_tagline={service!.end_tagline ?? null}
          note={service!.note ?? null}
        />
      )}
    </main>
  );
}
