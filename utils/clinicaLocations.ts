import type { SupabaseClient } from "@supabase/supabase-js";

/** Clinica San Miguel website only serves locations for this tenant. */
export const CLINICA_TENANT_ID = 1;

export type LocationWithTenant = {
  id: number;
  tenant_id?: number | null;
  [key: string]: unknown;
};

type SupabaseQueryError = {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

export function formatSupabaseError(error: unknown): string {
  if (error == null) return "Unknown error";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  const pgError = error as SupabaseQueryError;
  if (pgError.message) {
    return pgError.code
      ? `${pgError.message} (${pgError.code})`
      : pgError.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function isClinicaTenantLocation(
  location: LocationWithTenant
): boolean {
  return Number(location.tenant_id) === CLINICA_TENANT_ID;
}

export function filterClinicaTenantLocations<T extends LocationWithTenant>(
  locations: T[]
): T[] {
  return locations.filter(isClinicaTenantLocation);
}

export async function fetchClinicaTenantLocationIds(
  supabase: SupabaseClient
): Promise<number[]> {
  const { data, error } = await supabase
    .from("Locations")
    .select("id")
    .eq("tenant_id", CLINICA_TENANT_ID);

  if (error) {
    console.warn(
      "[Locations] Failed to load tenant location ids:",
      formatSupabaseError(error)
    );
    return [];
  }

  return (data ?? []).map((row) => row.id);
}

async function fetchClinicaLocationsFromBaseTable(
  supabase: SupabaseClient
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from("Locations")
    .select("*")
    .eq("tenant_id", CLINICA_TENANT_ID);

  if (error) {
    console.warn(
      "[Locations] Failed to load base Locations table:",
      formatSupabaseError(error)
    );
    return [];
  }

  return filterClinicaTenantLocations(
    (data ?? []) as LocationWithTenant[]
  ) as Record<string, unknown>[];
}

async function fetchSpanishLocationsIfAvailable(
  supabase: SupabaseClient,
  allowedIds: number[]
): Promise<Record<string, unknown>[] | null> {
  if (allowedIds.length === 0) return null;

  try {
    const { data, error } = await supabase
      .from("Locations_es")
      .select("*")
      .in("id", allowedIds);

    // Locations_es is optional — table may not exist in this project yet.
    if (error) {
      console.warn(
        "[Locations] Locations_es unavailable, using Locations fallback:",
        formatSupabaseError(error)
      );
      return null;
    }

    if (data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.warn(
      "[Locations] Locations_es query failed, using Locations fallback:",
      formatSupabaseError(error)
    );
  }

  return null;
}

export async function fetchClinicaLocations(
  supabase: SupabaseClient,
  locale: string
): Promise<Record<string, unknown>[]> {
  const allowedIds = await fetchClinicaTenantLocationIds(supabase);

  if (locale === "es") {
    const localizedRows = await fetchSpanishLocationsIfAvailable(
      supabase,
      allowedIds
    );
    if (localizedRows) return localizedRows;
  }

  const baseRows = await fetchClinicaLocationsFromBaseTable(supabase);
  return baseRows;
}

export async function isAllowedClinicaLocationId(
  supabase: SupabaseClient,
  id: number
): Promise<boolean> {
  const allowedIds = await fetchClinicaTenantLocationIds(supabase);
  return allowedIds.includes(id);
}

export async function fetchClinicaLocationById(
  supabase: SupabaseClient,
  locale: string,
  id: number
): Promise<Record<string, unknown> | null> {
  const allowed = await isAllowedClinicaLocationId(supabase, id);
  if (!allowed) return null;

  if (locale === "es") {
    const { data, error } = await supabase
      .from("Locations_es")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  }

  const { data, error } = await supabase
    .from("Locations")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", CLINICA_TENANT_ID)
    .maybeSingle();

  if (error) {
    console.warn(
      `[Locations] Failed to load location id=${id}:`,
      formatSupabaseError(error)
    );
    return null;
  }

  if (!data || !isClinicaTenantLocation(data as LocationWithTenant)) {
    return null;
  }

  return data;
}
