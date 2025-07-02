"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FAQsLoadingSkeleton = () => {
  return (
    <div className="flex flex-col w-full max-w-2xl gap-4 mt-10 px-4 sm:px-0">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="w-full rounded-md bg-gradient-to-r from-[#A9A9A9] to-[#D1D3D4] border border-[#D1D5DB] shadow-sm p-5"
        >
          <Skeleton height={18} width={`80%`} className="mb-3" />
          <Skeleton count={2} height={14} />
        </div>
      ))}
    </div>
  );
};

export default FAQsLoadingSkeleton;
