import { createClient } from "@supabase/supabase-js";
import { Database } from "@/@types/database.types";

// Dummy credentials for CI/testing environments
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-supabase.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
