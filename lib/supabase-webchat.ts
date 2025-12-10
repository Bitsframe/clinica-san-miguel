import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_WEBCHAT;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_WEBCHAT;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('WebChat Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL_WEBCHAT and NEXT_PUBLIC_SUPABASE_ANON_KEY_WEBCHAT');
}

export const supabaseWebchat = createClient(supabaseUrl, supabaseAnonKey);
