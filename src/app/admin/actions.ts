"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import type { ActionState } from "@/lib/admin/action-state";
import { getResource, type Field } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { slugify } from "@/lib/validation";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

function readString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Turns form input into a column value according to the field's declared type. */
function coerce(field: Field, form: FormData, row: Record<string, unknown>) {
  const raw = readString(form, field.name);

  switch (field.type) {
    case "boolean":
      // An unchecked checkbox submits nothing at all.
      return form.get(field.name) !== null;

    case "number": {
      if (raw === "") return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    }

    case "list":
      return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    case "slug": {
      const source = field.slugFrom ? String(row[field.slugFrom] ?? "") : "";
      return slugify(raw || source);
    }

    case "datetime":
    case "date": {
      if (raw === "") return null;
      const parsed = Date.parse(raw);
      return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
    }

    default:
      return raw === "" ? null : raw;
  }
}

function buildRow(resourceKey: string, form: FormData) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown content type: ${resourceKey}`);

  const row: Record<string, unknown> = {};

  // Two passes so a slug can be derived from a title parsed in the same submit.
  for (const field of resource.fields) {
    if (field.type !== "slug") row[field.name] = coerce(field, form, row);
  }
  for (const field of resource.fields) {
    if (field.type === "slug") row[field.name] = coerce(field, form, row);
  }

  const missing = resource.fields
    .filter((field) => field.required && !row[field.name])
    .map((field) => field.label);

  if (missing.length > 0) {
    throw new Error(`Please fill in: ${missing.join(", ")}.`);
  }

  return { resource, row };
}

function purge(paths: string[]) {
  for (const path of paths) revalidatePath(path);
  revalidatePath("/admin", "layout");
  revalidatePath("/sitemap.xml");
}

// ---------------------------------------------------------------------------
// Content CRUD
// ---------------------------------------------------------------------------

export async function createRowAction(
  resourceKey: string,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const { supabase } = await requireAdmin();
    const { resource, row } = buildRow(resourceKey, form);

    const { error } = await supabase.from(resource.table).insert(row);
    if (error) throw new Error(error.message);

    purge(resource.revalidate(row));
    redirectTo = `/admin/content/${resource.key}?created=1`;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }

  // redirect() throws, so it must happen outside the try block.
  redirect(redirectTo!);
}

export async function updateRowAction(
  resourceKey: string,
  id: string,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const { supabase } = await requireAdmin();
    const { resource, row } = buildRow(resourceKey, form);

    const { error } = await supabase
      .from(resource.table)
      .update(row)
      .eq("id", id);
    if (error) throw new Error(error.message);

    purge(resource.revalidate(row));
    redirectTo = `/admin/content/${resource.key}?updated=1`;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }

  redirect(redirectTo!);
}

export async function deleteRowAction(resourceKey: string, id: string) {
  const { supabase } = await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown content type: ${resourceKey}`);

  const { data, error } = await supabase
    .from(resource.table)
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);

  purge(resource.revalidate((data as Record<string, unknown>) ?? {}));
  redirect(`/admin/content/${resource.key}?deleted=1`);
}

/** Publish toggle straight from the list view. */
export async function togglePublishedAction(
  resourceKey: string,
  id: string,
  next: boolean,
) {
  const { supabase } = await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown content type: ${resourceKey}`);

  const { data, error } = await supabase
    .from(resource.table)
    .update({ is_published: next })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);

  purge(resource.revalidate((data as Record<string, unknown>) ?? {}));
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export async function updateLeadStatusAction(id: string, status: string) {
  const { supabase } = await requireAdmin();

  if (!isLeadStatus(status)) throw new Error(`Unknown lead status: ${status}`);

  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}

export async function updateLeadNotesAction(
  id: string,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();

    const notes = readString(form, "internal_notes");
    const status = readString(form, "status");

    const patch: Record<string, unknown> = { internal_notes: notes || null };
    if (status) {
      if (!isLeadStatus(status)) throw new Error(`Unknown lead status: ${status}`);
      patch.status = status;
    }

    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin", "layout");
    return { status: "success", message: "Lead updated." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}

export async function deleteLeadAction(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
  redirect("/admin/leads?deleted=1");
}

// ---------------------------------------------------------------------------
// Site settings (clinic details + default SEO)
// ---------------------------------------------------------------------------

const SETTINGS_TEXT_FIELDS = [
  "clinic_name",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address_line",
  "city",
  "state",
  "postal_code",
  "map_embed_url",
  "emergency_note",
  "default_meta_title",
  "default_meta_description",
  "og_image_url",
  "hero_image_url",
  "facebook_url",
  "instagram_url",
  "yelp_url",
  "google_reviews_url",
] as const;

export async function updateSettingsAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();

    const patch: Record<string, unknown> = { id: 1 };
    for (const key of SETTINGS_TEXT_FIELDS) {
      const value = readString(form, key);
      patch[key] = value || null;
    }

    if (!patch.clinic_name) throw new Error("The clinic name is required.");

    // Opening hours arrive as paired day / hours rows.
    const days = form.getAll("hours_days").map(String);
    const hours = form.getAll("hours_value").map(String);
    patch.opening_hours = days
      .map((day, index) => ({
        days: day.trim(),
        hours: (hours[index] ?? "").trim(),
      }))
      .filter((entry) => entry.days && entry.hours);

    const { error } = await supabase
      .from("site_settings")
      .upsert(patch, { onConflict: "id" });
    if (error) throw new Error(error.message);

    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");

    return { status: "success", message: "Clinic details saved." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}

/** Deliberately not admin-gated: anyone signed in must be able to sign out. */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
