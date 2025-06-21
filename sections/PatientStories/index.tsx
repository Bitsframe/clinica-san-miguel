"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";

export function PatientStories() {
  const testimonials = [
    {
      quote:
        "I was nervous about my first visit, but the team made me feel like family. For just $19, I got the care I needed without stress. Thank you, Clinica San Miguel!",
      author: "Maria G., Houston",
    },
    {
      quote:
        "I wasn’t sure what to expect, but the entire staff made me feel at ease. It’s rare to find such compassionate care at such an affordable price.",
      author: "James L., Dallas",
    },
    {
      quote:
        "Clinica San Miguel provides dependable, affordable care for the entire family — we’re proud to be part of your wellness journey.",
      author: "Team Clinica San Miguel",
    },
  ];

  return (
    <section className="w-full bg-white px-6 py-16 md:px-20 lg:px-32">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Real Stories from Our Patients
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            At Clinica San Miguel, your health is our priority. Hear from others who’ve found care and comfort with us.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Fixed-Width Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="w-[380px] bg-[#F4F5F6] p-6 rounded-xl relative overflow-hidden shadow-sm flex-shrink-0 flex flex-col justify-start"
          >
            {/* Star Rating */}
            <div className="flex gap-1 mb-2 mt-2 text-[#C1001F]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" stroke="none" className="w-4 h-4" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-800 font-medium text-base leading-snug mb-2 line-clamp-3">
              “{t.quote}”
            </p>

            {/* Author */}
            <p className="text-sm text-gray-500 font-medium">{t.author}</p>

            {/* Decorative Quote Symbol */}
            <div className="absolute bottom-0 right-2 opacity-40 text-[120px] leading-none font-extrabold text-gray-300 select-none">
              //
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
