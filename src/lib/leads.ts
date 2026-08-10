import "server-only";

import { createPublicClient } from "./supabase/public-client";
import type { NewLead } from "./types";

export type CreateLeadResult =
  | { ok: true; demo: boolean }
  | { ok: false; message: string };

/**
 * Inserts a lead. Uses the anonymous key, which the "leads: public create"
 * RLS policy allows to INSERT but never to SELECT — so a stolen anon key
 * cannot be used to read patient enquiries back out.
 */
export async function createLead(lead: NewLead): Promise<CreateLeadResult> {
  const supabase = createPublicClient();

  if (!supabase) {
    // Demo mode: no database attached. Log it so the submission is still
    // visible to whoever is running the site locally.
    console.info("[lead] (demo mode, not persisted)", {
      ...lead,
      received_at: new Date().toISOString(),
    });
    return { ok: true, demo: true };
  }

  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? null,
    service: lead.service ?? null,
    service_id: lead.service_id ?? null,
    preferred_date: lead.preferred_date ?? null,
    preferred_time: lead.preferred_time ?? null,
    message: lead.message ?? null,
    source: lead.source ?? "website",
    page_path: lead.page_path ?? null,
  });

  if (error) {
    console.error("[lead] insert failed", error);
    return {
      ok: false,
      message:
        "We couldn't save your request. Please call us and we'll book you in right away.",
    };
  }

  return { ok: true, demo: false };
}

/**
 * Small in-process throttle. Enough to blunt casual form spam; put a real
 * WAF or Turnstile in front of the route for anything more determined.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    HITS.set(key, recent);
    return true;
  }

  recent.push(now);
  HITS.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (HITS.size > 5000) {
    for (const [k, times] of HITS) {
      if (times.every((t) => now - t >= WINDOW_MS)) HITS.delete(k);
    }
  }

  return false;
}
