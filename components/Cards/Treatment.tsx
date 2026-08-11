"use client";

import { useState } from "react";
import Image from "next/image";

import { heart_monitor } from "@/assets/images";

import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "@/navigation";

export const Treatment = ({
  heading,
  image,
  icon,
  description,
  mode,
  id,
}: {
  id: number;
  heading: string | null;
  image: any;
  icon: any;
  description: string | null;
  mode: string;
}) => {
  const dark = {
    backgroundColor: "#3D3D3C",
    textColor: "#F8F5F0",
    iconColor: "#F8F5F0",
  };

  const light = {
    backgroundColor: "#F8F5F0",
    textColor: "#3D3D3C",
    iconColor: "#3D3D3C",
  };

  const [theme, setTheme] = useState(mode === "dark" ? dark : light);
  const router = useRouter();

  return (
    <article
      className={`flex flex-col justify-evenly p-4 m-3 w-[310px] h-[450px] rounded-[10px] shadow-lg`}
      style={{
        backgroundColor: `${theme.backgroundColor}`,
        boxShadow: "2px 3px 6px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex justify-between items-center h-[50px]">
        <div className="flex items-center gap-3">
         <div className="w-10">
          <Image
            src={icon}
            alt="service icon"
            width={40}
            height={40}
            className="object-contain w-10 h-10 aspect-auto"
            style={{
              color: mode === "dark" ? "#F8F5F0" : "#3D3D3C",
            }}
          />
          </div>
          <h1
            className="font-semibold font-poppins text-[25px] capitalize text-left"
            style={{ color: `${theme.textColor}` }}
          >
            {heading?.slice(0, 20)}
            {heading?.length && heading.length > 20 && "..."}
          </h1>
        </div>

        <Image
          src={heart_monitor}
          className="w-[29px] aspect-auto object-contain"
          alt={"heart_monitor icon"}
          width={29}
          height={29}
        />
      </div>
      <div
        className=" flex justify-center items-center rounded-[10px] shadow-md"
        style={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add a hardcoded shadow style
        }}
      >
        <Image
          src={image}
          alt={""}
          className="object-cover h-[170px] w-[280px] rounded-[10px] aspect-auto"
          width={280}
          height={170}
        />
      </div>
      <div className="overflow-y-auto h-[100px]">
        <p
          className="text-[16px] font-inter text-left"
          style={{ color: `${theme.textColor}` }}
        >
          {description}
        </p>
      </div>
      <div
        onClick={() => router.push(`/services/${id}`)}
        className="cursor-pointer flex gap-2 items-center"
      >
        <p className="text-[20px] font-poppins text-[#C1001F] lowercase">
          more info
        </p>
        <div className="border-[2px] border-[#C1001F] rounded-full w-[25px] h-[25px] text-[12px] text-[#C1001F] flex justify-center items-center">
          <FaArrowRightLong />
        </div>
      </div>
    </article>
  );
};
