import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import TestimonialsPage from "./TestimonialsPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: "Patient Testimonials",
    description:
      locale === "es"
        ? "Lea reseñas y testimonios de pacientes de Clínica San Miguel. Descubra por qué las familias de Texas confían en nosotros."
        : "Read patient reviews and testimonials for Clinica San Miguel. See why Texas families trust us for affordable, compassionate family medicine.",
    path: "/testimonials",
  });
}

export default function Page() {
  return <TestimonialsPage />;
}
