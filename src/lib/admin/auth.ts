import "server-only";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Profile } from "@/lib/types";

export type AdminSession = {
  supabase: SupabaseClient;
  userId: string;
  profile: Profile;
};

export type AdminGuardResult =
  | { state: "ok"; session: AdminSession }
  | { state: "not-configured" }
  | { state: "forbidden"; email: string | null };

/**
 * Resolves the signed-in staff member and confirms they hold the admin role.
 *
 * Returns a discriminated result rather than throwing, so the admin layout can
 * render a helpful screen for each failure mode. Note this is defence in
 * depth only — the database's RLS policies are what actually protect the data.
 */
export async function resolveAdmin(): Promise<AdminGuardResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "not-configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects signed-out users; this covers direct calls.
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile as Profile).role !== "admin") {
    return { state: "forbidden", email: user.email ?? null };
  }

  return {
    state: "ok",
    session: { supabase, userId: user.id, profile: profile as Profile },
  };
}

/**
 * For admin *pages*. Returns null when Supabase is unconfigured or the account
 * lacks the admin role — the dashboard layout renders the explanation, so the
 * page itself should simply render nothing rather than throw.
 */
export async function adminSessionOrNull(): Promise<AdminSession | null> {
  const result = await resolveAdmin();
  return result.state === "ok" ? result.session : null;
}

/** For Server Actions, where a non-admin caller is simply an error. */
export async function requireAdmin(): Promise<AdminSession> {
  const result = await resolveAdmin();

  if (result.state === "not-configured") {
    throw new Error("Supabase is not configured.");
  }
  if (result.state === "forbidden") {
    throw new Error("You do not have permission to perform this action.");
  }

  return result.session;
}
