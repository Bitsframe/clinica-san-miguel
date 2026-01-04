"use client";

import { useRouter, usePathname } from "@/navigation";
import { useState } from "react";

const FlagIcon = ({ code }) => {
  if (code === "en") {
    return (
      <svg className="w-6 h-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="4" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#c8102e" strokeWidth="6" />
      </svg>
    );
  }

  if (code === "es") {
    return (
      <svg className="w-6 h-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="10" fill="#c60b1e" />
        <rect y="10" width="60" height="10" fill="#ffc400" />
        <rect y="20" width="60" height="10" fill="#c60b1e" />
      </svg>
    );
  }

  return null;
};

export default function LanguageChanger({ locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleChange = (newLocale) => {
    router.push(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* === Trigger Button === */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-28 h-12
          rounded-full
          bg-gray-100
          border border-gray-300
          flex items-center justify-between
          px-6
          hover:bg-gray-200
          transition
        "
      >
        <FlagIcon code={currentLanguage?.code} />
        <svg
          className="w-5 h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* === Dropdown === */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-300 bg-white shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
            >
              <FlagIcon code={lang.code} />
              <span
                className={
                  locale === lang.code
                    ? "font-medium text-gray-900"
                    : "text-gray-600"
                }
              >
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
