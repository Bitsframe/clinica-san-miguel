
"use client";

import { styles } from "@/app/[locale]/styles";
import { locationCover } from "@/assets/images/cover";
import { LocationDetailedCard } from "@/components";
import React, { useRef, useEffect, useState } from "react";
import { GroupedMap } from "@/components/Map";
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
} from "@/utils/zipcodeService";

const MapModal = dynamic(() => import("@/components/MapModal"), { ssr: false });

export const GroupedLocations = () => {
  const t = useTranslations("home");
  const locale = useLocale();

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
  const targetHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const { fetchTableRows } = useSupabase();

  /* ───────────── tabs ───────────── */
  const tabs = [
    { id: 1, name: t("all"),        value: "",           group: "",  location: "14oe73P17wHPAV_L6R1DmmLVw3JDw60k&ehbc=2E312F" },
    { id: 2, name: t("dallas"),     value: "dallas",     group: "A", location: "1vaZ0nzB6WqN9P4gHZedwyx0tGmVDSjE&ehbc=2E312F" },
    { id: 3, name: t("houston"),    value: "houston",    group: "B", location: "1vrLm72whzL6KBgr7n_C2RfoeO1fH1u8&ehbc=2E312F" },
    { id: 4, name: t("sanAntonio"), value: "sanantonio", group: "C", location: "1cwsxmz-1Sm0zYTFaNizGELErRpCQf_I&ehbc=2E312F" },
  ];

  const handleTabChange = (value: string, group: string) => {
    setSelectedTab(value);
    setSelectedGroup(group);
  };

  /* ───────────── debounce search query (fast for ZIP digits) ───────────── */
  useEffect(() => {
    const ms = zipSearchDebounceMs(query);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, ms);

    return () => clearTimeout(timer);
  }, [query]);

  /* ───────────── fetch data ───────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rows = await fetchTableRows("Locations");
        setAllLocationData(rows);
        setLocationData(rows);
      } catch (err) {
        console.error("❌ Locations fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchTableRows, locale]);

  /* ───────────── filter data based on query and selectedTab ───────────── */
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

      // Avoid matching "5234" etc. against names/addresses — no distance until 5 digits
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

  /* ───────────── modal handlers ───────────── */
  const handleOpenMap  = (location: string) => { setModalLocation(location); setShowModal(true); };
  const handleCloseMap = () => { setShowModal(false); setModalLocation(null); };

  /* ───────────── render ───────────── */
  return (
    <main id="grouped-locations" className="container mx-auto flex flex-col relative gap-4 -mt-4 sm:mt-0 p-1">
      <h1 ref={targetHeadingRef} className="font-inter font-semibold text-[40px] leading-[100%] text-[#1B2432]">
        {t("section2_title2")}
      </h1>

      <p className="font-poppins text-[16px] leading-[130%] text-[#6B7280]">
        {t("section2_p1")}<br />{t("section2_p2")}
      </p>

      <section className="flex w-full flex-col lg:flex-row gap-3 lg:gap-0 bg-[#F4F5F6] justify-center">
        {/* ─── left list ─── */}
        <article className="w-full lg:w-[40%] lg:mr-4 h-auto lg:h-[600px] flex flex-col items-center lg:items-start lg:pr-4 sm:pr-6 pr-4 pl-4 lg:pl-0">
          <div className="w-full max-w-[700px] flex flex-col gap-6 h-full">
            {/* search */}
            <div className="w-full py-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("section2_search_placeholder")}
                className="w-full bg-white text-[#6C7582] placeholder-[#6C7582] font-poppins text-[16px] px-4 py-3 rounded-xl border border-white shadow-sm focus:ring-0 focus:outline-none"
              />
              {isPartialNumericZipInput(query.trim()) && (
                <p className="mt-2 font-poppins text-[12px] text-[#6B7280]">
                  {t("section2_zip_need_five_digits")}
                </p>
              )}
              {normalizeZip5(query.trim()) && !isPartialNumericZipInput(query.trim()) && (
                <p className="mt-2 font-poppins text-[12px] text-[#6B7280]">
                  {zipSearchLoading
                    ? t("section2_zip_updating_distances")
                    : t("section2_zip_distances_for", {
                        zip: normalizeZip5(query.trim())!,
                      })}
                </p>
              )}
            </div>

            {/* tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.value, tab.group)}
                  className="rounded-full px-4 py-2 text-sm font-poppins cursor-pointer transition"
                  style={{
                    background: selectedTab === tab.value ? "#C1001F" : "#FFFFFF",
                    color:      selectedTab === tab.value ? "#F8F5F0" : "#6C7582",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {tab.name}
                </div>
              ))}
            </div>

            {/* list or skeletons */}
            <div className="flex flex-col gap-4 overflow-auto w-full max-h-[400px] pr-1">
              {loading || (zipSearchLoading && locationData.length === 0) ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <LocationCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                locationData?.map((loc) => (
                  <LocationDetailedCard
                    key={loc.id}
                    id={loc.id}
                    address={loc.address}
                    name={loc.title}
                    phone={loc.phone}
                    distanceMiles={parseDistanceMiles(loc.distance)}
                    onMapClick={() => handleOpenMap(loc.direction)}
                  />
                ))
              )}
            </div>
          </div>
        </article>

        {/* ─── right map ─── */}
        <article className="hidden lg:flex justify-center items-start w-full lg:w-1/2 h-[600px]">
          <GroupedMap
            height={600}
            width={400}
            location={tabs.find((tab) => tab.value === selectedTab)?.location || ""}
          />
        </article>
      </section>

      {showModal && modalLocation && (
        <MapModal location={modalLocation} onClose={handleCloseMap} />
      )}
    </main>
  );
};

