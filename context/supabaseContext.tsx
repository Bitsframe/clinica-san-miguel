"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/@types/database.types";
import { supabase } from "@/supabaseClient";
import {
  CLINICA_TENANT_ID,
  fetchClinicaLocations,
  fetchClinicaLocationById,
  isAllowedClinicaLocationId,
} from "@/utils/clinicaLocations";

interface SupabaseContextType {
  supabase: SupabaseClient;
  aboutShort: Database["public"]["Tables"]["About_Short"]["Row"][];
  aboutShort_es: Database["public"]["Tables"]["About_Short_es"]["Row"][];
  about: Database["public"]["Tables"]["about"]["Row"][];
  about_es: Database["public"]["Tables"]["about_es"]["Row"][];
  mission: Database["public"]["Tables"]["Mission"]["Row"][];
  mission_es: Database["public"]["Tables"]["Mission_es"]["Row"][];
  blogs: Database["public"]["Tables"]["Blog"]["Row"][];
  additionalServices: Database["public"]["Tables"]["Additional_Services"]["Row"][];
  faqs: Database["public"]["Tables"]["FAQs"]["Row"][];
  faqs_es: Database["public"]["Tables"]["FAQs_es"]["Row"][];
  heroSection: Database["public"]["Tables"]["Hero_Section"]["Row"][];
  heroSection_es: Database["public"]["Tables"]["Hero_Section_es"]["Row"][];
  locations: Database["public"]["Tables"]["Locations"]["Row"][];
  locationImages: Database["public"]["Tables"]["Images"]["Row"][];
  services: Database["public"]["Tables"]["services"]["Row"][];
  services_es: Database["public"]["Tables"]["services_es"]["Row"][];
  detailData: Record<string, any[]>;
  filteredData: any[];
  searchedData: any[];
  specials: Database["public"]["Tables"]["Specials"]["Row"][];
  testinomial: Database["public"]["Tables"]["Testinomial"]["Row"][];
  career: Database["public"]["Tables"]["career"]["Row"][];
  career_es: Database["public"]["Tables"]["career_es"]["Row"][];
  features: Database["public"]["Tables"]["features"]["Row"][]; // <-- Add this
  features_es: Database["public"]["Tables"]["features_es"]["Row"][];

  fetchLocalizedRowById: <T extends TableName>(
  baseTable: T,
  locale: string,
  id: number
) => Promise<Database["public"]["Tables"][T]["Row"] | null>;

  fetchDetailedData: (table: string, id: number) => Promise<void>;
  fetchFilteredData: (
    table: string,
    column_name: string,
    id: number
  ) => Promise<void>;
  fetchSearchedData: (
    table: string,
    column_name: string,
    title: string
  ) => Promise<void>;


    fetchTableRows: <T extends keyof Database["public"]["Tables"]>(
    table: T
  ) => Promise<Database["public"]["Tables"][T]["Row"][]>;


    fetchLocalizedTable: <T extends keyof Database["public"]["Tables"]>(
    baseTable: T,
    locale: string
  ) => Promise<Database["public"]["Tables"][T]["Row"][]>;
}





