


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
import { lookupZipcode, isZipcode, findNearestLocations } from "@/utils/zipcodeService";
import { useSearchParams } from "next/navigation";

export const LocationsData = () => {
  const { fetchLocalizedTable } = useSupabase();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 👈 Add loading state
  const [isSearching, setIsSearching] = useState(false); // 👈 Add searching state

  const tabs = [
    { id: 2, name: "Dallas", value: "A" },
    { id: 3, name: "Houston", value: "B" },
    { id: 4, name: "San Antonio", value: "C" },
  ];

  /* ───────────── Set initial filter from URL params ───────────── */
  useEffect(() => {
    if (cityParam) {
      const cityMap: { [key: string]: string } = {
        'all': '',
        'dallas': 'A',
        'houston': 'B',
        'sanantonio': 'C'
      };
      const groupValue = cityMap[cityParam.toLowerCase()];
      if (groupValue !== undefined) {
        setSelectedLocationGroup(groupValue);
      }
    }
  }, [cityParam]);

  /* ───────────── debounce search query ───────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query]);

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
    const filterLocations = async () => {
      setIsSearching(true); // 👈 Start searching
      try {
        let filtered = [...allLocations];

        // Filter by group
        if (selectedLocationGroup !== "") {
          filtered = filtered.filter(
            (loc) => loc.Group === selectedLocationGroup
          );
        }

        // Filter by search query (using debounced query)
        if (debouncedQuery.trim() !== "") {
          const searchQuery = debouncedQuery.trim();
          
          // Check if user entered a zipcode
          if (isZipcode(searchQuery)) {
            // Find nearest 9 locations to this zipcode
            const nearestLocations = await findNearestLocations(
              searchQuery,
              filtered.length > 0 ? filtered : allLocations,
              9 // Show 9 nearest locations
            );
            
            if (nearestLocations.length > 0) {
              filtered = nearestLocations;
              console.log(`✅ Found ${nearestLocations.length} nearest locations for zipcode ${searchQuery}:`, 
                nearestLocations.map(l => ({
                  name: l.title,
                  distance: `${l.distance} miles`
                }))
              );
            } else {
              // No results found for this zipcode
              console.log(`ℹ️ No locations found for zipcode ${searchQuery}`);
              filtered = [];
            }
          } else {
            // Regular search by location name or address
            filtered = filtered.filter((loc) =>
              loc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
        }

        setLocationData(filtered);
      } finally {
        setIsSearching(false); // 👈 Done searching
      }
    };

    filterLocations();
  }, [selectedLocationGroup, debouncedQuery, allLocations]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 px-4 sm:pr-32">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            // If input is all numbers, limit to 5 digits
            if (/^\d+$/.test(value)) {
              if (value.length <= 5) {
                setQuery(value);
              }
            } else {
              // Allow any text for location name search
              setQuery(value);
            }
          }}
          placeholder="Search by location name or zipcode..."
          className="w-full sm:w-[400px] bg-white text-[#6C7582] placeholder-[#6C7582] font-poppins text-[16px] px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#C1001F] focus:outline-none"
        />
        <select
          value={selectedLocationGroup}
          onChange={(e) => setSelectedLocationGroup(e.target.value)}
          className="w-[180px] bg-[#EAEAEA] h-[45px] rounded-[12px] border-none outline-none"
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
        {isLoading || isSearching
          ? [...Array(9)].map((_, i) => <LoadingLocationCard key={i} />)
          : locationData.map((location) => {
              const addr = (location.address || "").trim();
              const mapValue = addr.length >= 3
                ? addr
                : (location.direction || location.title);
              return (
                <Location
                  key={location.id}
                  id={location.id}
                  locationName={location.title}
                  number={location.phone}
                  route=""
                  // Prefer clean address; if missing/blank, fallback to pb or title
                  location={mapValue}
                />
              );
            })}
      </div>
    </div>
  );
};
