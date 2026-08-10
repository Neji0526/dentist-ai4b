import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Anonymous, cookie-less client for reading published content in Server
 * Components. Row Level Security limits it to public rows, and because there
 * is no user session attached the responses stay cacheable.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
