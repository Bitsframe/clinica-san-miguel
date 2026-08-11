"use client";

import { direction } from "@/assets/images";
import Image from "next/image";
import { Map } from "../Map";
import { useRouter } from "@/navigation";
import { Loader2, MapPin, Navigation, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

function formatDistance(miles: number) {
  return miles < 10 ? miles.toFixed(1) : Math.round(miles).toString();
}

export const Location = ({
  id,
  locationName,
  number,
  route,
  location,
  address,
  distanceMiles,
  rank,
  className = "",
}: {
  id?: number | string | null;
  locationName: string | null;
  number: string | null;
  route: string | null;
  location: string | null;
  address?: string | null;
  distanceMiles?: number;
  rank?: number;
  className?: string;
}) => {
  const router = useRouter();
  const t = useTranslations("contact_page");
  const tLoc = useTranslations("location_buttons");

  if (!location) return null;

  return (
    <article
      className={`group w-full max-w-[380px] rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md ${className}`}
    >
      <div className="relative h-[150px] w-full overflow-hidden">
        <Map
          height={150}
          location={location}
          title={locationName ?? "Clinic location map"}
        />

        {distanceMiles != null && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-[#19192C] shadow-md border border-gray-100">
            <Navigation className="h-3.5 w-3.5 text-[#C1001F]" />
            <span>
              {t("miles_away", { distance: formatDistance(distanceMiles) })}
            </span>
          </div>
        )}

        {rank != null && rank <= 3 && (
          <div className="absolute top-3 right-3 z-20 rounded-full bg-[#C1001F] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            #{rank} {t("nearest")}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-20 opacity-90 group-hover:opacity-100 transition-opacity">
          <Image
            src={direction}
            alt=""
            className="w-8 h-8 drop-shadow-md"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="space-y-2.5">
          <h4 className="text-base font-semibold font-poppins text-[#19192C] leading-snug">
            {locationName}
          </h4>

          {(address || number) && (
            <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] px-3 py-2.5 space-y-2">
              {address && (
                <p className="flex items-start gap-2 text-sm text-[#3D3D3C] leading-snug">
                  <MapPin className="h-4 w-4 text-[#C1001F] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{address}</span>
                </p>
              )}
              {number && (
                <a
                  href={`tel:+1${number.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm text-[#3D3D3C] hover:text-[#C1001F] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#C1001F] shrink-0" />
                  {number}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {id != null && (
            <Link
              href={`/contact/${id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#C1001F] px-4 py-2.5 text-sm font-medium font-poppins text-white hover:bg-[#a30019] transition-colors"
            >
              {tLoc("viewDetails")} →
            </Link>
          )}
          {number && (
            <a
              href={`tel:+1${number.replace(/\D/g, "")}`}
              className="flex-1 rounded-xl bg-white border border-[#C1001F] py-3 text-center text-sm font-semibold text-[#C1001F] shadow-sm transition-all hover:bg-gray-50 transition-colors"
            >
              {t("call_clinic")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
