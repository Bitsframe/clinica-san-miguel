"use client";

import { SupabaseProvider } from "@/context/supabaseContext";
import BotProvider from "../context/Context";

export function Providers({ children }: any) {
  return (
    <SupabaseProvider>
      <BotProvider>{children}</BotProvider>
    </SupabaseProvider>
  );
}
