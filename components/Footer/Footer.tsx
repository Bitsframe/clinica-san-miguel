"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import logo from "@/assets/images/logo/logo.png";
import { Link } from "@/navigation";

export const Footer = () => {
  const t = useTranslations("common");

  const pages = [
    { id: 1, name: t("link_home"), route: "/" },
    { id: 2, name: t("link_about"), route: "/about" },
    { id: 3, name: t("link_services"), route: "/services" },
    { id: 4, name: t("link_contact"), route: "/contact" },
    { id: 5, name: t("link_career"), route: "/career" },
    { id: 6, name: t("link_specials"), route: "/specials" },
  ];

  const socialLinks = [
    { id: 1, icon: <FaFacebookF />, route: "https://www.facebook.com/clinicasanmigueltx/" },
    { id: 2, icon: <FaInstagram />, route: "https://www.instagram.com/san_miguel_clinic_" },
    { id: 3, icon: <FaYoutube />, route: "https://www.youtube.com/channel/UC-89xwmnpU6ZEPSawRZKNIw" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-[#0F172A] mt-12">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Newsletter */}
        <div className="space-y-4">
          <Image src={logo} alt="Logo" width={160} height={60} />
          <p className="font-semibold">Join our newsletter</p>
          <div className="flex items-center bg-[#F4F5F6] rounded-xl px-4 py-2 max-w-md w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-[#F4F5F6] text-[#606877] placeholder:text-[#606877] text-base outline-none border-none pr-2"
            />
            <button className="w-10 h-10 bg-[#C1001F] text-white rounded-full flex items-center justify-center hover:bg-red-800 transition">
              <FiSend size={16} />
            </button>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col sm:flex-row gap-36 justify-end ml-6">
          {/* Quick Links */}
          <div>
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
          <div>
            <h4 className="font-semibold mb-3">Our Locations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Dallas</li>
              <li>Houston</li>
              <li>San Antonio</li>
              <li>See all 17 clinics</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold mb-3">Socials</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {socialLinks.map((social) => (
                <li key={social.id} className="flex items-center gap-2">
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

    <div className="mt-10 border-t border-gray-200 px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
         <p className="md:ml-24 text-center md:text-left mb-2 md:mb-0">
          © 2025 Clinica San Miguel. All Rights Reserved.
        </p>
          <div className="md:mr-24 text-center md:text-right space-x-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility Statement</a>
        </div>
</div>
    </footer>
  );
};
