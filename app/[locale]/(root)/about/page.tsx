import { Metadata } from "next";
import AboutScreen from "./AboutScreen";

import { buildPageMetadata } from "@/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "About Us",
    description: "Learn about Clinica San Miguel — our mission, our team, and our commitment to providing affordable, quality healthcare to Texas families.",
    path: "/about",
  });
}
import { supabase } from "@/supabaseClient";

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const tableName = locale === "es" ? "about_es" : "about";
  const { data: aboutData } = await supabase.from(tableName).select("*");
  let finalData = aboutData || [];
  
  if (locale === "es" && finalData.length === 0) {
    const { data: fallbackData } = await supabase.from("about").select("*");
    finalData = fallbackData || [];
  }

  return <AboutScreen initialData={finalData[0] || null} />;
}
