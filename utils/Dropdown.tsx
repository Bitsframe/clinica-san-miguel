"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Option {
  id: number;
  heading: string;
  icon?: string; // Make the icon property optional
  route?: string | undefined;
}

export const Dropdown = ({ options }: { options: Option[] }) => {
  const router = useRouter();

  const handleDropdownItem = (route: string | undefined) => {
    if (route) {
      router.push(route);
    } else {
    }
  };

  return (
    <div className="absolute rounded-[10px] flex flex-col justify-center items-center bg-[#ffffff] shadow-md">
      {options.map((option, index) => (
        <div
          key={option.id}
          className={`${
            index === options.length - 1
              ? "rounded-b-[10px]"
              : index === 0
              ? "rounded-t-[10px]"
              : ""
          } flex justify-evenly items-center w-full p-2 hover:cursor-pointer hover:bg-[#969696]`}
          onClick={() => handleDropdownItem(option.route)}
        >
          {option.icon && (
            <Image src={option.icon} alt={`Icon for ${option.heading}`} />
          )}
          <span className="text-[16px] text-[#000000]">{option.heading}</span>
        </div>
      ))}
    </div>
  );
};