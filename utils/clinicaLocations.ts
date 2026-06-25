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

  if (error) {
    return [];
  }

  return (data ?? []).map((row) => row.id);
}

export async function fetchClinicaLocations(
  supabase: SupabaseClient
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from("Locations")
    .select("*")
    .eq("tenant_id", CLINICA_TENANT_ID);

  if (error) {
    return [];
  }

  return filterClinicaTenantLocations(
    (data ?? []) as LocationWithTenant[]
  ) as Record<string, unknown>[];
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
  id: number
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from("Locations")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", CLINICA_TENANT_ID)
    .maybeSingle();

  if (error || !data || !isClinicaTenantLocation(data as LocationWithTenant)) {
    return null;
  }

  return data;
}
