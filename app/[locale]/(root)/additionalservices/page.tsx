import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import AdditionalServicesPage from "./AdditionalServicesPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: "Additional Services",
    description:
      locale === "es"
        ? "Servicios médicos adicionales en Clínica San Miguel. Atención rápida sin cita en Texas."
        : "Additional medical services at Clinica San Miguel. Fast walk-in care across Texas clinics.",
    path: "/additionalservices",
  });
}

export default function Page() {
  return <AdditionalServicesPage />;
}
