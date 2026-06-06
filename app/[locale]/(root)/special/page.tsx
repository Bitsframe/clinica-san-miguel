import { getTranslations } from "next-intl/server";
import SpecialScreen from "./SpecialScreen";

export default async function SpecialPage() {
  const t = await getTranslations("specials");

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
      />
    </main>
  );
}
