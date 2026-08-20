"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface MapProps {
  location: string;
  height: number;
  title?: string;
}

function buildMapSrc(location: string): string {
  const looksLikePb =
    typeof location === "string" &&
    (location.includes("!1m") ||
      location.includes("!2d") ||
      location.length > 80);

  return looksLikePb
    ? `https://www.google.com/maps/embed?pb=${location}`
    : `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
}

/**
 * Shown while the iframe is actually fetching — spinner + "Loading map…".
 */
function MapLoadingState({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F4F5F6] text-[#6C7582]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-[#C1001F]" />
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium font-poppins">
        <MapPin className="h-3.5 w-3.5 text-[#C1001F]" />
        <span>{label}</span>
      </div>
    </div>
  );
}

/**
 * Shown for maps that are deliberately not loaded yet (offscreen). These
 * previously rendered the spinner and "Loading map…", which was inaccurate —
 * nothing is in flight — and made a working lazy-load look like 17 stalled
 * embeds. Static, no spinner, no animation, no network.
 */
function MapIdleState({ label }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F4F5F6] text-[#6C7582]"
      aria-hidden="true"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        <MapPin className="h-5 w-5 text-[#C1001F]" />
      </div>
      {label ? (
        <span className="px-3 text-center text-xs font-medium font-poppins line-clamp-1">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export const Map: React.FC<MapProps> = ({ height, location, title }) => {
  const t = useTranslations("contact_page");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const src = useMemo(() => buildMapSrc(location), [location]);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-t-[5px] bg-[#F4F5F6]"
      style={{ minHeight: height }}
    >
      {/* Idle (offscreen, nothing fetching) vs genuinely loading are now
          distinct states — previously both rendered the spinner. */}
      {!isVisible && <MapIdleState label={title} />}
      {isVisible && !isLoaded && <MapLoadingState label={t("loading_map")} />}

      {isVisible && (
        <iframe
          src={src}
          height={height}
          title={title ?? "Clinic location map"}
          className={`h-full w-full border-0 transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ borderRadius: "5px 0 5px 0" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};
