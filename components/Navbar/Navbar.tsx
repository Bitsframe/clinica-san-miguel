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

  console.log({locale})

  const navLinks = [
    { id: 1, heading: t("link_home"), route: "/" },
    { id: 2, heading: t("link_about"), route: "/about" },
    {
      id: 3,
      heading: t("link_services"),
      route: "/services",
    },
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
      <div key={link.id}>
        <Link href={link.route}>
          <li className={styles.text}>{link.heading}</li>
        </Link>
      </div>
    ));

  const SM_Screen_renderNavLinks = () =>
    navLinks.map((link) => (
      <Link key={link.id} className="" href={link.route}>
        <li onClick={() => setOpen(false)} className={`${styles.text} my-5`}>
          {link.heading}
        </li>
      </Link>
    ));

  useEffect(() => {
    console.log(t("link_home"));
  }, []);

  return (
    <header className="h-[90px] w-full flex justify-between relative px-8 md:px-10 lg:px-14 items-center">
      <Image
        onClick={() => router.push(`/`)}
        src={Logo}
        alt="Logo"
        className="cursor-pointer w-[150px] md:w-[170px] lg:w-[200px] xl:w-[233px] aspect-auto object-contain"
      />
      <nav className="hidden tablet:flex tablet:justify-center font-poppins tablet:items-center tablet:gap-5">
        {renderNavLinks()}
      </nav>

      {isOpen && (
        <div className="  bg-white/95 bottom-0 right-0 left-0 top-0 h-[100dvh] z-40 fixed transition-all duration-300 ease-in-out w-full tablet:hidden gap-4 sm:gap-7 items-center">
          <div className="grid place-items-center h-full">
            <div className="spacing-y-5">
              <SM_Screen_renderNavLinks />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 sm:gap-7 items-center">
        <div className="flex items-center space-x-4">
  {/* Globe Icon in Circle */}
  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
    <Image
      src={Globe}
      alt="Globe"
      width={18}
      height={18}
    />
  </div>

  {/* Book Button */}
  <button className="bg-[#C1001F] text-white font-medium text-[15px] leading-[100%] tracking-[0] font-poppins px-12 py-6 rounded-full hover:bg-red-700 transition">
    Book Your Visit
  </button>
</div>

        
        <div className="z-50 tablet:hidden">
          <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
        </div>
      </div>
    </header>
  );
};
