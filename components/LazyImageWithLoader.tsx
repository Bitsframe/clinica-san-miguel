"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getSupabaseImageUrl } from "@/utils/supabaseImage";

type LazyImageWithLoaderProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  /** fill: positioned box. poster: stable-style portrait fit (natural height). */
  layout?: "fill" | "responsive" | "poster";
};

export function LazyImageWithLoader({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "object-contain",
  width = 640,
  height,
  quality = 75,
  layout = "fill",
}: LazyImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);


  const imageClassName = `${className} transition-opacity duration-300 ${
    loaded ? "opacity-100" : "opacity-0"
  }`;

  if (layout === "poster") {
    return (
      <div className="relative flex w-full justify-center">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-[1]">
            <Loader2
              className="h-8 w-8 animate-spin text-[#C1001F]/70"
              aria-hidden
            />
          </div>
        )}

        {error ? (
          <div className="flex min-h-[200px] w-full items-center justify-center px-4 text-center text-sm text-[#6C7582] font-poppins">
            Image unavailable
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 500px"
            priority={priority}
            className={`mx-auto h-auto w-full max-w-[340px] rounded-xl md:max-w-[500px] ${imageClassName}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    );
  }

  if (layout === "responsive") {
    return (
      <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[300px]">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5F0] animate-pulse z-[1]">
            <Loader2
              className="h-8 w-8 animate-spin text-[#C1001F]/70"
              aria-hidden
            />
          </div>
        )}

        {error ? (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-[#6C7582] font-poppins">
            Image unavailable
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`max-h-full max-w-full object-contain ${imageClassName}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    );
  }

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
          className={imageClassName}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}
