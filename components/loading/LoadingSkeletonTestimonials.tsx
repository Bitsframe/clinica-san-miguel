"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export  function LoadingSkeletonTestimonials() {
 
  const skeletons = [1, 2, 3];

  return (
    <div className="flex gap-4 overflow-hidden px-2">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-full sm:w-[80%] md:w-[50%] lg:w-[33.333%] px-2"
        >
          <div className="bg-[#F4F5F6] p-6 rounded-xl shadow-sm h-[13rem] flex flex-col justify-start text-left">
           

            <div className="flex gap-1 mb-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  width={16}
                  height={16}
                  baseColor="#E5E7EB"
                  highlightColor="#F3F4F6"
                />
              ))}
            </div>

            
            <Skeleton
              count={3}
              height={12}
              className="mb-2"
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
            />

           
            <Skeleton
              width={80}
              height={10}
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
            />

          
            <div className="absolute bottom-0 right-2 opacity-30 text-[100px] text-gray-300 select-none pointer-events-none">
             {"//"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
