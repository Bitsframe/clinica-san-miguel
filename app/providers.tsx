"use client";

import { SupabaseProvider } from "@/context/supabaseContext";

export function Providers({ children }: any) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}
