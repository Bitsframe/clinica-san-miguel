"use client";

import { Logo } from "@/assets/images";
import medicalConsultantImg from '../Hero_files/medical consultant.png';
import immigrationImg from '../Hero_files/immigration.png';
import dotImg from '../Hero_files/Dot.png';
import schoolPhysicalImg from '../Hero_files/School Physcial.png';
import Spinner from "@/components/Spinner";
import { StaticImageData } from "next/image";


import { HeroBox } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { Button, IconButton } from "@/utils";
import Image from "next/image";
import { useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FaPhoneFlip } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { GroupedLocations } from "@/sections/Locations/GroupedLocations";  
import { calculateDistance, parseLatLngFromDirection } from "@/utils/zipcodeService";

export const Hero = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const { heroSection, heroSection_es } = useSupabase();

  const data = locale === "es" ? heroSection_es[0] : heroSection[0];
  const [shouldScroll, setShouldScroll] = useState(false);

  const go_to_contact_handle = () => {
    router.push(`/contact`);
  };

   useEffect(() => {
    if (shouldScroll) {
      const timeout = setTimeout(() => {
        const target = document.getElementById("grouped-locations");
        if (target) {
          
          target.scrollIntoView({ behavior: "smooth" });
        } else {
         
        }
        setShouldScroll(false); 
      }, 100); 

      return () => clearTimeout(timeout);
    }
  }, [shouldScroll]);

  return (
    <section className="flex flex-col gap-20 justify-center md:justify-start items-center md:items-start">
      <article className="flex flex-col mt-[10%] sm:mt-[5%] md:mt-10 md:flex-row w-[95%] lg:w-[100%] justify-center items-center gap-10">
        <div className="flex flex-col items-end justify-end gap-5 w-auto order-2 md:order-1 md:w-1/2">
          <div className="w-full md:w-[95%] lg:w-[80%] xl:w-[60%] flex flex-col gap-5">
            <div className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] text-center md:text-left leading-snug font-poppins font-bold text-[#000000]">
              {data?.title}
            </div>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] text-center md:text-left font-poppins text-[#19192C] leading-relaxed break-words whitespace-normal">
              {data?.content}
            </p>

            <div className="flex gap-5 sm:gap-7 justify-center md:justify-start items-center">
              <Button
                text={t("hero_section_button")}
                size={{ width: "270px", height: "73px" }}
               
                bgColor={"#3D3D3C"}
                textColor={"#ffffff"}
                onClick={go_to_contact_handle}
              />
              <IconButton
                size={{ width: "75px", height: "75px" }}
                icon={<FaPhoneFlip />}
                bgColor="#C1001F"
                fontSize={"30px"}
                route={""}
                onClick={go_to_contact_handle}
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-[90%] flex justify-center md:justify-start order-1 md:order-2 md:w-1/2 min-h-[450px] sm:min-h-[550px] md:min-h-[600px] aspect-[4/5] md:aspect-auto">
          <HeroBox />
        </div>
      </article>
    </section>
  );
};















// export const HeroTopSection = () => {
//   const t = useTranslations("home");
//   const router = useRouter();
//   const [shouldScroll, setShouldScroll] = useState(false);

//   const redirectToContact = () => {
//     router.push(`/contact`);
//   };

//   useEffect(() => {
//     if (shouldScroll) {
//       const timeout = setTimeout(() => {
//         const target = document.getElementById("grouped-locations");
//         if (target) {
//           target.scrollIntoView({ behavior: "smooth" });
//         }
//         setShouldScroll(false);
//       }, 100);
//       return () => clearTimeout(timeout);
//     }
//   }, [shouldScroll]);

//   return (
// <main className="flex flex-col w-full relative">
//   <article className="w-full relative min-h-[80vh] sm:min-h-screen lg:pt-4">
//     <div className="w-full px-4 sm:px-6 lg:px-12">

//       {/* ✅ Mobile Image (only on small screens) */}
//       <div className="relative w-full mx-auto block sm:hidden h-[80vh] max-w-screen-xl overflow-hidden rounded-3xl">
//         <Image
//           src={HomeBackground}
//           alt="Mobile Home"
//           width={300}
//           height={600}
//           className="w-full h-full object-cover object-[60%_40%] rounded-3xl"
//         />
//         <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-3xl" />
//       </div>

//       {/* ✅ Tablet & Desktop Image (from sm and up) */}
//       <div
//         className="relative w-full mx-auto hidden sm:block
//                    h-[80vh] md:h-[90vh] lg:h-[120vh] xl:h-[100vh] 2xl:h-[110vh]
//                    max-w-screen-xl overflow-hidden rounded-3xl"
//       >
//         <Image
//           src={HomeBackground}
//           alt="Home Background"
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover object-center rounded-3xl"
//         />
//         <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-3xl" />
//       </div>

