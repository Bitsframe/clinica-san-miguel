"use client";

import { earth_care, heart_with_pulse, journey } from "@/assets/images";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import LoadingSkeletonAboutScreen from "@/components/loading/LoadingSkeletonAboutScreen";
import AboutHero from "@/components/about/AboutHero";
import AboutRichContent from "@/components/about/AboutRichContent";
import AboutHighlight from "@/components/about/AboutHighlight";
import AboutStorySection from "@/components/about/AboutStorySection";
import {
  coalesceFeatureLists,
  extractIntro,
  groupAboutSections,
  parseAboutText,
  splitTitle,
} from "@/components/about/parseAboutText";

type AboutRow = {
  text_1?: string | null;
  title_1?: string | null;
  image_1?: string | null;
  title_2?: string | null;
  text_2?: string | null;
  image_2?: string | null;
  title_3?: string | null;
  text_3?: string | null;
  image_3?: string | null;
  title_4?: string | null;
  text_4?: string | null;
  image_4?: string | null;
  title_5?: string | null;
  text_5?: string | null;
  image_5?: string | null;
};

const AboutScreen = ({ initialData = null }: { initialData?: AboutRow | null }) => {
  const t = useTranslations("about_page");
  const locale = useLocale();
  const data = initialData;

  const { eyebrow, headline } = useMemo(
    () => splitTitle(data?.title_1),
    [data?.title_1]
  );

  const { intro, contentSections } = useMemo(() => {
    const blocks = coalesceFeatureLists(parseAboutText(data?.text_1));
    const { intro: introText, rest } = extractIntro(blocks);
    return { intro: introText, contentSections: groupAboutSections(rest) };
  }, [data?.text_1]);

  const storyItems = useMemo(
    () =>
      [
        {
          id: 1,
          image: data?.image_3 || journey,
          heading: data?.title_3 || t("story_1_title"),
          description: data?.text_3 || t("story_1_text"),
        },
        {
          id: 2,
          image: data?.image_4 || heart_with_pulse,
          heading: data?.title_4 || t("story_2_title"),
          description: data?.text_4 || t("story_2_text"),
        },
        {
          id: 3,
          image: data?.image_5 || heart_with_pulse,
          heading: data?.title_5 || t("story_3_title"),
          description: data?.text_5 || t("story_3_text"),
        },
      ].filter((item) => item.heading && item.description),
    [data, t]
  );

  if (!data) {
    return <LoadingSkeletonAboutScreen />;
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <AboutHero
        eyebrow={eyebrow}
        headline={headline}
        intro={intro}
        imageUrl={data.image_1 ?? null}
      />

      <AboutRichContent sections={contentSections} />

      {(data.title_2 || data.text_2) && (
        <AboutHighlight
          title={data.title_2 || t("bilingual_title")}
          text={data.text_2 || t("bilingual_text")}
          imageUrl={data.image_2 ?? null}
          fallbackImage={earth_care.src}
          badgeLabel={t("bilingual_badge")}
        />
      )}

      <AboutStorySection items={storyItems} heading={t("our_story")} />
    </main>
  );
};

export default AboutScreen;
