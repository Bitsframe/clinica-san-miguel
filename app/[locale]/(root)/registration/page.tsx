import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import RegistrationPage from "./RegistrationPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return buildPageMetadata({
    locale,
    title: isEs ? "Registro de Paciente" : "Patient Registration",
    description:
      locale === "es"
        ? "Regístrese como paciente en Clínica San Miguel. Complete su información para agilizar su próxima visita."
        : "Register as a patient at Clinica San Miguel. Complete your information to streamline your next clinic visit.",
    path: "/registration",
    // Collects DOB, allergies and emergency contacts. No search value, and it
    // should never surface in results.
    noindex: true,
  });
}

export default function Page() {
  return <RegistrationPage />;
}
