"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import Hamburger from "hamburger-react";
import { Logo, Globe } from "@/assets/images";
import { useRouter } from "next/navigation";
import LanguageChanger from "../LanguageChanger";
import { useLocale, useTranslations } from "next-intl";

export const Navbar = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();

  const [isOpen, setOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { id: 1, heading: t("link_home"), route: "/" },
    { id: 2, heading: t("link_about"), route: "/about" },
    { id: 3, heading: t("link_services"), route: "/services" },
    { id: 4, heading: t("link_career"), route: "/career" },
    { id: 5, heading: t("link_specials"), route: "/special" },
    { id: 6, heading: t("link_contact"), route: "/contact" },
  ];

  const styles = {
    text: "list-none text-[20px] text-primary cursor-pointer",
  };

  const renderNavLinks = () =>
    navLinks.map((link) => (
      <li key={link.id} className={styles.text}>
        <button onClick={() => router.push(link.route)}>
          {link.heading}
        </button>
      </li>
    ));

  const SM_Screen_renderNavLinks = () =>
    navLinks.map((link) => (
      <li key={link.id} onClick={() => setOpen(false)} className="my-3">
        <button
          onClick={() => router.push(link.route)}
          className="text-[20px] text-primary font-medium"
        >
          {link.heading}
        </button>
      </li>
    ));

  return (
    <header className="h-[90px] w-full flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-14">
      {/* Logo */}
      <Image
        onClick={() => router.push("/")}
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
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center px-4 sm:px-6 pt-24 pb-10 tablet:hidden overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out">
          

          <ul className="flex flex-col items-center w-full gap-4">
            {SM_Screen_renderNavLinks()}
          </ul>

          {/* Language Selector on Mobile */}
          <div className="mt-8 flex flex-col items-center gap-2 relative" ref={langRef}>
            <div
              onClick={() => setShowLangMenu((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full cursor-pointer"
            >
              <Image src={Globe} alt="Globe" width={18} height={18} />
            </div>
            {showLangMenu && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md shadow p-2 z-50">
                <LanguageChanger locale={locale} />
              </div>
            )}
          </div>

          {/* Book Button (Mobile) */}
          <button
            onClick={() => {
              router.push("/contact");
              setOpen(false);
            }}
            className="mt-6 bg-[#C1001F] text-white font-medium text-[15px] px-10 py-3 rounded-full hover:bg-red-700 transition"
          >
            {t("book_your_visit")}
          </button>
        </div>
      )}

      {/* Desktop Right Side */}
      <div className="hidden tablet:flex gap-4 sm:gap-7 items-center">
        {/* Globe + Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full"
          >
            <Image src={Globe} alt="Globe" width={18} height={18} />
          </button>

          {showLangMenu && (
            <div className="absolute top-12 -left-4 bg-white border border-gray-300 rounded-md shadow-md p-2 z-50">
              <LanguageChanger locale={locale} />
            </div>
          )}
        </div>

        {/* Book Button (Desktop) */}
        <button
          onClick={() => router.push("/contact")}
          className="bg-[#C1001F] text-white font-medium text-[15px] px-6 py-3 rounded-full hover:bg-red-700 transition whitespace-nowrap"
        >
          {t("book_your_visit")}
        </button>
      </div>

      {/* Hamburger */}
      <div className="tablet:hidden z-50">
        <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      </div>
    </header>
  );
};
