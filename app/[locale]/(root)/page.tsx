import "regenerator-runtime/runtime";
import { useTranslations } from "next-intl";

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

} from "@/sections";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("home");

  return (
    <main className="flex flex-col justify-center items-center overflow-x-hidden gap-10">
      <div className="w-full bg-[#F1F1F1]">
        <HeroTopSection />
      </div>
      <GroupedLocations />
      <Treatments />
      <CommunityMission />
      <WeCare />
      <PatientStories />
      <TrustedPartner />
      
      {/* <AboutProfessionals /> */}
      {/* <Hero /> */}
      {/* <Testimonials headingFlag={true} mode={"dark"} /> */}
      {/* <AboutSection /> */}
      {/* <Locations /> */}
      <FAQs />
      <AboveFooter />
    </main>
  );
}
