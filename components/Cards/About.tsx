"use client";

import React from "react";
import Image from "next/image";

import { FaArrowRight } from "react-icons/fa6";

export const About = ({
  image,
  heading,
  content,
}: {
  image: any;
  heading: string;
  content: string | undefined | null;
}) => {
  return (
    <article className="w-[100%] flex flex-col lg:flex-row justify-center items-center">
      <div
        style={{
          boxShadow: "5px 0 5px rgba(0, 0, 0, 0.8)",
        }}
        className="w-[320px] sm:w-[350px] md:w-[400px] h-[270px] sm:h-[300px] md:h-[350px] bg-[#3D3D3C] flex justify-center border-0 items-center rounded-[10px] z-20"
      >
        <Image
          src={image}
          alt="about image"
          className="object-cover rounded-[10px] bg-contain aspect-auto w-full h-full"
        />
      </div>
      <div className="w-[310px] h-[360px] mt-[-30px] pt-[40px] lg:pt-5 lg:mt-0 sm:w-[345px] md:w-[395px] lg:w-[450px] md:h-[350px] rounded-[10px] flex flex-col justify-center items-center lg:items-start gap-3 bg-[#3D3D3C] p-5 z-10">
        <h1 className="text-[#ffffff] font-poppins hidden lg:flex lg:text-[40px] text-left">
          {heading}
        </h1>
        <p className="text-[#ACACAC] h-[185px] lg:h-[150px] overflow-auto font-inter text-[18px] lg:text-[20px] text-center lg:text-left">
          {content}
        </p>
        <button className="text-[#ACACAC] font-inter text-[16px] flex items-center gap-2 text-left">
          more info{" "}
          <div className="text-[#ACACAC] font-inter text-[12px] p-[2px] rounded-full border border-[#ACACAC]">
            <FaArrowRight />
          </div>
        </button>
      </div>
    </article>
  );
};
