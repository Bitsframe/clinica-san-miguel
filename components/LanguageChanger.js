"use client";

import { useRouter, usePathname } from "@/navigation";

export default function LanguageChanger({ locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleChange("en")}
        className={`px-3 py-1 rounded-md border text-sm ${
          locale === "en"
            ? "bg-[#C1001F] text-white border-[#C1001F]"
            : "bg-white text-gray-800 border-gray-300"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => handleChange("es")}
        className={`px-3 py-1 rounded-md border text-sm ${
          locale === "es"
            ? "bg-[#C1001F] text-white border-[#C1001F]"
            : "bg-white text-gray-800 border-gray-300"
        }`}
      >
        ES
      </button>
    </div>
  );
}
