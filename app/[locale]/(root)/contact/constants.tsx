"use client";

import { Location } from "@/components";
import { useSupabase } from "@/context/supabaseContext";
import { useEffect, useState } from "react";

export const LocationsData = () => {
  const { locations, fetchSearchedData, searchedData } = useSupabase();

  const [locationData, setLocationData] = useState<any[]>([]);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState("");
  const tabs = [
    { id: 2, name: "Dallas", value: "A" },
    { id: 3, name: "Houston", value: "B" },
    { id: 4, name: "San Antonio", value: "C" },
  ];

useEffect(() => {
  if (selectedLocationGroup === "") {
    setLocationData(locations);
  } else {
    fetchSearchedData("Locations", "Group", selectedLocationGroup);
    setLocationData(searchedData);
  }
}, [locations, selectedLocationGroup, searchedData, fetchSearchedData]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-end items-start w-full pr-32">
        <select
          value={selectedLocationGroup}
          onChange={(e) => setSelectedLocationGroup(e.target.value)}
          className="w-[120px] bg-[#EAEAEA] h-[45px] rounded-[12px] border-none outline-none"
        >
          <option value="">All</option>
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-center w-full">
        {locationData.map((location) => (
          <Location
            key={location.id}
            id={location.id}
            locationName={location.title}
            number={location.phone}
            route={""}
            location={location.direction}
          />
        ))}
      </div>
    </div>
  );
};
