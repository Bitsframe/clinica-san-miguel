import { Metadata } from "next";
import AboutScreen from "./AboutScreen";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Clinica San Miguel — our mission, our team, and our commitment to providing affordable, quality healthcare to Texas families.",
  alternates: {
    canonical: "/about",
    languages: {
      en: "/about",
      es: "/es/about",
    },
  },
};

export default function About({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ Fake Promise type to satisfy Next.js page type check
}) {
  // You can access the locale like this if needed:
  // const { locale } = await params;

  return <AboutScreen />;
}
