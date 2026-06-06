"use client";

import { useRouter, usePathname } from "@/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English", label: "EN" },
  { code: "es", name: "Español", label: "ES" },
] as const;

function FlagIcon({ code }: { code: string }) {
  if (code === "en") {
    return (
      <svg className="h-full w-full" viewBox="0 0 640 480" aria-hidden>
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        <path
          stroke="#fff"
          strokeWidth="37"
          d="M0 54h640M0 130h640M0 206h640M0 282h640M0 358h640M0 434h640"
        />
        <path fill="#192f6d" d="M0 0h364.8v258.5H0z" />
        <g fill="#fff">
          {[
            [61, 22], [123, 22], [185, 22], [247, 22], [309, 22],
            [92, 52], [154, 52], [216, 52], [278, 52],
            [61, 82], [123, 82], [185, 82], [247, 82], [309, 82],
            [92, 112], [154, 112], [216, 112], [278, 112],
            [61, 142], [123, 142], [185, 142], [247, 142], [309, 142],
            [92, 172], [154, 172], [216, 172], [278, 172],
            [61, 202], [123, 202], [185, 202], [247, 202], [309, 202],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="10" />
          ))}
        </g>
      </svg>
    );
  }

  if (code === "es") {
    return (
      <svg className="h-full w-full" viewBox="0 0 640 480" aria-hidden>
        <path fill="#c60b1e" d="M0 0h640v480H0z" />
        <path fill="#ffc400" d="M0 120h640v240H0z" />
      </svg>
    );
  }

  return null;
}

export default function LanguageChanger({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) ?? languages[0];

  const handleChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentLanguage.name}`}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1.5 pr-3 py-1.5 text-sm font-medium font-poppins shadow-sm transition-all hover:border-[#C1001F]/30 hover:bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#C1001F]/20"
      >
        <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
          <FlagIcon code={currentLanguage.code} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#19192C]">
          {currentLanguage.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#6C7582] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-[168px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
        >
          {languages.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleChange(lang.code)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-[#C1001F]/10 text-[#C1001F]"
                    : "text-[#19192C] hover:bg-gray-50"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
                  <FlagIcon code={lang.code} />
                </span>
                <span className="flex-1 text-sm font-medium font-poppins">
                  {lang.name}
                </span>
                {isActive && (
                  <Check className="h-4 w-4 shrink-0 text-[#C1001F]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
