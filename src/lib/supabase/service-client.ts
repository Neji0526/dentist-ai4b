import "server-only";

import { createClient } from "@supabase/supabase-js";

import { SUPABASE_URL } from "./env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export const isServiceRoleConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

/**
 * Bypasses Row Level Security. Server-side only, and only for work the
 * anonymous role legitimately cannot do — never import this from a Client
 * Component.
 */
export function createServiceRoleClient() {
  if (!isServiceRoleConfigured) return null;

  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
