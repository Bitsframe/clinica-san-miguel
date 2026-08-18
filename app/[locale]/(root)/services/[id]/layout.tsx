import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import { supabase } from "@/supabaseClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isEs = locale === "es";

  // Per-service title/description so each page is distinct to crawlers,
  // and so the canonical/hreflang self-reference rather than pointing at
  // the /services index.
  const table = isEs ? "services_es" : "services";
  const { data } = await supabase
    .from(table)
    .select("title, description")
    .eq("id", Number(id))
    .maybeSingle();

  const serviceTitle = (data as { title?: string } | null)?.title?.trim();
  const serviceDesc = (data as { description?: string } | null)?.description?.trim();

  const fallbackTitle = isEs ? "Servicios Médicos" : "Medical Services";
  const fallbackDesc = isEs
    ? "Explore los servicios médicos de Clínica San Miguel, incluida atención primaria, pediatría y más."
    : "Explore medical services at Clinica San Miguel including primary care, pediatrics, and more.";

  // Ignore placeholder/junk descriptions rather than emitting them as meta.
  const usableDesc =
    serviceDesc && serviceDesc.length >= 30 ? serviceDesc : undefined;

  const description = usableDesc
    ? usableDesc
    : serviceTitle
      ? isEs
        ? `${serviceTitle} en Clínica San Miguel. Sin cita previa, precios accesibles, personal bilingüe en todo Texas.`
        : `${serviceTitle} at Clinica San Miguel. Walk-ins welcome, affordable cash pricing, bilingual staff across Texas.`
      : fallbackDesc;

  return buildPageMetadata({
    locale,
    title: serviceTitle || fallbackTitle,
    description,
    path: `/services/${id}`,
  });
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
