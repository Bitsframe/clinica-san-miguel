"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import gray from "../../assets/images/portriats/grey.png";
import maskGroup from "../../assets/images/portriats/Mask group.png";
import maskGroup2 from "../../assets/images/portriats/Mask group (2).png";
import vector from "../../assets/images/portriats/Vector1.png";
import { useTranslations } from "next-intl";

export const HeroBox = () => {
  const t = useTranslations("home");

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures that this effect runs once on mount

  const isSmallScreen = windowSize.width < 900;
  const isMediumScreen = windowSize.width < 1300;
  const scaleFactor = isSmallScreen ? 0.6 : isMediumScreen ? 0.8 : 1;

  return (
    <div
      style={{
        height: `calc(499px * ${scaleFactor})`,
        width: `calc(582px * ${scaleFactor})`,
      }}
    >
      <div
        style={{
          height: `calc(499px * ${scaleFactor})`,
          width: `calc(584px * ${scaleFactor})`,
        }}
      >
        <div
          style={{
            height: `calc(499px * ${scaleFactor})`,
            left: "0",
            top: "0",
            width: `calc(584px * ${scaleFactor})`,
          }}
        >
          <div
            style={{
              height: `calc(499px * ${scaleFactor})`,
              position: "relative",
            }}
          >
            <div
              style={{
                height: `calc(242px * ${scaleFactor})`,
                left: `calc(307px * ${scaleFactor})`,
                position: "absolute",
                top: "0",
                width: `calc(277px * ${scaleFactor})`,
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${vector})`,
                  backgroundSize: "100% 100%",
                  height: `calc(242px * ${scaleFactor})`,
                  position: "relative",
                  width: `calc(275px * ${scaleFactor})`,
                }}
              >
                <Image
                  src={vector}
                  style={{ width: `calc(275px * ${scaleFactor})` }}
                  // className="h-[242px] w-[275px]"
                  className="aspect-auto"
                  alt={""}
                />
                <div
                  className="font-poppins"
                  style={{
                    fontSize: `calc(35px * ${scaleFactor})`,
                    color: "#ffffff",
                    fontWeight: "700",
                    height: `calc(82px * ${scaleFactor})`,
                    left: `calc(19px * ${scaleFactor})`,
                    letterSpacing: "0",
                    lineHeight: "normal",
                    position: "absolute",
                    top: `calc(50px * ${scaleFactor})`,
                  }}
                >
                  {t("hero_image_title")}
                </div>
              </div>
            </div>
            <Image
              style={{
                height: `calc(499px * ${scaleFactor})`,
                left: "0",
                position: "absolute",
                top: "0",
                width: `calc(286px * ${scaleFactor})`,
              }}
              alt="Grey"
              src={gray}
            />
            <Image
              style={{
                height: `calc(499px * ${scaleFactor})`,
                left: "0",
                position: "absolute",
                top: "0",
                width: `calc(582px * ${scaleFactor})`,
              }}
              alt="Mask group"
              src={maskGroup}
            />
            <Image
              style={{
                height: `calc(249px * ${scaleFactor})`,
                left: `calc(307px * ${scaleFactor})`,
                position: "absolute",
                top: `calc(250px * ${scaleFactor})`,
                width: `calc(275px * ${scaleFactor})`,
              }}
              alt="Mask group"
              src={maskGroup2}
            />
            <div
              className="font-poppins"
              style={{
                color: "#ffffff",
                fontSize: `calc(36px * ${scaleFactor})`,
                fontWeight: "700",
                height: `calc(123px * ${scaleFactor})`,
                left: `calc(406px * ${scaleFactor})`,
                letterSpacing: "0",
                lineHeight: "normal",
                position: "absolute",
                top: `calc(279px * ${scaleFactor})`,
              }}
            >
              Clinica
              <br />
              San
              <br />
              Miguel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
