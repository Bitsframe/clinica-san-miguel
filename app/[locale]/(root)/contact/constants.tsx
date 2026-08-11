"use client";

import { useSupabase } from "@/context/supabaseContext";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Location } from "@/components";
import LoadingLocationCard from "@/components/loading/LoadingLocationCard";
import {
  normalizeZip5,
  findNearestLocationsForZipSearch,
  zipSearchDebounceMs,
  isPartialNumericZipInput,
  parseDistanceMiles,
  formatDistanceMiles,
} from "@/utils/zipcodeService";
import { useSearchParams } from "next/navigation";
import { Loader2, MapPin, Search } from "lucide-react";

export const LocationsData = ({ initialLocations = [] }: { initialLocations?: any[] }) => {
  const { fetchLocalizedTable } = useSupabase();
  const locale = useLocale();
  const th = useTranslations("home");
  const tc = useTranslations("contact_page");
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");

  const [allLocations, setAllLocations] = useState<any[]>(initialLocations);
  const [locationData, setLocationData] = useState<any[]>(initialLocations);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(initialLocations.length === 0);
  const [zipRanking, setZipRanking] = useState(false);

  const tabs = useMemo(() => {
    const defaultTabs = [{ id: 1, name: th("all"), value: "" }];
    const cities = new Set<string>();
    allLocations.forEach((loc) => {
      const match = loc.address?.match(/,\s*([^,]+),\s*TX/i);
      if (match && match[1]) {
        cities.add(match[1].trim());
      }
    });
    const sortedCities = Array.from(cities).sort();
    sortedCities.forEach((city, index) => {
      defaultTabs.push({ id: index + 2, name: city, value: city });
    });
    return defaultTabs;
  }, [allLocations, th]);

  const activeZip = normalizeZip5(debouncedQuery.trim());
  const isZipSearch = Boolean(activeZip && !isPartialNumericZipInput(debouncedQuery.trim()));
  const nearestMiles =
    isZipSearch && locationData.length > 0
      ? parseDistanceMiles(locationData[0].distance)
      : undefined;

  useEffect(() => {
    if (cityParam && tabs.length > 1) {
      const paramLower = cityParam.toLowerCase();
      // Handle legacy param format
      const normalizedParam = paramLower === "sanantonio" ? "san antonio" : paramLower;
      const matchedTab = tabs.find(t => t.value.toLowerCase() === normalizedParam);
      if (matchedTab) {
        setSelectedLocationGroup(matchedTab.value);
      }
    }
  }, [cityParam, tabs]);

  useEffect(() => {
    const ms = zipSearchDebounceMs(query);
    const timer = setTimeout(() => setDebouncedQuery(query), ms);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLocalizedTable("Locations", locale);
        setAllLocations(data);
        setLocationData(data);
      } catch {
        // Keep existing location state on fetch failure.
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchLocalizedTable, locale]);

  useEffect(() => {
    let cancelled = false;

    const filterLocations = async () => {
      let filtered = [...allLocations];

      if (selectedLocationGroup !== "") {
        filtered = filtered.filter((loc) => {
          const match = loc.address?.match(/,\s*([^,]+),\s*TX/i);
          const city = match ? match[1].trim() : "";
          return city === selectedLocationGroup;
        });
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
        if (isLoading || allLocations.length === 0) {
          if (!cancelled) setLocationData(filtered);
          return;
        }

        if (!cancelled) setZipRanking(true);
        try {
          const pool = filtered.length > 0 ? filtered : allLocations;
          const nearestLocations = await findNearestLocationsForZipSearch(
            zip5,
            pool,
            9
          );
          if (cancelled) return;
          filtered = nearestLocations.length > 0 ? nearestLocations : [];
        } finally {
          if (!cancelled) setZipRanking(false);
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
  }, [selectedLocationGroup, debouncedQuery, allLocations, isLoading]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-4 sm:px-0">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm space-y-5">
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
            className="w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-base text-[#19192C] placeholder:text-[#6C7582] font-poppins shadow-sm focus:border-[#C1001F] focus:outline-none focus:ring-2 focus:ring-[#C1001F]/20"
          />
        </div>

        {isPartialNumericZipInput(query.trim()) && (
          <p className="text-sm text-[#6C7582] font-poppins px-1">
            {th("section2_zip_need_five_digits")}
          </p>
        )}

        {isZipSearch && (
          <div className="flex items-center gap-3 rounded-xl border border-[#C1001F]/15 bg-[#C1001F]/5 px-4 py-3">
            {zipRanking ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#C1001F]" />
            ) : (
              <MapPin className="h-5 w-5 shrink-0 text-[#C1001F]" />
            )}
            <p className="text-sm font-medium text-[#19192C] font-poppins">
              {zipRanking
                ? th("section2_zip_updating_distances")
                : nearestMiles != null
                  ? th("section2_nearest_is", {
                      distance: formatDistanceMiles(nearestMiles),
                    })
                  : tc("no_results")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = selectedLocationGroup === tab.value;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLocationGroup(tab.value)}
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <LoadingLocationCard key={i} />
          ))}
        </div>
      ) : locationData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8F5F0] px-6 py-16 text-center">
          <MapPin className="mx-auto h-10 w-10 text-[#C1001F]/40 mb-3" />
          <p className="text-base font-medium text-[#19192C] font-poppins">
            {tc("no_results")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationData.map((location, index) => {
            const addr = (location.address || "").trim();
            const mapValue =
              addr.length >= 3 ? addr : location.direction || location.title;

            return (
              <Location
                key={location.id}
                id={(location.slug as string) || location.id}
                locationName={location.title}
                number={location.phone}
                route=""
                location={mapValue}
                address={addr || null}
                distanceMiles={parseDistanceMiles(location.distance)}
                rank={isZipSearch ? index + 1 : undefined}
                className="max-w-none mx-auto w-full"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