const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [aboutShort, setAboutShort] = useState<
    Database["public"]["Tables"]["About_Short"]["Row"][]
  >([]);
  const [aboutShort_es, setAboutShort_es] = useState<
    Database["public"]["Tables"]["About_Short"]["Row"][]
  >([]);
  const [about, setAbout] = useState<
    Database["public"]["Tables"]["about"]["Row"][]
  >([]);
  const [about_es, setAbout_es] = useState<
    Database["public"]["Tables"]["about_es"]["Row"][]
  >([]);
  const [mission, setMission] = useState<
    Database["public"]["Tables"]["Mission"]["Row"][]
  >([]);
  const [mission_es, setMission_es] = useState<
    Database["public"]["Tables"]["Mission_es"]["Row"][]
  >([]);
  const [blogs, setBlogs] = useState<
    Database["public"]["Tables"]["Blog"]["Row"][]
  >([]);
  const [additionalServices, setAdditionalServices] = useState<
    Database["public"]["Tables"]["Additional_Services"]["Row"][]
  >([]);
  const [faqs, setFaqs] = useState<
    Database["public"]["Tables"]["FAQs"]["Row"][]
  >([]);
  const [faqs_es, setFaqs_es] = useState<
    Database["public"]["Tables"]["FAQs_es"]["Row"][]
  >([]);
  const [heroSection, setHeroSection] = useState<
    Database["public"]["Tables"]["Hero_Section"]["Row"][]
  >([]);
  const [heroSection_es, setHeroSection_es] = useState<
    Database["public"]["Tables"]["Hero_Section_es"]["Row"][]
  >([]);
  const [locations, setLocations] = useState<
    Database["public"]["Tables"]["Locations"]["Row"][]
  >([]);
  const [locationImages, setLocationImages] = useState<
    Database["public"]["Tables"]["Images"]["Row"][]
  >([]);
  const [services, setServices] = useState<
    Database["public"]["Tables"]["services"]["Row"][]
  >([]);
  const [services_es, setServices_es] = useState<
    Database["public"]["Tables"]["services_es"]["Row"][]
  >([]);
  
  // const [detailData, setDetailData] = useState<
  //   Database["public"]["Tables"]["services"]["Row"][]
  // >([]);
  const [detailData, setDetailData] = useState<Record<string, any[]>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchedData, setSearchedData] = useState<any[]>([]);
  const [specials, setSpecials] = useState<
    Database["public"]["Tables"]["Specials"]["Row"][]
  >([]);
  const [testinomial, setTestinomial] = useState<
    Database["public"]["Tables"]["Testinomial"]["Row"][]
  >([]);
  const [career, setCareer] = useState<
    Database["public"]["Tables"]["career"]["Row"][]
  >([]);

  const [features, setFeatures] = useState<
    Database["public"]["Tables"]["features"]["Row"][]
  >([]);

  const [features_es, setFeatures_es] = useState<Database["public"]["Tables"]["features_es"]["Row"][]>([]);

  const [career_es, setCareer_es] = useState<
    Database["public"]["Tables"]["career_es"]["Row"][]
  >([]);
   const getRows = useCallback(fetchTableRows, []);

  // for all records
  const fetchData = async (table: string, setter: Function) => {
    try {
      const { data, error } = await supabase.from(table).select("*");
      console.log(data, `${table} Data`);
      if (data) {
        setter(data);
      }
    } catch (error) {
      console.error(`Error fetching ${table} data:`, error);
    }
  };

  




  // for any unique record
  const fetchDetailedData = async (table: string, id: number) => {
    try {
      if (table === "Locations") {
        const allowed = await isAllowedClinicaLocationId(supabase, id);
        if (!allowed) {
          setDetailData({ [table]: [] });
          return;
        }
      }

      let query = supabase.from(table).select("*").eq("id", id);
      if (table === "Locations") {
        query = query.eq("tenant_id", CLINICA_TENANT_ID);
      }

      const { data, error } = await query;
      console.log(data, `${table} Data`);
      if (data) {
        setDetailData({ [table]: data });
      }
    } catch (error) {
      console.error(`Error fetching ${table} data:`, error);
    }
  };

  // fetch filtered data based on column id
  const fetchFilteredData = async (
    table: string,
    column_name: string,
    id: number
  ) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(column_name, id);
      console.log(data, `${table} Data`);
      if (data) {
        setFilteredData(data);
      }
    } catch (error) {
      console.error(`Error fetching ${table} data:`, error);
    }
  };


const fetchLocalizedTable = useCallback(
  async <T extends TableName>(
    baseTable: T,
    locale: string
  ): Promise<TableRows<T>> => {
    if (baseTable === "Locations") {
      return (await fetchClinicaLocations(supabase, locale)) as TableRows<T>;
    }

    if (locale === "es") {
      const localizedTableName = `${String(baseTable)}_es` as TableName;

      try {
        const localizedRows = (await fetchTableRows(localizedTableName)) as TableRows<T>;

        if (localizedRows && localizedRows.length > 0) {
          return localizedRows;
        }

        console.warn(
          `[Supabase] No records found in ${localizedTableName}. Falling back to ${String(
            baseTable
          )}.`
        );
      } catch (error) {
        console.warn(
          `[Supabase] Failed to fetch ${localizedTableName}. Falling back to ${String(
            baseTable
          )}.`,
          error
        );
      }
    }

    return await fetchTableRows(baseTable);
  },
  []
);


