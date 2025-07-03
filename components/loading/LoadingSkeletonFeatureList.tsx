"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSkeletonFeatureList() {
  return (
    <div className="space-y-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          {/* Icon skeleton */}
          <div className="rounded-full w-8 h-8 bg-gray-300 flex items-center justify-center shrink-0">
            <Skeleton circle width={20} height={20} baseColor="#D1D5DB" highlightColor="#E5E7EB" />
          </div>

          {/* Text skeletons */}
          <div className="flex-1">
            <Skeleton
              height={14}
              width="60%"
              className="mb-1"
              baseColor="#D1D5DB"
              highlightColor="#E5E7EB"
            />
            <Skeleton
              height={10}
              width="80%"
              baseColor="#D1D5DB"
              highlightColor="#E5E7EB"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
