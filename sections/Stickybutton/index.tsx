"use client";

import { useTranslations } from "next-intl";

const StickyMobileButton = () => {
  const t = useTranslations("home"); 
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden">
      <button className="bg-[#C1001F] text-white px-6 py-3 rounded-full shadow-lg font-medium text-sm">
        {t("book_your_visit")}
      </button>
    </div>
  );
};

export default StickyMobileButton;
