import { Metadata } from "next";
import AboutScreen from "./AboutScreen";

export default function About({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ Fake Promise type to satisfy Next.js page type check
}) {
  // You can access the locale like this if needed:
  // const { locale } = await params;

  return <AboutScreen />;
}
