"use server";

import { headers } from "next/headers";

import { isRateLimited } from "@/lib/leads";
import { createPublicClient } from "@/lib/supabase/public-client";
import type { SubscribeState } from "@/lib/subscribe-state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Newsletter signup. Writes to `subscribers`, which — like `leads` — the
 * anonymous role may INSERT but never SELECT.
 */
export async function subscribeAction(
  _prev: SubscribeState,
  form: FormData,
): Promise<SubscribeState> {
  const raw = form.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  const source = String(form.get("source") ?? "blog");

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";

  if (isRateLimited(`subscribe:${ip}`)) {
    return {
      status: "error",
      message: "Too many attempts. Please try again a little later.",
    };
  }

  const supabase = createPublicClient();

  if (!supabase) {
    console.info("[subscribe] (demo mode, not persisted)", { email, source });
    return { status: "success", message: "You're on the list — thank you!" };
  }

  const { error } = await supabase.from("subscribers").insert({ email, source });

  if (error) {
    // 23505 is a unique violation: already subscribed, which is not a failure
    // the visitor needs to hear about.
    if (error.code === "23505") {
      return { status: "success", message: "You're already on the list — thank you!" };
    }

    console.error("[subscribe] insert failed", error);
    return {
      status: "error",
      message: "We couldn't sign you up just now. Please try again shortly.",
    };
  }

  return { status: "success", message: "You're on the list — thank you!" };
}