const fetchLocalizedRowById = useCallback(
  async <T extends TableName>(
    baseTable: T,
    locale: string,
    id: number
  ): Promise<Database["public"]["Tables"][T]["Row"] | null> => {
    if (baseTable === "Locations") {
      return (await fetchClinicaLocationById(supabase, locale, id)) as
        | Database["public"]["Tables"][T]["Row"]
        | null;
    }

    const tableName = (locale === "es" ? `${baseTable}_es` : baseTable) as T;

    const { data, error } = await supabase.from(tableName).select("*").eq("id", id);

    console.log(`🟢 Supabase response from ${tableName} for id=${id}:`, {
      data,
      error,
    });

    if (error) {
      console.error(`❌ Error fetching from ${tableName}:`, error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No records found in ${tableName} for id=${id}`);
      return null;
    }

    return data[0];
  },
  []
);





  const fetchSearchedData = async (
    table: string,
    column_name: string,
    title: string
  ) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(column_name, title);

      if (data) {
        setSearchedData(data);
      }
    } catch (error) {
      console.log(`Error searching ${table}: `, error);
    }
  };

  const fetchDataCallback = useCallback(fetchData, []);
  const fetchDetailedDataCallback = useCallback(fetchDetailedData, []);
  const fetchFilteredDataCallback = useCallback(fetchFilteredData, []);
  const fetchSearchedDataCallback = useCallback(fetchSearchedData, []);

  useEffect(() => {
    // fetchDataCallback("About_Short", setAboutShort);
    // fetchDataCallback("About_Short_es", setAboutShort_es);
    // fetchDataCallback("about", setAbout);
    // fetchDataCallback("about_es", setAbout_es);
    // fetchDataCallback("Mission", setMission);
    // fetchDataCallback("Mission_es", setMission_es);
    // fetchDataCallback("Blog", setBlogs);
    // fetchDataCallback("Additional_Services", setAdditionalServices);
    // fetchDataCallback("FAQs", setFaqs);
    // fetchDataCallback("FAQs_es", setFaqs_es);
    // fetchDataCallback("Hero_Section", setHeroSection);
    // fetchDataCallback("Hero_Section_es", setHeroSection_es);
    // fetchDataCallback("Locations", setLocations);
    fetchDataCallback("Images", setLocationImages);
    fetchDataCallback("services", setServices);
    fetchDataCallback("services_es", setServices_es);
    // fetchDataCallback("Specials", setSpecials);
    // fetchDataCallback("Testinomial", setTestinomial);
    // fetchDataCallback("career", setCareer);
    // fetchDataCallback("career_es", setCareer_es);
    // fetchDataCallback("features", setFeatures);
    // fetchDataCallback("features_es", setFeatures_es);
  }, [fetchDataCallback]);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        aboutShort,
        aboutShort_es,
        about,
        about_es,
        mission,
        mission_es,
        blogs,
        additionalServices,
        faqs,
        faqs_es,
        heroSection,
        heroSection_es,
        locations,
        locationImages,
        services,
        services_es,
        specials,
        testinomial,
        career,
        career_es,
        detailData,
        filteredData,
        searchedData,
        features, 
        features_es,
         fetchTableRows: getRows,
         fetchLocalizedRowById,
        fetchLocalizedTable,
        fetchDetailedData: fetchDetailedDataCallback,
        fetchFilteredData: fetchFilteredDataCallback,
        fetchSearchedData: fetchSearchedDataCallback,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};


type TableName = keyof Database["public"]["Tables"];
type TableRows<T extends TableName> =
  Database["public"]["Tables"][T]["Row"][];

export async function fetchTableRows<T extends TableName>(
  table: T
): Promise<TableRows<T>> {
  const { data, error } = await supabase.from(table).select("*");

  if (error) throw error;
  return data as TableRows<T>;
}
