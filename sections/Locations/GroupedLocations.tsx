"use client";

import { LocationDetailedCard } from "@/components";
import React, { useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/context/supabaseContext";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { LocationCardSkeleton } from "@/components/loading/LocationCardSkeleton";
import {
  normalizeZip5,
  findNearestLocationsForZipSearch,
  zipSearchDebounceMs,
  isPartialNumericZipInput,
  parseDistanceMiles,
  formatDistanceMiles,
  parseLatLngFromDirection,
} from "@/utils/zipcodeService";
import { Loader2, MapPin, Search } from "lucide-react";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import type { ClinicPin } from "@/components/ClinicMap";

const MapModal = dynamic(() => import("@/components/MapModal"), { ssr: false });
// Leaflet needs `window`, so the map is client-only.
const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
});

export const GroupedLocations = () => {
  const t = useTranslations("home");
  const tc = useTranslations("contact_page");
  const locale = useLocale();
  const { ref, isVisible } = useLazyLoad({ triggerOnce: true });

  const [selectedTab, setSelectedTab] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalLocation, setModalLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [allLocationData, setAllLocationData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [zipSearchLoading, setZipSearchLoading] = useState(false);

  const { fetchLocalizedTable } = useSupabase();

  const tabs = [
    { id: 1, name: t("all"), value: "", group: "" },
    { id: 2, name: t("dallas"), value: "dallas", group: "A" },
    { id: 3, name: t("houston"), value: "houston", group: "B" },
    { id: 4, name: t("sanAntonio"), value: "sanantonio", group: "C" },
  ];

  const activeZip = normalizeZip5(debouncedQuery.trim());
  const isZipSearch = Boolean(
    activeZip && !isPartialNumericZipInput(debouncedQuery.trim())
  );

  // Map pins are derived from the same list shown on the left, so the map always
  // matches the active city tab / ZIP search. Coordinates are parsed from each
  // clinic's `direction` (a Google "pb" embed string).
  const mapPins = useMemo<ClinicPin[]>(() => {
    return locationData.flatMap((loc) => {
      const coords = parseLatLngFromDirection(loc.direction);
      if (!coords) return [];
      return [
        {
          id: loc.id,
          name: loc.title ?? "Clinica San Miguel",
          address: loc.address,
          lat: coords.lat,
          lng: coords.lng,
        },
      ];
    });
  }, [locationData]);

  const nearestMiles =
    isZipSearch && locationData.length > 0
      ? parseDistanceMiles(locationData[0].distance)
      : undefined;

  useEffect(() => {
    const ms = zipSearchDebounceMs(query);
    const timer = setTimeout(() => setDebouncedQuery(query), ms);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rows = await fetchLocalizedTable("Locations", locale);
        setAllLocationData(rows);
        setLocationData(rows);
      } catch {
        // Keep existing location state on fetch failure.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchLocalizedTable, locale]);

  useEffect(() => {
    let cancelled = false;

    const filterLocations = async () => {
      let filtered = [...allLocationData];

      if (selectedGroup !== "") {
        filtered = filtered.filter((row) => row.Group === selectedGroup);
      }

      const q = debouncedQuery.trim();
      if (q === "") {
        if (!cancelled) setLocationData(filtered);
        return;
      }

      if (isPartialNumericZipInput(q)) {
        if (!cancelled) setLocationData(filtered);
        return;
      }

      const zip5 = normalizeZip5(q);
      if (zip5) {
        if (loading || allLocationData.length === 0) {
          if (!cancelled) setLocationData(filtered);
          return;
        }

        setZipSearchLoading(true);
        try {
          const pool = filtered.length > 0 ? filtered : allLocationData;
          const nearestLocations = await findNearestLocationsForZipSearch(
            zip5,
            pool,
            9
          );
          if (cancelled) return;
          filtered = nearestLocations.length > 0 ? nearestLocations : [];
        } finally {
          if (!cancelled) setZipSearchLoading(false);
        }
      } else {
        filtered = filtered.filter(
          (loc) =>
            loc.title?.toLowerCase().includes(q.toLowerCase()) ||
            loc.address?.toLowerCase().includes(q.toLowerCase())
        );
      }

      if (!cancelled) setLocationData(filtered);
    };

    void filterLocations();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedGroup, allLocationData, loading]);

  const handleOpenMap = (location: string) => {
    setModalLocation(location);
    setShowModal(true);
  };

  const handleCloseMap = () => {
    setShowModal(false);
    setModalLocation(null);
  };

  return (
    <section
      ref={ref}
      id="grouped-locations"
      className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-8"
    >
      <div className="max-w-7xl mx-auto rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-[#FAFAFA] px-6 sm:px-8 lg:px-10 py-8 sm:py-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F] mb-3">
            {t("section2_title")}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins text-[#19192C] leading-tight max-w-3xl mx-auto">
            {t("section2_title2")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#3D3D3C] font-inter leading-relaxed max-w-2xl mx-auto">
            {t("section2_p1")} {t("section2_p2")}
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4 sm:p-5 space-y-4 shrink-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6C7582]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d+$/.test(value)) {
                    if (value.length <= 5) setQuery(value);
                  } else {
                    setQuery(value);
                  }
                }}
                placeholder={tc("search_placeholder")}
                className="w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 py-3 text-sm sm:text-base text-[#19192C] placeholder:text-[#6C7582] font-poppins shadow-sm focus:border-[#C1001F] focus:outline-none focus:ring-2 focus:ring-[#C1001F]/20"
              />
            </div>

            {isPartialNumericZipInput(query.trim()) && (
              <p className="text-sm text-[#6C7582] font-poppins px-1">
                {t("section2_zip_need_five_digits")}
              </p>
            )}

            {isZipSearch && (
              <div className="flex items-center gap-3 rounded-xl border border-[#C1001F]/15 bg-[#C1001F]/5 px-4 py-3">
                {zipSearchLoading ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#C1001F]" />
                ) : (
                  <MapPin className="h-5 w-5 shrink-0 text-[#C1001F]" />
                )}
                <p className="text-sm font-medium text-[#19192C] font-poppins">
                  {zipSearchLoading
                    ? t("section2_zip_updating_distances")
                    : nearestMiles != null
                      ? t("section2_nearest_is", {
                          distance: formatDistanceMiles(nearestMiles),
                        })
                      : tc("no_results")}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = selectedTab === tab.value;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedTab(tab.value);
                      setSelectedGroup(tab.group);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium font-poppins transition-colors ${
                      isActive
                        ? "bg-[#C1001F] text-white shadow-sm"
                        : "bg-white text-[#6C7582] border border-gray-200 hover:border-[#C1001F]/30 hover:text-[#19192C]"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] lg:max-h-[500px] pr-1">
                {!isVisible || loading || (zipSearchLoading && locationData.length === 0) ? (
                  [...Array(3)].map((_, i) => <LocationCardSkeleton key={i} />)
                ) : locationData.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-[#F8F5F0] px-6 py-12 text-center">
                    <MapPin className="mx-auto h-10 w-10 text-[#C1001F]/40 mb-3" />
                    <p className="text-base font-medium text-[#19192C] font-poppins">
                      {tc("no_results")}
                    </p>
                  </div>
                ) : (
                  locationData.map((loc, index) => (
                    <LocationDetailedCard
                      key={loc.id}
                      id={(loc.slug as string) || loc.id}
                      address={loc.address}
                      name={loc.title}
                      phone={loc.phone}
                      distanceMiles={parseDistanceMiles(loc.distance)}
                      rank={isZipSearch ? index + 1 : undefined}
                      onMapClick={() => handleOpenMap(loc.direction)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] overflow-hidden h-[320px] sm:h-[400px] lg:h-[580px]">
                <ClinicMap pins={mapPins} height={580} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && modalLocation && (
        <MapModal location={modalLocation} onClose={handleCloseMap} />
      )}
    </section>
  );
};
