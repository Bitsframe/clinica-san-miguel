"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const TreatmentSliderSkeleton = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-full h-72 sm:h-72 md:h-60 lg:h-[24rem] overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            {/* Image Placeholder */}
            <div className="w-full h-48 pt-3 px-3 overflow-hidden rounded-md">
              <Skeleton height={180} className="w-full h-full" />
            </div>

            {/* Content Placeholder */}
            <div className="flex flex-col flex-1 py-3 px-3 bg-white rounded-lg">
              <Skeleton height={20} width={`60%`} className="mb-2" />
              <Skeleton count={3} height={12} className="mb-2" />
              <div className="mt-auto pt-4">
                <Skeleton height={36} width={120} className="rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
