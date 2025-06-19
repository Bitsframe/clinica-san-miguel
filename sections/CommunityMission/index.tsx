"use client";

import { Mission } from "@/components";
import { styles } from "@/app/[locale]/styles";
import { useSupabase } from "@/context/supabaseContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { mission as missionImage } from "@/assets/images/cover";
import {
  Heart,
  ShieldPlus,
  DoorOpen,
  Star,
} from "lucide-react";

import Image from "next/image";

export const CommunityMission = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();

  const { mission, mission_es } = useSupabase();

  const data = locale === "es" ? mission_es : mission;
  const features = [
    {
      title: "Inclusive Community Care",
      desc: "We open our doors to everyone, creating a warm, welcoming space for all.",
      icon: <Heart className="w-5 h-5 text-white" />,
    },
    {
      title: "No Insurance, No Problem",
      desc: "Affordable visits without insurance barriers, starting at just $19.",
      icon: <ShieldPlus className="w-5 h-5 text-white" />,
    },
    {
      title: "Walk-In Conveniencero",
      desc: "Accessible care when you need it, with no appointments required.",
      icon: <DoorOpen className="w-5 h-5 text-white" />,
    },
    {
      title: "You Are Our Priority",
      desc: "Every patient is at the heart of our care, treated with respect and compassion.",
      icon: <Star className="w-5 h-5 text-white" />,
    },
  ];

//   return (
//     <section className="flex w-full flex-col items-center bg-[#19192C] py-[4%]">
//       <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
//         {t("community_mission_title")}
//       </h1>
//       <h3 className={`${styles.sectionSubText} text-[#F8F5F0]`}>
//         {t("community_mission_sub_title")}
//       </h3>
//       <div className="w-full md:w-[80%] h-1 bg-white rounded-full my-[3%]"></div>
//       <div className="flex flex-wrap justify-center items-center gap-7 lg:w-[80%]">
//         {data.map((item) => (
//           <Mission
//             key={item.id}
//             icon={item.Icon}
//             heading={item.Title}
//             content={item.Text}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

  return (
    <section className="bg-[#0F172A] text-white rounded-2xl p-6 md:p-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Left Side - Mission */}
      <div className="flex-1 space-y-0 relative">
  <div>
    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
    <p className="text-base text-gray-300 leading-relaxed">
      We believe everyone deserves quality care. Proudly serving Texas communities, especially the Hispanic population, we provide affordable, compassionate healthcare starting at just $19—no insurance needed. Our mission is to make health a right, not a privilege, for every patient we welcome.
    </p>
  </div>

  <div className="relative w-full h-[400px] z-20 translate-y-28">
  <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
    <Image
      src={missionImage}
      alt="Mission"
      fill
      className="object-cover rounded-xl"
      sizes="100vw"
      priority
    />
  </div>
</div>
</div>

      {/* Right Side - Features */}
       <div className="flex-1 ">
 <div className="space-y-12">
  {features.map((item, index) => (
    <div key={index} className="flex items-center gap-4">
      <div className="w-[67px] h-[67px] rounded-full bg-white/10 flex items-center justify-center shrink-0">
        {item.icon}
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold text-lg text-white">{item.title}</h3>
        <p className="text-sm text-gray-400">{item.desc}</p>
      </div>
    </div>
  ))}
</div>
 <div className="mt-20">
    <button className="bg-[#C1001F] hover:bg-red-800 text-white text-base font-medium px-6 py-3 rounded-full transition w-fit">
      Book Your Visit
    </button>
  </div>

</div>

    </section>
  );
}
