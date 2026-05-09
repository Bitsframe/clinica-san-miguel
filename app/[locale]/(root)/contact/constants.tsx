


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
import {
  normalizeZip5,
  findNearestLocationsForZipSearch,
  zipSearchDebounceMs,
  isPartialNumericZipInput,
  parseDistanceMiles,
} from "@/utils/zipcodeService";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const LocationsData = () => {
  const { fetchLocalizedTable } = useSupabase();
  const locale = useLocale();
  const th = useTranslations("home");
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 👈 Add loading state
  const [zipRanking, setZipRanking] = useState(false);

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

  /* ───────────── debounce search query (fast for ZIP digits) ───────────── */
  useEffect(() => {
    const ms = zipSearchDebounceMs(query);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, ms);

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
    let cancelled = false;

    const filterLocations = async () => {
      let filtered = [...allLocations];

      if (selectedLocationGroup !== "") {
        filtered = filtered.filter(
          (loc) => loc.Group === selectedLocationGroup
        );
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
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full gap-2 px-4 sm:pr-32">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
        <div className="flex flex-col w-full sm:w-[400px] gap-2">
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
          className="w-full bg-white text-[#6C7582] placeholder-[#6C7582] font-poppins text-[16px] px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#C1001F] focus:outline-none"
        />
        {isPartialNumericZipInput(query.trim()) && (
          <p className="font-poppins text-[12px] text-[#6B7280] px-1">
            {th("section2_zip_need_five_digits")}
          </p>
        )}
        {normalizeZip5(query.trim()) &&
          !isPartialNumericZipInput(query.trim()) && (
          <p className="font-poppins text-[12px] text-[#6B7280] px-1">
            {zipRanking
              ? th("section2_zip_updating_distances")
              : th("section2_zip_distances_for", {
                  zip: normalizeZip5(query.trim())!,
                })}
          </p>
        )}
        </div>
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
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {isLoading
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
                  location={mapValue}
                  distanceMiles={parseDistanceMiles(location.distance)}
                />
              );
            })}
      </div>
    </div>
  );
};
