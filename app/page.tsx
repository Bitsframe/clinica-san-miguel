import {
  AboutSection,
  CommunityMission,
  Hero,
  JoinTeam,
  Locations,
  Testimonials,
  Treatments,
} from "@/sections";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-10">
      <Hero />
      <Testimonials />
      <CommunityMission />
      <AboutSection />
      <Treatments />
      <JoinTeam />
      <Locations />
    </main>
  );
}
