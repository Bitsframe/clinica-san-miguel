"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import { sample1, sample2, sample3, sample4 } from "@/assets/images/slider";

export const ImageCarousel = ({
  imagesData,
}: {
  imagesData: (string | null)[] | undefined;
}) => {
  // const allImages = [
  //   { id: 1, image: sample1 },
  //   { id: 2, image: sample2 },
  //   { id: 3, image: sample3 },
  //   { id: 4, image: sample4 },
  // ];

  const [selectedImage, setSelectedImage] = useState<string | undefined | null>(
    undefined
  );

  useEffect(() => {
    if (imagesData && imagesData.length > 0) {
      setSelectedImage(imagesData[0]);
    }
  }, [imagesData]);

  const handleClick = (image: string | null) => {
    setSelectedImage(image);
  };

  // const filteredImages = imagesData?.filter((item) => item !== selectedImage);

  return (
    <section
      className="min-w-[320px] max-w-[1000px] min-h-[430px] h-full  bg-[#D9D9D9] flex flex-col items-start justify-start gap-4 p-5 rounded-[10px] w-full"
      //   style={{ aspectRatio: "1:3" }}
    >
      <div className="w-full" style={{ aspectRatio: 1 }}>
        {selectedImage && (
          <div className="relative w-full h-full">
            <Image
              src={selectedImage}
              alt={`location image`}
              layout="fill"
              objectFit="center"
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {imagesData?.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="cursor-pointer"
          >
            {item && (
              <Image
                src={item}
                alt={`Image ${item}`}
                width={100}
                height={100}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
