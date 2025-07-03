"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingOpportunities = () => {
  const widths = ["100%", "95%", "90%", "85%"];

  return (
    <ul className="list-disc pl-6 space-y-6 py-6 w-full">
      {widths.map((width, i) => (
        <li key={i} className="w-full">
          <div className="w-full inline-block">
            <Skeleton
              width={width}
              height={30}
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
              borderRadius={8}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoadingOpportunities;
