import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import { supabase } from "@/supabaseClient";
import { CLINICA_TENANT_ID } from "@/utils/clinicaLocations";
import { DetailedLocation } from "./DetailedLocation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const locationId = Number.parseInt(slug, 10);

  if (!Number.isFinite(locationId)) {
    return buildPageMetadata({
      locale,
      title: "Clinic Location",
      path: `/contact/${slug}`,
    });
  }

  const { data } = await supabase
    .from("Locations")
    .select("title, address")
    .eq("id", locationId)
    .eq("tenant_id", CLINICA_TENANT_ID)
    .maybeSingle();

  const title = data?.title || "Clinic Location";
  const address = data?.address ? ` Located at ${data.address}.` : "";
  const description =
    locale === "es"
      ? `Visite ${title} de Clínica San Miguel.${address} Atención médica familiar asequible. Sin cita.`
      : `Visit ${title} at Clinica San Miguel.${address} Affordable family medicine. Walk-ins welcome.`;

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/contact/${slug}`,
  });
}

export default async function LocationDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DetailedLocation slug={slug} />;
}