//       {/* ✅ Text Content (Shared) */}
//       <div className="absolute z-20 top-[50%] sm:top-[55%] md:top-[50%] lg:top-[40%] left-6 sm:left-10 md:left-16 lg:left-28 text-white max-w-md space-y-4 px-2 sm:px-0 ">
       
//         {/* ⭐ Star Rating */}
//         <div className="flex items-center gap-2">
//           {[...Array(5)].map((_, i) => (
//             <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffbd66]" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.17 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
//             </svg>
//           ))}

//         </div>

//         {/* 🧭 Heading */}
//         <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
//           {t("section1_h1_part1")}{" "}
//           <span className="text-[#C1001F]">{t("section_h1_h19")}</span>{" "}
//           <span className="block">{t("section1_h1_part2")}</span>
//         </h1>

//         {/* 📖 Paragraph */}
//       <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-snug text-white tracking-wide line-clamp-4 sm:line-clamp-none">
//         {t("section1_p")}
//       </p>



//         {/* 🖱️ Desktop Buttons */}
//         <div className="hidden sm:flex flex-wrap gap-4 pt-4">
//           <button
//             onClick={redirectToContact}
//             className="bg-[#C1001F] text-white font-medium text-sm sm:text-base py-3 px-6 rounded-full hover:bg-red-700 transition"
//           >
//             {t("section1_button1")}
//           </button>
//           <button
//             onClick={() => setShouldScroll(true)}
//             className="border border-white text-white font-medium text-sm sm:text-base py-3 px-6 rounded-full hover:bg-white hover:text-black transition"
//           >
//             {t("section1_button2")}
//           </button>
//         </div>
//       </div>

//       {/* 📱 Mobile Buttons */}
//       <div className="block sm:hidden w-full mt-8">
//         <div className="flex flex-col items-center space-y-3">
//           <button
//             onClick={redirectToContact}
//             className="bg-[#C1001F] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
//           >
//             {t("section1_button1")}
//           </button>
//           <button
//             onClick={() => setShouldScroll(true)}
//             className="bg-[#0F172A] text-white font-medium text-sm py-3 px-6 rounded-full w-[85%] max-w-xs"
//           >
//             {t("section1_button2")}
//           </button>
//         </div>
//       </div>
//     </div>
//   </article>
// </main>


//   );
// };


// ─── Slide data ───────────────────────────────────────────────────────────────


type HeroSlide = {
  label: string;
  headlineLine1: string;
  pricePrefix: string;
  price: string;
  subtext: string;
  checklist: string[];
  checklistGrid?: boolean;
  btnText: string;
  photo: StaticImageData | string;
  photoAlt: string;
};

const SLIDES_EN: HeroSlide[] = [
  {
    label: "Limited Time Offer",
    headlineLine1: "Medical Consultation",
    pricePrefix: "Only",
    price: "$19",
    subtext: "Quality Care • Same-Day Appointments • Walk-ins Welcome",
    checklist: ["Family Medicine", "Primary Care Services", "Experienced Medical Providers", "Fast & Convenient Visits"],
    btnText: "Book Now →",
    photo: medicalConsultantImg,
    photoAlt: "Doctor consulting with patient",
  },
  {
    label: "USCIS Authorized Services",
    headlineLine1: "Immigration Medical Exam",
    pricePrefix: "Only",
    price: "$220",
    subtext: "Fast • USCIS Civil Surgeon • Same-Day Appointments",
    checklist: ["USCIS Immigration Medical Exam", "Authorized Civil Surgeon", "Vaccination Review", "Fast & Professional Service"],
    btnText: "Book Now →",
    photo: immigrationImg,
    photoAlt: "Civil surgeon with patient",
  },
  {
    label: "Certified DOT Services",
    headlineLine1: "DOT+ Urine Test",
    pricePrefix: "Only",
    price: "$80",
    subtext: "Fast • Certified • Same-Day Results Available",
    checklist: ["DOT Compliant Testing", "Certified Medical Staff", "Same-Day Results", "Walk-ins Welcome"],
    checklistGrid: true,
    btnText: "Book Now →",
    photo: dotImg,
    photoAlt: "Driver reviewing paperwork with medical staff",
  },
  {
    label: "Limited Time Offer",
    headlineLine1: "School Physical Exam",
    pricePrefix: "Only",
    price: "$25",
    subtext: "Fast • Affordable • Same-Day Appointments",
    checklist: ["School Physicals", "Walk-ins Welcome", "Sports Physicals", "Licensed Medical Providers"],
    checklistGrid: true,
    btnText: "Book Now →",
    photo: schoolPhysicalImg,
    photoAlt: "Doctor examining a child",
  },
];

