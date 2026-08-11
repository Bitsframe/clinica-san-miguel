"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "@/assets/images/logo/logo.png";
import { Link } from "@/navigation";
import NewsletterSignup from "./NewsletterSignup";

export const Footer = () => {
  const t = useTranslations("common");

  const pages = [
    { id: 1, name: t("link_home"), route: "/" },
    { id: 2, name: t("link_about"), route: "/about" },
    { id: 3, name: t("link_services"), route: "/services" },
    { id: 4, name: t("link_contact"), route: "/contact" },
    { id: 5, name: t("link_career"), route: "/career" },
    { id: 6, name: t("link_specials"), route: "/special" },
  ];

  const socialLinks = [
    {
      id: 1,
      icon: <FaFacebookF />,
      route: "https://www.facebook.com/clinicasanmigueltx/",
    },
    {
      id: 2,
      icon: <FaInstagram />,
      route: "https://www.instagram.com/san_miguel_clinic_",
    },
    {
      id: 3,
      icon: <FaYoutube />,
      route: "https://www.youtube.com/channel/UC-89xwmnpU6ZEPSawRZKNIw",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-[#0F172A] mt-12">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between gap-10">
        {/* Left Column: Logo and Newsletter */}
        <div className="flex flex-col space-y-4 text-center md:text-left md:w-1/3 w-full">
          <Image
            src={logo}
            alt="Logo"
            width={160}
            height={60}
            className="mx-auto md:mx-0"
          />
          <p className="font-semibold">{t("footer_news_letter_title")}</p>
          <NewsletterSignup />
        </div>

        {/* Right Column: Links and Socials */}
        <div className="flex flex-col sm:flex-row justify-between gap-10 text-center md:text-left w-full md:w-2/3 md:pl-8 lg:pl-0">
          {/* Quick Links */}
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {pages.map((page) => (
                <li key={page.id}>
                  <Link href={page.route}>{page.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Locations */}
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Our Locations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/contact?city=dallas" className="hover:text-[#C1001F] transition">
                  Dallas
                </Link>
              </li>
              <li>
                <Link href="/contact?city=houston" className="hover:text-[#C1001F] transition">
                  Houston
                </Link>
              </li>
              <li>
                <Link href="/contact?city=sanantonio" className="hover:text-[#C1001F] transition">
                  San Antonio
                </Link>
              </li>
              <li>
                <Link href="/contact?city=all" className="hover:text-[#C1001F] transition">
                  See all 18 clinics
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Socials</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {socialLinks.map((social) => (
                <li
                  key={social.id}
                  className="flex items-center gap-2 justify-center md:justify-start"
                >
                  <a
                    href={social.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {social.icon}
                    {social.route.includes("facebook") && "Facebook"}
                    {social.route.includes("instagram") && "Instagram"}
                    {social.route.includes("youtube") && "Youtube"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
    <div className="mt-10 border-t border-gray-200 px-6 py-6 flex flex-col md:flex-row items-center text-sm text-gray-500 gap-4 md:gap-0">
  <p className="text-center md:text-left">
    {t("footer_copyright_text")}
  </p>

  <p className="md:ml-auto text-center md:text-right">
    {t("footer_rights_reserved")}
  </p>
</div>
  {/* Uncomment if needed
  <div className="space-x-4 text-center md:text-right">
    <a href="#">{t("link_privacy_policy")}</a>
    <a href="#">{t("link_terms_and_conditions")}</a>
    <a href="#">{t("link_accessibility_notice")}</a>
  </div>
  */}
    </footer>
  );
};
