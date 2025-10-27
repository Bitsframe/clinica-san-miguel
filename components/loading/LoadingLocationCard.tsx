"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingLocationCard = () => {
  return (
    <article className="w-full max-w-[380px] h-[240px] my-6 mx-4 rounded-[8px] shadow-sm border border-gray-200">
      {/* Map Skeleton */}
      <div className="relative w-full h-[140px] rounded-t-[8px] overflow-hidden">
        <Skeleton height={140} className="w-full h-full" />
        <div className="absolute bottom-3 right-3 z-10">
          <Skeleton circle width={36} height={36} />
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center h-[100px] gap-3 rounded-b-[8px]">
        {/* Location Name Skeleton */}
        <div className="w-full sm:w-1/2">
          <Skeleton height={20} width="85%" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex flex-col gap-3 w-full sm:w-[140px]">
          <Skeleton height={36} />
          <Skeleton height={36} />
        </div>
      </div>
    </article>
  );
};

export default LoadingLocationCard;
