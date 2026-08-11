import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/utils/seo";
import SpecialScreen from "./SpecialScreen";
import { supabase } from "@/supabaseClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "specials" });

  return buildPageMetadata({
    locale,
    title: t("specials_title"),
    description: t("description"),
    path: "/special",
  });
}

export default async function SpecialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "specials" });

  const { data: specialData } = await supabase
    .from("special_picture")
    .select("id,file_path,title,created_at")
    .eq("display", true)
    .order("created_at", { ascending: false });

  const mappedSpecials = (specialData ?? []).map((row) => {
    const { data: publicUrl } = supabase.storage
      .from("special_picture")
      .getPublicUrl(row.file_path);

    return {
      id: row.id,
      title: row.title?.trim() || "Special Offer",
      imageUrl: publicUrl.publicUrl,
    };
  });

  return (
    <main className="w-full py-8 sm:py-12">
      <SpecialScreen
        eyebrow={t("specials_title")}
        title={t("specials_sub_title")}
        description={t("description")}
        noSpecials={t("no_specials")}
        ctaTitle={t("cta_title")}
        ctaDescription={t("cta_description")}
        ctaButton={t("cta_button")}
        initialSpecials={mappedSpecials}
      />
    </main>
  );
}
