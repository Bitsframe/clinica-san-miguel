
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
import PhoneNumbersBar from "@/components/PhoneNumbersBar";
import Script from "next/script";

export default async function Home() {
  const locale = await getLocale(); 
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <main className="flex flex-col justify-center items-center overflow-x-hidden gap-10">
      {/* Phone Numbers Bar */}
     
      
      <div id="hero-section" className="w-full bg-[#FFFFFF]">
        <PhoneNumbersBar />
        <HeroTopSection />
      </div>
      
      {/* Google Ads Phone Conversion Tracking - Houston */}
      <Script
        id="google-ads-phone-conversion-houston"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('config', 'AW-368434703/BDT7CNvPw_sbEI-8168B', {
              'phone_conversion_number': '(832) 849-0946'
            });
          `,
        }}
      />
      
      {/* Google Ads Phone Conversion Tracking - San Antonio */}
      <Script
        id="google-ads-phone-conversion-san-antonio"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('config', 'AW-368434703/m6YwCLjQw_sbEI-8168B', {
              'phone_conversion_number': '(210) 251-2809'
            });
          `,
        }}
      />
      
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

