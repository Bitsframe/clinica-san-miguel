
import { getTranslations, getLocale } from "next-intl/server";
import "regenerator-runtime/runtime";
import {
  AboutProfessionals,
  AboutSection,
  CommunityMission,
  FAQs,
  GroupedLocations,
  Hero,
  HeroTopSection,
  Locations,
  Testimonials,
  Treatments,
  WeCare,
  PatientStories,
  TrustedPartner,
  AboveFooter,
  StickyMobileButton,
} from "@/sections";

export default async function Home() {
  const locale = await getLocale(); 
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <main className="flex flex-col justify-center items-center overflow-x-hidden gap-10">
      <div id="hero-section" className="w-full bg-[#FFFFFF] ">
        <HeroTopSection />
      </div>
      <GroupedLocations />
      <Treatments />
      <CommunityMission />
      <WeCare />
      <PatientStories />
      <TrustedPartner />
      <FAQs />
      <AboveFooter />
      <StickyMobileButton />
    </main>
  );
}
