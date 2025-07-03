"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Divider } from "@/utils";

const LoadingSkeletonAboutScreen = () => {
  const expertiseSkeletons = [1, 2, 3];

  return (
    <main className="py-[5%] flex flex-col gap-20 px-2 lg:px-[20px] items-center justify-center">
      <section className="flex flex-col items-center justify-center gap-10 lg:gap-32 w-full">

        {/* Title + Paragraph */}
        <article className="flex flex-col md:flex-row justify-center items-start w-full gap-5 lg:gap-20">
          <div className="flex items-start flex-col w-full md:w-[40%]">
            <Skeleton width={`80%`} height={50} />
          </div>
          <div className="w-full md:w-[60%] space-y-2">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        </article>

        {/* Main Image */}
        <article className="w-[95%] md:w-[75%] lg:w-[50%] flex justify-center items-center">
          <Skeleton height={300} width={`100%`} />
        </article>

        {/* Icon + Title + Text */}
        <article className="flex flex-col md:flex-row justify-center gap-6 items-start w-full">
          <div className="flex items-start flex-col gap-2 w-full md:w-[40%]">
            <Skeleton circle width={60} height={60} />
            <Skeleton height={40} width={`80%`} />
          </div>
          <div className="w-full md:w-[60%] space-y-2">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        </article>
      </section>

      <Divider />

      {/* Expertise Cards */}
      {expertiseSkeletons.map((id, index) => (
        <div key={id} className="w-full flex flex-col items-center">
          <div className="w-full md:w-[85%] lg:w-[70%] flex flex-col md:flex-row gap-6 items-start">
            <Skeleton width={100} height={100} className="rounded-lg" />
            <div className="flex flex-col space-y-2 w-full">
              <Skeleton width={`70%`} height={30} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>
          </div>
          {index !== expertiseSkeletons.length - 1 && <Divider />}
        </div>
      ))}
    </main>
  );
};

export default LoadingSkeletonAboutScreen;
