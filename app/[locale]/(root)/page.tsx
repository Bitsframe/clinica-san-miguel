
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
import { FaPhone } from "react-icons/fa6";

export default async function Home() {
  const locale = await getLocale(); 
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <main className="flex flex-col justify-center items-center overflow-x-hidden gap-10">
      {/* Phone Numbers Bar */}
     
      
      <div id="hero-section" className="w-full bg-[#FFFFFF] ">
      <div className="w-full bg-white border-b border-gray-200 py-3 px-4 overflow-x-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 flex-wrap sm:flex-nowrap text-xs sm:text-sm md:text-base whitespace-nowrap">
          <a 
            href="tel:+14698868060" 
            className="flex items-center gap-2 text-[#19192C] hover:text-[#C1001F] transition-colors cursor-pointer"
          >
            <span className="font-medium">Dallas</span>
            <FaPhone className="text-[#C1001F]" size={14} />
            <span>+1 469-886-8060</span>
          </a>
          
          <span className="hidden sm:inline text-gray-300">|</span>
          
          <a 
            href="tel:+18328490946" 
            className="flex items-center gap-2 text-[#19192C] hover:text-[#C1001F] transition-colors cursor-pointer"
          >
            <span className="font-medium">Houston</span>
            <FaPhone className="text-[#C1001F]" size={14} />
            <span>+1 832-849-0946</span>
          </a>
          
          <span className="hidden sm:inline text-gray-300">|</span>
          
          <a 
            href="tel:+12102512809" 
            className="flex items-center gap-2 text-[#19192C] hover:text-[#C1001F] transition-colors cursor-pointer"
          >
            <span className="font-medium">San Antonio</span>
            <FaPhone className="text-[#C1001F]" size={14} />
            <span>+1 210-251-2809</span>
          </a>
        </div>
      </div>
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
