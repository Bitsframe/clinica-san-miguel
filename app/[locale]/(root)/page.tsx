
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: { absolute: "Clinica San Miguel – Affordable Family Medicine in Texas" },
  description:
    "Clinica San Miguel provides affordable, compassionate family healthcare across Texas. Walk-ins welcome. Serving Houston, San Antonio, and surrounding communities.",
  openGraph: {
    title: "Clinica San Miguel – Affordable Family Medicine in Texas",
    description:
      "Walk-in family medicine clinics in Texas offering primary care, pediatrics, and more. Serving Houston, San Antonio, and surrounding areas.",
    type: "website",
  },
};
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

  TrustedPartner,
  AboveFooter,
  StickyMobileButton,
} from "@/sections";
import PhoneNumbersBar from "@/components/PhoneNumbersBar";
import Script from "next/script";
import { supabase } from "@/supabaseClient";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Clinica San Miguel",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.clinicsanmiguel.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.clinicsanmiguel.com"}/favicon.png`,
  description:
    "Clinica San Miguel provides affordable, compassionate family healthcare across Texas. Walk-ins welcome.",
  telephone: "+18328490946",
  areaServed: {
    "@type": "State",
    name: "Texas",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "TX",
    addressCountry: "US",
  },
  medicalSpecialty: [
    "FamilyMedicine",
    "Pediatrics",
    "GeneralPractice",
  ],
  priceRange: "$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  sameAs: [],
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const [{ data: faqs }, { data: testimonials }] = await Promise.all([
    supabase.from(`FAQs${locale === "es" ? "_es" : ""}`).select("*"),
    supabase.from("Testinomial").select("*")
  ]);

  return (
    <main className="flex flex-col justify-center items-center overflow-x-hidden gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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

      <TrustedPartner />
      <FAQs initialFaqsData={faqs || undefined} />
      <AboveFooter />
      <StickyMobileButton />
    </main>
  );
}

