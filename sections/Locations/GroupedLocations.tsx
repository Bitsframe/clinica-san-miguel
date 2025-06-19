"use client";

import { styles } from "@/app/[locale]/styles";
import { locationCover } from "@/assets/images/cover";
import { LocationDetailedCard } from "@/components";
import { GroupedMap } from "@/components/Map";
import { useSupabase } from "@/context/supabaseContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export const GroupedLocations = () => {
  const t = useTranslations("home");
  const [selectedTab, setSelectedTab] = useState("");

  const tabs = [
    {
      id: 1,
      name: "All",
      value: "",
      location: "14oe73P17wHPAV_L6R1DmmLVw3JDw60k&ehbc=2E312F",
    },
    {
      id: 2,
      name: "Dallas",
      value: "A",
      location: "1vaZ0nzB6WqN9P4gHZedwyx0tGmVDSjE&ehbc=2E312F",
    },
    {
      id: 3,
      name: "Houston",
      value: "B",
      location: "1vrLm72whzL6KBgr7n_C2RfoeO1fH1u8&ehbc=2E312F",
    },
    {
      id: 4,
      name: "San Antonio",
      value: "C",
      location: "1cwsxmz-1Sm0zYTFaNizGELErRpCQf_I&ehbc=2E312F",
    },
  ];

  const [locationData, setLocationData] = useState<any[]>([]);

  const { locations, fetchSearchedData, searchedData } = useSupabase();

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  useEffect(() => {
    if (selectedTab === "") {
      setLocationData(locations);
    } else {
      fetchSearchedData("Locations", "Group", selectedTab);
      setLocationData(searchedData);
    }
  }, [locations, selectedTab, searchedData]);

  return (
    <main className="flex flex-col relative gap-4 my-2 p-1 w-[100vw] md:w-[90vw] lg:w-[85vw] xl:w-[75vw]">
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
        <article className="flex justify-end w-full lg:w-1/2 h-[600px]">
          <article className="flex flex-col items-center lg:items-start gap-6 w-full h-full">
            {/* Input */}
            <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[75%] py-4">
              <input
                type="text"
                placeholder="Search clinics near by you..."
                className="w-full bg-[#FFFFFF] text-[#6C7582] placeholder-[#6C7582] font-poppins font-normal text-[16px] leading-[100%] tracking-[0] px-4 py-3 rounded-xl border border-white focus:ring-0 focus:outline-none shadow-sm"
              />
            </div>

            {/* Tabs */}
            <div className="flex justify-start items-center gap-3">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`rounded-full 
                    py-2 sm:py-2.5 md:py-3 
                    px-3 sm:px-4 md:px-5 
                    text-sm sm:text-base md:text-[1rem] 
                    font-normal text-center leading-none 
                    font-poppins cursor-pointer`}
                  style={{
                    background:
                      selectedTab === tab.value ? "#C1001F" : "#FFFFFF",
                    color:
                      selectedTab === tab.value ? "#F8F5F0" : "#6C7582",
                  }}
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.name}
                </div>
              ))}
            </div>

            {/* Locations List */}
            <article className="flex flex-col items-start justify-start gap-5 pr-2 overflow-auto w-full max-w-[83%] flex-grow">
              {locationData?.map((location) => (
                <LocationDetailedCard
                  key={location.id}
                  id={location.id}
                  address={location.address}
                  name={location.title}
                  phone={location.phone}
                />
              ))}
            </article>
          </article>
        </article>

        {/* RIGHT MAP SECTION */}
        <article className="flex justify-center items-start w-full lg:w-1/2 h-[600px]">
          <GroupedMap
            height={600}
            width={400}
            location={
              tabs.find((tab) => tab.value === selectedTab)?.location
            }
          />
        </article>
      </section>
    </main>
  );
};
