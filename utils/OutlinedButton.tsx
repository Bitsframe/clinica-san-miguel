"use client";

import { useEffect, useState } from "react";

// OutlinedButton Component
export const OutlinedButton = ({
  text,
  textColor,
  size,
  route,
  borderColor,
}: {
  text: string;
  textColor: string;
  size: { width: string; height: string };
  route: string;
  borderColor: string;
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Check if window is defined before using it
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const widthWithoutPx = parseInt(size.width);
  const heightWithoutPx = parseInt(size.height);

  const isMediumScreen = windowWidth < 1024;

  const calculatedWidth = isMediumScreen
    ? `calc(${widthWithoutPx}px - ${widthWithoutPx * 0.4}px)`
    : size.width;
  const calculatedHeight = isMediumScreen
    ? `calc(${heightWithoutPx}px - ${heightWithoutPx * 0.25}px)`
    : size.height;

  return (
    <button
      className={`rounded-[10px] font-poppins flex justify-center items-center text-[14px] md:text-[16px] bg-transparent text-opacity-8`}
      style={{
        width: calculatedWidth,
        height: calculatedHeight,
        color: `${textColor}`,
        border: `2px solid ${borderColor}`,
      }}
    >
      {text}
    </button>
  );
};
