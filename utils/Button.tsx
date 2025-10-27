"use client";

import { useEffect, useState } from "react";

// Button Component
export const Button = ({
  text,
  size,
  route,
  bgColor,
  textColor,
  onClick,
  disabled = false
}: {
  text: string;
  size: { width: string; height: string };
  route?: string;
  bgColor: string;
  textColor: string;
  onClick: any;
  disabled?: boolean;
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
      disabled={disabled}
      className={`rounded-[10px] font-poppins flex justify-center items-center text-[14px] md:text-[17px] text-opacity-8 hover:opacity-75 active:opacity-90 disabled:opacity-30`}
      style={{
        width: calculatedWidth,
        height: calculatedHeight,
        backgroundColor: `${bgColor}`,
        color: `${textColor}`,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
