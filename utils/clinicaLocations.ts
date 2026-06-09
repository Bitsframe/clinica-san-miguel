import type { SupabaseClient } from "@supabase/supabase-js";

/** Clinica San Miguel website only serves locations for this tenant. */
export const CLINICA_TENANT_ID = 1;

export type LocationWithTenant = {
  id: number;
  tenant_id?: number | null;
  [key: string]: unknown;
};

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

  if (error) throw error;
  return (data ?? []).map((row) => row.id);
}

export async function fetchClinicaLocations(
  supabase: SupabaseClient,
  locale: string
): Promise<Record<string, unknown>[]> {
  const allowedIds = await fetchClinicaTenantLocationIds(supabase);
  if (allowedIds.length === 0) return [];

  const tableName = locale === "es" ? "Locations_es" : "Locations";
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .in("id", allowedIds);

  if (error) throw error;

  if (tableName === "Locations") {
    return filterClinicaTenantLocations(
      (data ?? []) as LocationWithTenant[]
    ) as Record<string, unknown>[];
  }

  return data ?? [];
}

export async function isAllowedClinicaLocationId(
  supabase: SupabaseClient,
  id: number
): Promise<boolean> {
  const allowedIds = await fetchClinicaTenantLocationIds(supabase);
  return allowedIds.includes(id);
}
