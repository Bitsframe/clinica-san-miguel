"use client";

import { MouseEventHandler, useEffect, useState } from "react";

// IconButton Component
export const IconButton = ({
  icon,
  fontSize,
  route,
  bgColor,
  size,
  onClick
}: {
  icon: any;
  fontSize: string;
  route: string;
  bgColor: string;
  onClick : MouseEventHandler
  size: { width: string; height: string };
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const widthWithoutPx = parseInt(size.width);
  const heightWithoutPx = parseInt(size.height);
  const fontSizeWithoutPX = parseInt(fontSize);

  const isMediumScreen = windowWidth < 1024;

  const calculatedWidth = isMediumScreen
    ? `calc(${widthWithoutPx}px - ${widthWithoutPx * 0.4}px)`
    : size.width;
  const calculatedHeight = isMediumScreen
    ? `calc(${heightWithoutPx}px - ${heightWithoutPx * 0.4}px)`
    : size.height;

  const calculatedFontSize = isMediumScreen
    ? `calc(${fontSizeWithoutPX}px - ${fontSizeWithoutPX * 0.3}px)`
    : fontSize;

  return (
    <button
    onClick={onClick}
      className="flex justify-center items-center rounded-full "
      style={{
        backgroundColor: `${bgColor}`,
        width: calculatedWidth,
        height: calculatedHeight,
      }}
    >
      <div
        className="text-[#ffffff] aspect-auto"
        style={{
          fontSize: calculatedFontSize,
        }}
      >
        {icon}
      </div>
    </button>
  );
};
