"use client";

import { useState } from "react";
import { Loader2, MapPin, Navigation, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { LocationCardSkeleton } from "@/components/loading/LocationCardSkeleton";

type LocationCardProps = {
  id: number | string | null;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  distanceMiles?: number;
  rank?: number;
  onMapClick?: () => void;
  loading?: boolean;
};

function formatDistance(miles: number) {
  return miles < 10 ? miles.toFixed(1) : Math.round(miles).toString();
}

export const LocationDetailedCard = ({
  id,
  name,
  address,
  phone,
  distanceMiles,
  rank,
  onMapClick,
  loading,
}: LocationCardProps) => {
  const t = useTranslations("location_buttons");
  const tc = useTranslations("contact_page");

  if (loading) {
    return <LocationCardSkeleton />;
  }

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-[#C1001F]/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-base font-semibold font-poppins text-[#19192C] leading-snug min-w-0">
          {name}
        </h4>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {distanceMiles != null && (
            <div className="flex items-center gap-1 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-xs font-semibold text-[#19192C]">
              <Navigation className="h-3 w-3 text-[#C1001F]" />
              {tc("miles_away", { distance: formatDistance(distanceMiles) })}
            </div>
          )}
          {rank != null && rank <= 3 && (
            <div className="rounded-full bg-[#C1001F] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              #{rank} {tc("nearest")}
            </div>
          )}
        </div>
      </div>

      {(address || phone) && (
        <div className="rounded-lg border border-gray-100 bg-[#FAFAFA] px-3 py-2.5 space-y-2 mb-4">
          {phone && (
            <a
              href={`tel:+1${phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 text-sm text-[#3D3D3C] hover:text-[#C1001F] transition-colors"
            >
              <Phone className="h-4 w-4 text-[#C1001F] shrink-0" />
              {phone}
            </a>
          )}
          {address && (
            <p className="flex items-start gap-2 text-sm text-[#3D3D3C] leading-snug">
              <MapPin className="h-4 w-4 text-[#C1001F] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{address}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {id != null ? (
          <Link
            href={`/contact/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#C1001F] px-4 py-2.5 text-sm font-medium font-poppins text-white hover:bg-[#a30019] transition-colors"
          >
            {t("viewDetails")} →
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#C1001F] px-4 py-2.5 text-sm font-medium font-poppins text-white opacity-80 cursor-not-allowed"
          >
            {t("viewDetails")} →
          </button>
        )}

        <button
          type="button"
          onClick={onMapClick}
          className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium font-poppins text-[#19192C] hover:bg-gray-50 transition-colors"
        >
          {t("getDirections")} →
        </button>
      </div>
    </article>
  );
};
