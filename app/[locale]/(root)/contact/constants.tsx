


// "use client";

// import { useSupabase } from "@/context/supabaseContext";
// import { useEffect, useState } from "react";
// import { useLocale } from "next-intl";
// import { Location } from "@/components";

// export const LocationsData = () => {
//   const { fetchLocalizedTable } = useSupabase();
//   const locale = useLocale();

//   const [allLocations, setAllLocations] = useState<any[]>([]);
//   const [locationData, setLocationData] = useState<any[]>([]);
//   const [selectedLocationGroup, setSelectedLocationGroup] = useState("");

//   const tabs = [
//     { id: 2, name: "Dallas", value: "A" },
//     { id: 3, name: "Houston", value: "B" },
//     { id: 4, name: "San Antonio", value: "C" },
//   ];

  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchLocalizedTable("Locations", locale);
//         setAllLocations(data);
//         setLocationData(data); 
//       } catch (err) {
//         console.error("❌ Error fetching location data:", err);
//       }
//     };

//     fetchData();
//   }, [fetchLocalizedTable, locale]);

//   useEffect(() => {
//     if (selectedLocationGroup === "") {
//       setLocationData(allLocations);
//     } else {
//       const filtered = allLocations.filter(
//         (loc) => loc.Group === selectedLocationGroup 
//       );
//       setLocationData(filtered);
//     }
//   }, [selectedLocationGroup, allLocations]);

//   return (
//     <div className="flex flex-col w-full gap-4">
//       <div className="flex justify-end items-start w-full pr-32">
//         <select
//           value={selectedLocationGroup}
//           onChange={(e) => setSelectedLocationGroup(e.target.value)}
//           className="w-[120px] bg-[#EAEAEA] h-[45px] rounded-[12px] border-none outline-none"
//         >
//           <option value="">All</option>
//           {tabs.map((tab) => (
//             <option key={tab.id} value={tab.value}>
//               {tab.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex flex-wrap justify-center w-full">
//         {locationData.map((location) => (
//           <Location
//             key={location.id}
//             id={location.id}
//             locationName={location.title}
//             number={location.phone}
//             route=""
//             location={location.direction}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


"use client";

import { useSupabase } from "@/context/supabaseContext";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Location } from "@/components";
import LoadingLocationCard from "@/components/loading/LoadingLocationCard";

export const LocationsData = () => {
  const { fetchLocalizedTable } = useSupabase();
  const locale = useLocale();

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 👈 Add loading state

  const tabs = [
    { id: 2, name: "Dallas", value: "A" },
    { id: 3, name: "Houston", value: "B" },
    { id: 4, name: "San Antonio", value: "C" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // 👈 Start loading
        const data = await fetchLocalizedTable("Locations", locale);
        setAllLocations(data);
        setLocationData(data);
      } catch (err) {
        console.error("❌ Error fetching location data:", err);
      } finally {
        setIsLoading(false); // 👈 Done loading
      }
    };

    fetchData();
  }, [fetchLocalizedTable, locale]);

  useEffect(() => {
    if (selectedLocationGroup === "") {
      setLocationData(allLocations);
    } else {
      const filtered = allLocations.filter(
        (loc) => loc.Group === selectedLocationGroup
      );
      setLocationData(filtered);
    }
  }, [selectedLocationGroup, allLocations]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {isLoading
          ? [...Array(9)].map((_, i) => <LoadingLocationCard key={i} />)
          : locationData.map((location) => (
              <Location
                key={location.id}
                id={location.id}
                locationName={location.title}
                number={location.phone}
                route=""
                location={location.direction}
              />
            ))}
      </div>
    </div>
  );
};
