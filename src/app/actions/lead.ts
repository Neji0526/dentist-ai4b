"use server";

import { headers } from "next/headers";

import { createLead, isRateLimited } from "@/lib/leads";
import { isHoneypotTripped, validateLead, type FieldErrors } from "@/lib/validation";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  /** Echoed back so the form can repopulate after a failed submit. */
  values?: Record<string, string>;
};

export const initialLeadFormState: LeadFormState = { status: "idle" };

function collectValues(form: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && key !== "company") values[key] = value;
  }
  return values;
}

async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "local";
}

export async function submitLeadAction(
  _prev: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  // Silently accept honeypot hits: telling a bot it failed only helps the bot.
  if (isHoneypotTripped(form)) {
    return { status: "success" };
  }

  const result = validateLead(form);
  if (!result.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: result.errors,
      values: collectValues(form),
    };
  }

  if (isRateLimited(await clientKey())) {
    return {
      status: "error",
      message:
        "We've already received a few requests from you. Please call us directly and we'll help straight away.",
      values: collectValues(form),
    };
  }

  const created = await createLead(result.data);
  if (!created.ok) {
    return {
      status: "error",
      message: created.message,
      values: collectValues(form),
    };
  }

  return {
    status: "success",
    message: "Request received.",
  };
}