const SLIDES_ES: HeroSlide[] = [
  {
    label: "Oferta por Tiempo Limitado",
    headlineLine1: "Consulta Médica",
    pricePrefix: "Solo",
    price: "$19",
    subtext: "Atención de Calidad • Citas el Mismo Día • Aceptamos Sin Cita",
    checklist: ["Medicina Familiar", "Servicios de Atención Primaria", "Proveedores Médicos con Experiencia", "Visitas Rápidas y Convenientes"],
    btnText: "Reservar Ahora →",
    photo: medicalConsultantImg,
    photoAlt: "Médico conversando con paciente",
  },
  {
    label: "Servicios Autorizados por USCIS",
    headlineLine1: "Examen Médico de Inmigración",
    pricePrefix: "Solo",
    price: "$220",
    subtext: "Rápido • Cirujano Civil de USCIS • Citas el Mismo Día",
    checklist: ["Examen Médico de Inmigración USCIS", "Cirujano Civil Autorizado", "Revisión de Vacunas", "Servicio Rápido y Profesional"],
    btnText: "Reservar Ahora →",
    photo: immigrationImg,
    photoAlt: "Cirujano civil con paciente",
  },
  {
    label: "Servicios DOT Certificados",
    headlineLine1: "Prueba de Orina DOT+",
    pricePrefix: "Solo",
    price: "$80",
    subtext: "Rápido • Certificado • Resultados Disponibles el Mismo Día",
    checklist: ["Pruebas Conforme a DOT", "Personal Médico Certificado", "Resultados el Mismo Día", "Aceptamos Sin Cita"],
    checklistGrid: true,
    btnText: "Reservar Ahora →",
    photo: dotImg,
    photoAlt: "Conductor revisando papeleo para examen DOT",
  },
  {
    label: "Oferta por Tiempo Limitado",
    headlineLine1: "Examen Físico Escolar",
    pricePrefix: "Solo",
    price: "$25",
    subtext: "Rápido • Económico • Citas el Mismo Día",
    checklist: ["Exámenes Físicos Escolares", "Aceptamos Sin Cita", "Exámenes Físicos Deportivos", "Proveedores Médicos con Licencia"],
    checklistGrid: true,
    btnText: "Reservar Ahora →",
    photo: schoolPhysicalImg,
    photoAlt: "Médico examinando a una niña",
  },
];

// ─── BannerSlide ──────────────────────────────────────────────────────────────

