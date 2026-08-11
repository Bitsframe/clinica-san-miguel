"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { Logo } from "@/assets/images";
import LanguageChanger from "../LanguageChanger";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Phone, X } from "lucide-react";

const navRoutes = [
  { key: "link_home", route: "/" },
  { key: "link_about", route: "/about" },
  { key: "link_services", route: "/services" },
  { key: "link_career", route: "/career" },
  { key: "link_specials", route: "/special" },
  { key: "link_contact", route: "/contact" },
] as const;

export const Navbar = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const [isOpen, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/" || /^\/(en|es)\/?$/.test(pathname);
  const isElevated = !isHome || scrolled;

  const navLinks = navRoutes.map((item, id) => ({
    id: id + 1,
    heading: t(item.key),
    route: item.route,
  }));

  const isActiveRoute = (route: string) => {
    if (route === "/") return isHome;
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const headerClass = isElevated
    ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_24px_-4px_rgba(25,25,44,0.08)]"
    : "bg-transparent border-b border-transparent";

  const linkClass = (route: string) => {
    const active = isActiveRoute(route);
    return [
      "relative whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium font-poppins transition-all duration-200 lg:px-3 lg:text-[14px] xl:px-3.5 xl:text-[15px]",
      active
        ? "text-[#C1001F] bg-[#C1001F]/10"
        : "text-[#19192C]/80 hover:text-[#19192C] hover:bg-gray-100/80",
    ].join(" ");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${headerClass}`}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="Clinica San Miguel"
              priority
              width={208}
              height={52}
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 208px"
              className="h-10 w-auto sm:h-11 md:h-12 lg:h-[52px] object-contain"
            />
          </Link>

          {/* Desktop Nav — lg+ only; Spanish labels need more horizontal space than tablet width */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex min-w-0 flex-1 justify-center"
          >
            <ul className="flex items-center gap-0.5 rounded-full bg-[#F4F5F6]/80 p-1 ring-1 ring-gray-200/60">
              {navLinks.map((link) => (
                <li key={link.id} className="shrink-0">
                  <Link href={link.route} className={linkClass(link.route)}>
                    {link.heading}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              href="tel:+14698868060"
              className="hidden xl:inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-[#19192C] shadow-sm transition hover:border-[#C1001F]/30 hover:text-[#C1001F]"
            >
              <Phone className="h-4 w-4 text-[#C1001F]" />
              <span className="font-poppins whitespace-nowrap">469-886-8060</span>
            </a>

            <LanguageChanger locale={locale} />

            <button
              type="button"
              onClick={() => router.push("/contact")}
              aria-label={t("book_your_visit")}
              className="inline-flex items-center gap-2 rounded-full bg-[#C1001F] px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C1001F]/25 transition hover:bg-[#a8001a] hover:shadow-lg hover:shadow-[#C1001F]/30 font-poppins xl:px-5"
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline whitespace-nowrap">
                {t("book_your_visit")}
              </span>
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <LanguageChanger locale={locale} />
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#19192C] shadow-sm transition hover:border-[#C1001F]/30"
            >
              {isOpen ? <X className="h-5 w-5" /> : (
                <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 rounded-full bg-[#19192C]" />
                  <span className="block h-0.5 w-5 rounded-full bg-[#19192C]" />
                  <span className="block h-0.5 w-3.5 rounded-full bg-[#19192C]" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          className="absolute inset-0 bg-[#19192C]/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#4B5563] font-poppins">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#19192C] hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const active = isActiveRoute(link.route);
                return (
                  <li key={link.id}>
                    <Link
                      href={link.route}
                      onClick={() => setOpen(false)}
                      className={`flex items-center rounded-xl px-4 py-3.5 text-base font-medium font-poppins transition ${
                        active
                          ? "bg-[#C1001F]/10 text-[#C1001F]"
                          : "text-[#19192C] hover:bg-gray-50"
                      }`}
                    >
                      {link.heading}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-gray-100 p-5">
            <a
              href="tel:+14698868060"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#19192C] font-poppins"
            >
              <Phone className="h-4 w-4 text-[#C1001F]" />
              469-886-8060
            </a>
            <button
              type="button"
              onClick={() => {
                router.push("/contact");
                setOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C1001F] py-3.5 text-sm font-semibold text-white shadow-md font-poppins"
            >
              <CalendarDays className="h-4 w-4" />
              {t("book_your_visit")}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};
