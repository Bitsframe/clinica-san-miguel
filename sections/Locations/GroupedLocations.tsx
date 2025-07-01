
"use client";

import { styles } from "@/app/[locale]/styles";
import { locationCover } from "@/assets/images/cover";
import { LocationDetailedCard } from "@/components";
import React, { useRef, useEffect, useState } from "react";
import { GroupedMap } from "@/components/Map";
import { useSupabase } from "@/context/supabaseContext";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/components/MapModal"), { ssr: false });

export const GroupedLocations = () => {
  const t = useTranslations("home");
  const locale = useLocale();

  const [selectedTab, setSelectedTab] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalLocation, setModalLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<any[]>([]);
  const targetHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const { fetchLocalizedTable } = useSupabase();

  const tabs = [
    {
      id: 1,
      name: t("all"),
      value: "",
      location: "14oe73P17wHPAV_L6R1DmmLVw3JDw60k&ehbc=2E312F",
    },
    {
      id: 2,
      name: t("dallas"),
      value: "dallas",
      location: "1vaZ0nzB6WqN9P4gHZedwyx0tGmVDSjE&ehbc=2E312F",
    },
    {
      id: 3,
      name: t("houston"),
      value: "houston",
      location: "1vrLm72whzL6KBgr7n_C2RfoeO1fH1u8&ehbc=2E312F",
    },
    {
      id: 4,
      name: t("sanAntonio"),
      value: "sanantonio",
      location: "1cwsxmz-1Sm0zYTFaNizGELErRpCQf_I&ehbc=2E312F",
    },
  ];

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rows = await fetchLocalizedTable("Locations", locale);

        if (selectedTab === "") {
          setLocationData(rows);
        } else {
          // 🔍 Filter based on title (city name stored in title)
          const filtered = rows.filter((row) =>
            row.title?.toLowerCase().includes(selectedTab.toLowerCase())
          );
          setLocationData(filtered);
        }
      } catch (err) {
        console.error("❌ Locations fetch error:", err);
      }
    };

    fetchData();
  }, [selectedTab, fetchLocalizedTable, locale]);

  const handleOpenMap = (location: string) => {
    setModalLocation(location);
    setShowModal(true);
  };

  const handleCloseMap = () => {
    setShowModal(false);
    setModalLocation(null);
  };

  return (
    <main id="grouped-locations" className="container mx-auto flex flex-col relative gap-4 -mt-4 sm:mt-0 p-1">
      <h1 className="font-inter font-semibold text-[40px] leading-[100%] tracking-[0] text-[#1B2432]">
        {t("section2_title2")}
      </h1>

      <p className="font-poppins font-normal text-[16px] leading-[130%] tracking-[0] text-[#6B7280]">
        {t("section2_p1")}
        <br />
        {t("section2_p2")}
      </p>

      <section className="flex w-full justify-center flex-col gap-3 lg:gap-0 lg:flex-row bg-[#F4F5F6]">
        {/* LEFT SECTION */}
        <article className="w-full lg:w-[40%] lg:mr-4 h-auto lg:h-[600px] flex flex-col items-center lg:items-start lg:pr-4 sm:pr-6 pr-4 pl-4 lg:pl-0">
          <div className="w-full max-w-[700px] flex flex-col gap-6 h-full">
            {/* Input */}
            <div className="w-full py-4">
              <input
                type="text"
                placeholder={t("section2_search_placeholder")}
                className="w-full bg-white text-[#6C7582] placeholder-[#6C7582] font-poppins text-[16px] px-4 py-3 rounded-xl border border-white focus:ring-0 focus:outline-none shadow-sm"
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`rounded-full px-4 py-2 text-sm font-poppins cursor-pointer transition`}
                  style={{
                    background: selectedTab === tab.value ? "#C1001F" : "#FFFFFF",
                    color: selectedTab === tab.value ? "#F8F5F0" : "#6C7582",
                    border: "1px solid #E5E7EB",
                  }}
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.name}
                </div>
              ))}
            </div>

            {/* Locations List */}
            <div className="flex flex-col gap-4 overflow-auto w-full max-h-[400px] pr-1">
              {locationData?.map((location) => (
                <LocationDetailedCard
                  key={location.id}
                  id={location.id}
                  address={location.address}
                  name={location.title}
                  phone={location.phone}
                  onMapClick={() => handleOpenMap(location.direction)}
                />
              ))}
            </div>
          </div>
        </article>

        {/* RIGHT MAP SECTION */}
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
