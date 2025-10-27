"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CompactService = ({
  id,
  heading,
  icon,
  description,
  mode,
}: {
  id: number;
  heading: string | null | undefined;
  icon: string | null | undefined;
  description: string | null | undefined;
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

  const handleService = () => {
    router.push(`/services/${id}`);
  };

  return (
    <Link href={`/services/${id}`}>
      <article
        className="w-[300px] h-[300px] m-5 rounded-[10px] cursor-pointer flex flex-col gap-3 justify-evenly p-5 py-14"
        style={{
          backgroundColor: `${theme.backgroundColor}`,
          boxShadow: "2px 3px 6px 6px rgba(0, 0, 0, 0.2)",
        }}
        // onClick={handleService}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <Image
              src={icon}
              alt={"service icon"}
              className="object-contain w-10 h-10 rounded-[50%] aspect-auto"
              width={40}
              height={40}
            />
          )}
          <h1
            className="font-semibold font-poppins text-[18px] capitalize"
            style={{ color: `${theme.textColor}` }}
          >
            {heading}
          </h1>
        </div>
        {description && (
          <div className="overflow-y-auto h-[240px]">
            <p
              className="text-[16px] font-inter text-left"
              style={{ color: `${theme.textColor}` }}
            >
              {description.length > 150
                ? `${description.slice(0, 150)}...`
                : description}
            </p>
          </div>
        )}
      </article>
    </Link>
  );
};
