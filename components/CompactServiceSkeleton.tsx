import React from "react";

export const CompactServiceSkeleton = () => {
  return (
    <div className="w-[250px] h-[220px] bg-gray-200 animate-pulse rounded-xl p-4 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-full" />
      <div className="h-3 bg-gray-300 rounded w-[80%]" />
    </div>
  );
};
