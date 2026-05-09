import { createClient } from "@supabase/supabase-js";
import { Database } from "@/@types/database.types";

/** Publishable key (sb_publishable_...) or legacy anon JWT — both work with createClient. */
export function getSupabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  getSupabasePublishableKey()
);
