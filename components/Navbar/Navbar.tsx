"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import Hamburger from "hamburger-react";
import { Logo } from "@/assets/images";
import { Globe } from "@/assets/images";
import { useRouter } from "next/navigation";
import LanguageChanger from "../LanguageChanger";
import { useLocale, useTranslations } from "next-intl";

export const Navbar = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();

  const navLinks = [
    { id: 1, heading: t("link_home"), route: "/" },
    { id: 2, heading: t("link_about"), route: "/about" },
    { id: 3, heading: t("link_services"), route: "/services" },
    { id: 4, heading: t("link_career"), route: "/career" },
    { id: 5, heading: t("link_specials"), route: "/special" },
    { id: 6, heading: t("link_contact"), route: "/contact" },
  ];

  const [isOpen, setOpen] = useState(false);

  const styles = {
    text: "list-none text-[20px] text-primary cursor-pointer",
  };

  const renderNavLinks = () =>
    navLinks.map((link) => (
      <li key={link.id} className={styles.text}>
        <Link href={link.route}>{link.heading}</Link>
      </li>
    ));

  const SM_Screen_renderNavLinks = () =>
    navLinks.map((link) => (
      <li key={link.id} onClick={() => setOpen(false)} className="my-3">
        <Link href={link.route} className="text-[20px] text-primary font-medium">
          {link.heading}
        </Link>
      </li>
    ));

  return (
    <header className="h-[90px] w-full flex justify-between items-center px-6 md:px-10 lg:px-14">
      {/* Logo */}
      <Image
        onClick={() => router.push(`/`)}
        src={Logo}
        alt="Logo"
        className="cursor-pointer w-[150px] md:w-[170px] lg:w-[200px] xl:w-[233px] object-contain"
      />

      {/* Desktop Nav */}
      <nav className="hidden tablet:flex tablet:justify-center font-poppins tablet:items-center tablet:gap-5">
        <ul className="flex gap-6">{renderNavLinks()}</ul>
      </nav>

      {/* Mobile Modal Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center px-6 pt-24 pb-10 tablet:hidden overflow-y-auto">
          {/* Close Button */}
          <button onClick={() => setOpen(false)} className="self-end text-[24px] mb-4">
            ✕
          </button>

          {/* Links */}
          <ul className="flex flex-col items-center w-full gap-4">{SM_Screen_renderNavLinks()}</ul>

          {/* Language Selector */}
          <div className="mt-8 flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mb-2">
              <Image src={Globe} alt="Globe" width={18} height={18} />
            </div>
            
          </div>

          {/* Book Button */}
          <button className="mt-6 bg-[#C1001F] text-white font-medium text-[15px] px-10 py-3 rounded-full hover:bg-red-700 transition">
            Book Your Visit
          </button>
        </div>
      )}

      {/* Right Buttons - Only visible on desktop */}
      <div className="hidden tablet:flex gap-4 sm:gap-7 items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
            <Image src={Globe} alt="Globe" width={18} height={18} />
          </div>
          <button className="bg-[#C1001F] text-white font-medium text-[15px] px-6 py-3 rounded-full hover:bg-red-700 transition whitespace-nowrap">
            Book Your Visit
          </button>
        </div>
      </div>

      {/* Hamburger - Only visible on mobile */}
      <div className="tablet:hidden z-50">
        <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      </div>
    </header>
  );
};




// navbar with language option

// "use client";

// import { useEffect, useState } from "react";

// import Image from "next/image";
// import { Link } from "@/navigation";
// import Hamburger from "hamburger-react";
// import { Logo } from "@/assets/images";
// import { useRouter } from "next/navigation";
// import LanguageChanger from "../LanguageChanger";
// import { useLocale, useTranslations } from "next-intl";

// export const Navbar = () => {
//   const t = useTranslations("common");
//   const router = useRouter();
//   const locale = useLocale();

//   console.log({locale})

//   const navLinks = [
//     { id: 1, heading: t("link_home"), route: "/" },
//     { id: 2, heading: t("link_about"), route: "/about" },
//     {
//       id: 3,
//       heading: t("link_services"),
//       route: "/services",
//     },
//     { id: 4, heading: t("link_career"), route: "/career" },
//     { id: 5, heading: t("link_specials"), route: "/special" },
//     { id: 6, heading: t("link_contact"), route: "/contact" },
//   ];

//   const [isOpen, setOpen] = useState(false);

//   const styles = {
//     text: "list-none text-[20px] text-primary cursor-pointer",
//   };

//   const renderNavLinks = () =>
//     navLinks.map((link) => (
//       <div key={link.id}>
//         <Link href={link.route}>
//           <li className={styles.text}>{link.heading}</li>
//         </Link>
//       </div>
//     ));

//   const SM_Screen_renderNavLinks = () =>
//     navLinks.map((link) => (
//       <Link key={link.id} className="" href={link.route}>
//         <li onClick={() => setOpen(false)} className={`${styles.text} my-5`}>
//           {link.heading}
//         </li>
//       </Link>
//     ));

//   useEffect(() => {
//     console.log(t("link_home"));
//   }, []);

//   return (
//     <header className="h-[90px] w-full flex justify-between relative px-8 md:px-10 lg:px-14 items-center">
//       <Image
//         onClick={() => router.push(`/`)}
//         src={Logo}
//         alt="Logo"
//         className="cursor-pointer w-[150px] md:w-[170px] lg:w-[200px] xl:w-[233px] aspect-auto object-contain"
//       />
//       <nav className="hidden tablet:flex tablet:justify-center font-poppins tablet:items-center tablet:gap-5">
//         {renderNavLinks()}
//       </nav>

//       {isOpen && (
//         <div className="  bg-white/95 bottom-0 right-0 left-0 top-0 h-[100dvh] z-40 fixed transition-all duration-300 ease-in-out w-full tablet:hidden gap-4 sm:gap-7 items-center">
//           <div className="grid place-items-center h-full">
//             <div className="spacing-y-5">
//               <SM_Screen_renderNavLinks />
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex gap-4 sm:gap-7 items-center">
//         <div className="z-50">
//           <LanguageChanger locale={locale} />
//         </div>
//         <div className="z-50 tablet:hidden">
//           <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
//         </div>
//       </div>
//     </header>
//   );
// };