import { NextResponse } from "next/server";

import { createLead, isRateLimited } from "@/lib/leads";
import { isHoneypotTripped, validateLead } from "@/lib/validation";

/**
 * JSON/form endpoint for the appointment form, for integrations (a landing
 * page, a chat widget, Zapier) that cannot call the Server Action.
 *
 * POST /api/leads
 *   { name, phone, email?, service?, preferred_date?, preferred_time?,
 *     message?, source? }
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let form: FormData;
  if (contentType.includes("application/json")) {
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    form = new FormData();
    if (payload && typeof payload === "object") {
      for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
        if (value != null) form.set(key, String(value));
      }
    }
  } else {
    form = await request.formData();
  }

  if (isHoneypotTripped(form)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const result = validateLead(form);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Validation failed.", fields: result.errors },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const created = await createLead({ ...result.data, source: result.data.source ?? "api" });
  if (!created.ok) {
    return NextResponse.json({ error: created.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, demo: created.demo }, { status: 201 });
}