function BannerSlide({ slide, onBookNow, nearestPhone }: { slide: HeroSlide; onBookNow: () => void; nearestPhone: string }) {
  return (
    <div
      className="absolute inset-0 flex items-stretch overflow-hidden"
      style={{
        background:
          "repeating-linear-gradient(115deg, rgba(255,255,255,.5) 0 2px, transparent 2px 90px), linear-gradient(120deg,#eef1f4 0%,#e4e8ec 55%,#dfe3e8 100%)",
        padding: "clamp(14px, 2.8vw, 44px) clamp(14px, 3.8vw, 60px)",
      }}
    >
      {/* ── Left ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-3 sm:pr-6 lg:pr-[30px]">
        <div>
          {/* Logo */}
          <div className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[22px] font-extrabold tracking-wide text-[#182238] leading-tight">
            CLÍNICA SAN MIGUEL
          </div>
          <div className="text-[11px] sm:text-[11px] lg:text-[13px] font-bold text-[#182238] opacity-80 mt-0.5 tracking-[1.5px]">
            MEDICINA FAMILIAR
          </div>

          {/* Label */}
          <div className="text-[11px] sm:text-[11px] lg:text-[14px] font-bold text-[#b3271e] uppercase mt-2 sm:mt-4 tracking-[1.5px]">
            {slide.label}
          </div>

          {/* Headline */}
          <div className="text-[26px] sm:text-[28px] md:text-[34px] lg:text-[42px] xl:text-[48px] font-extrabold text-[#182238] mt-1 leading-[1.08]">
            {slide.headlineLine1}
            <br />
            {slide.pricePrefix}{" "}
            <span className="text-[#c0392b]">{slide.price}</span>
          </div>

          {/* Subtext — shown on all sizes */}
          <div className="text-[11px] sm:text-[12px] lg:text-[16px] text-[#5a6472] font-medium mt-2 sm:mt-3.5">
            {slide.subtext}
          </div>

          {/* Checklist — shown on all sizes */}
          {slide.checklistGrid ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 sm:mt-4">
              {slide.checklist.map((item, i) => (
                <li key={i} className="text-[11px] sm:text-[12px] lg:text-[15.5px] flex items-center gap-1.5 font-medium text-[#1e2536]">
                  <span className="text-[#b3271e] font-extrabold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1.5 mt-2 sm:mt-4">
              {slide.checklist.map((item, i) => (
                <li key={i} className="text-[11px] sm:text-[12px] lg:text-[15.5px] flex items-center gap-1.5 font-medium text-[#1e2536]">
                  <span className="text-[#b3271e] font-extrabold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact */}
        <div className="mt-2 sm:mt-5">
          <button
            onClick={onBookNow}
            className="bg-[#c0392b] text-white font-bold tracking-wide shadow-[0_6px_14px_rgba(192,57,43,.35)] hover:bg-red-700 transition block rounded-lg mb-2 sm:mb-3.5 text-[12px] sm:text-[13px] lg:text-[15px] px-4 sm:px-5 lg:px-[30px] py-2 sm:py-2.5 lg:py-3"
          >
            {slide.btnText}
          </button>
          <div className="text-[17px] sm:text-[18px] lg:text-[22px] font-extrabold text-[#182238]">
            <a href={`tel:1${nearestPhone.replace(/\D/g, "")}`}>{nearestPhone}</a>
          </div>
          <div className="hidden sm:block text-[11px] lg:text-[15px] text-[#3a4356] font-medium mt-0.5">
            www.clinicsanmiguel.com
          </div>
        </div>
      </div>

      {/* ── Right – photo (hidden on mobile) ── */}
      <div
        className="hidden sm:block relative flex-shrink-0"
        style={{ width: "42%" }}
      >
        <div className="absolute inset-0 bg-[#c0392b] rounded-[14px] sm:rounded-[20px] p-[4px] sm:p-[6px]">
          <div className="w-full h-full rounded-[11px] sm:rounded-[15px] overflow-hidden relative bg-gradient-to-br from-[#ffe4df] via-[#fbeceb] to-[#f3f5f8]">
            <Image
              src={slide.photo}
              alt={slide.photoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 42vw"
            />
            <span className="absolute bottom-2 sm:bottom-3.5 right-2 sm:right-3.5 text-white text-base sm:text-xl opacity-90 z-10 select-none">
              ✦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HeroTopSection ───────────────────────────────────────────────────────────

export const HeroTopSection = () => {
  const router = useRouter();
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const [nearestPhone, setNearestPhone] = useState("(832) 849-0946");
  const { locations } = useSupabase();

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation && locations?.length > 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          let minDistance = Infinity;
          let bestPhone = "(832) 849-0946";
          for (const loc of locations) {
            const coords = parseLatLngFromDirection(loc.direction as string);
            if (coords) {
              const dist = calculateDistance(userLat, userLng, coords.lat, coords.lng);
              if (dist < minDistance && loc.phone) {
                minDistance = dist;
                bestPhone = loc.phone;
              }
            }
          }
          setNearestPhone(bestPhone);
        },
        () => {
          // Keep default if geolocation denied
        }
      );
    }
  }, [locations]);

  const slides = locale === "es" ? SLIDES_ES : SLIDES_EN;
  const total = slides.length;

  const goNext = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const goPrev = () => setCurrent(c => (c - 1 + total) % total);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const redirectToContact = () => {
    setIsNavigating(true);
    router.push("/contact");
  };

  const DotNav = () => (
    <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2">
      {slides.map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => setCurrent(i)}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            i === current ? "w-6 bg-[#C1001F]" : "w-2.5 bg-gray-400 hover:bg-gray-600"
          }`}
        />
      ))}
    </div>
  );

  const ArrowButtons = ({ size = "md" }: { size?: "sm" | "md" }) => {
    const base =
      size === "sm"
        ? "absolute top-1/2 z-30 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-700 transition text-2xl w-9 h-9"
        : "absolute top-1/2 z-30 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-700 transition text-4xl w-12 h-12";
    return (
      <>
        <button aria-label="Previous slide" onClick={goPrev} className={`${base} left-3`}>‹</button>
        <button aria-label="Next slide"     onClick={goNext} className={`${base} right-3`}>›</button>
      </>
    );
  };

  return (
    <section className="relative w-full">
      {isNavigating && (
        <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="my-4 mx-3 md:mx-6">
        {/* Unified Responsive Carousel */}
        <div className="relative rounded-2xl shadow-md flex flex-col h-auto">
          {/* Main slide container - responsive height */}
          <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[440px] md:h-[540px] lg:h-[620px] xl:h-[680px]">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <BannerSlide slide={slide} onBookNow={redirectToContact} nearestPhone={nearestPhone} />
              </div>
            ))}
            
            {/* Desktop controls inside the image */}
            <div className="hidden sm:block">
              <ArrowButtons />
              <DotNav />
            </div>
          </div>

          {/* Mobile dots below the slide */}
          <div className="flex sm:hidden justify-center gap-2 mt-2 pb-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-[#C1001F]" : "w-2.5 bg-gray-400 hover:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};