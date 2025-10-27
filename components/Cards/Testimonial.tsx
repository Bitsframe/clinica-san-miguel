"use client";

import { OpeningCommas } from "@/assets/images";

import Image from "next/image";

import StarRatings from "react-star-ratings";

export const Testimonial = ({
  comment,
  author,
  ratings,
  mode,
}: {
  comment: string | null;
  author: string | null;
  ratings: number;
  mode: string;
}) => {
  return (
    <article
      className={`w-[254px] h-[218px] ${
        mode === "dark" ? "bg-primary" : "bg-transparent"
      }  p-3 rounded-[10px] flex flex-col gap-4 items-start`}
    >
      <div>
        <Image
          src={OpeningCommas}
          alt={"Commas"}
          className="w-[22px] aspect-auto object-contain"
        />
      </div>
      <p
        className={`text-[16px] ${
          mode === "dark" ? "text-[#F8F5F0]" : "text-[#413D45]"
        } overflow-auto h-[100px] font-[700] font-poppins`}
      >
        &quot;{comment}&quot;
      </p>

      <div className="flex flex-col">
        <p
          className={`${
            mode === "dark" ? "text-[#F8F5F0]" : "text-[#413D45]"
          } text-[11.7px] font-inter `}
        >
          {author}
        </p>

        <StarRatings
          rating={+ratings}
          starDimension="15px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="#C1001F"
        />
      </div>
    </article>
  );
};
