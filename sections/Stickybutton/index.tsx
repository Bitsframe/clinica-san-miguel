"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const StickyMobileButton = () => {
  const t = useTranslations("home");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");

    const handleScroll = () => {
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setShowButton(heroBottom <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden">
      <button className="bg-[#C1001F] text-white px-6 py-3 rounded-full shadow-lg font-medium text-sm">
        {t("book_your_visit")}
      </button>
    </div>
  );
};

export default StickyMobileButton;
