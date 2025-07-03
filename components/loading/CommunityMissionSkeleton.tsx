"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CommunityMissionSkeleton() {
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center pt-4 sm:pt-8">
      <div className="space-y-10">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-start sm:items-center gap-4">
            {/* Circle skeleton for icon */}
            <div className="w-[60px] h-[60px] sm:w-[67px] sm:h-[67px] rounded-full bg-gray-300 flex items-center justify-center shrink-0">
              <Skeleton
                circle
                height={24}
                width={24}
                baseColor="#9CA3AF"
                highlightColor="#D1D5DB"
              />
            </div>

            {/* Title and paragraph skeletons */}
            <div className="flex flex-col">
              <Skeleton
                height={18}
                width={120}
                className="mb-2"
                baseColor="#9CA3AF"
                highlightColor="#D1D5DB"
              />
              <Skeleton
                height={12}
                width={200}
                baseColor="#9CA3AF"
                highlightColor="#D1D5DB"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
