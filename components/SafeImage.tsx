// components/SafeImage.tsx
import React from "react";
import { StaticImageData } from "next/image"; // Import StaticImageData for static images

interface SafeImageProps {
  src: string | StaticImageData; // Accepts both string URLs or StaticImageData
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, width, height }) => {
  // If src is a StaticImageData object (imported image)
  const imageSrc = typeof src === "string" ? src : (src as StaticImageData).src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default SafeImage;
