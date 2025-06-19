"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { mission } from "@/assets/images/cover";
import { elderly_left } from "@/assets/images/cover"
import { elderly_right } from "@/assets/images/cover"
import { family } from "@/assets/images/cover"
import { HomeBackground } from "@/assets/images/cover"
import { doctor } from "@/assets/images/cover"

export function AboveFooter() {
  return (
    <section className="relative w-full bg-white py-12 px-4 flex justify-center items-center">
      <div className="relative w-full max-w-7xl bg-[#0F172A] text-white rounded-2xl px-8 py-10 overflow-hidden">
        {/* Text Content */}
        <div className="max-w-xl z-10 relative">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Don’t let healthcare worries hold you back
          </h2>
          <p className="text-base text-gray-300 mb-6">
            High costs, no insurance, or long waits? Get $19 visits, no insurance needed, and walk-in care. Our bilingual team welcomes you like family. Act now.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button className="bg-[#C1001F] hover:bg-red-800 text-white px-6 py-3 rounded-full text-sm font-medium">
              Book Your Visit
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-[#0F172A] transition">
              Find a Clinic Near You
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm text-white">
            <div className="flex gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <AiFillStar key={idx} size={16} />
              ))}
            </div>
            <span className="text-white">4.8/5 | 40+ Reviews</span>
          </div>
        </div>

        {/* Floating Images */}
        <Image src={family} alt="img1" className="absolute top-4 right-[10%] w-20 h-20 object-cover rounded-xl" />
        <Image src={mission} alt="img2" className="absolute top-4 right-[2%] w-20 h-20 object-cover rounded-xl" />
        <Image src={HomeBackground} alt="img3" className="absolute top-[50%] right-[15%] w-14 h-14 object-cover rounded-xl" />
        <Image src={doctor} alt="img4" className="absolute top-[45%] right-[5%] w-20 h-20 object-cover rounded-xl" />
        <Image src={elderly_right} alt="img5" className="absolute bottom-4 right-[20%] w-20 h-20 object-cover rounded-xl" />
        <Image src={elderly_left} alt="img6" className="absolute bottom-4 right-[5%] w-14 h-14 object-cover rounded-xl" />
      </div>
    </section>
  );
}