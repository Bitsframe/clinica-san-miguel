import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: "Medical Services",
    description:
      locale === "es"
        ? "Explore los servicios médicos de Clínica San Miguel, incluida atención primaria, pediatría y más."
        : "Explore medical services at Clinica San Miguel including primary care, pediatrics, and more.",
    path: "/services",
  });
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
