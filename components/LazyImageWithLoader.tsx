"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type LazyImageWithLoaderProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function LazyImageWithLoader({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "object-contain",
}: LazyImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5F0] animate-pulse z-[1]">
          <Loader2 className="h-8 w-8 animate-spin text-[#C1001F]/70" aria-hidden />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5F0] text-sm text-[#6C7582] font-poppins px-4 text-center">
          Image unavailable
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`${className} transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}
