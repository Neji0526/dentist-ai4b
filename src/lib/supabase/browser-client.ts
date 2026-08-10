"use client";

import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/** Session-aware client for the admin panel running in the browser. */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { isSupabaseConfigured };
