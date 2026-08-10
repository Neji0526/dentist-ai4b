import type { NewLead } from "./types";

export type FieldErrors = Record<string, string>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Digits only, so "(512) 555-0142" and "512.555.0142" both pass. */
function digitCount(value: string) {
  return (value.match(/\d/g) ?? []).length;
}

function str(form: FormData, key: string) {
  const raw = form.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Validates an appointment / contact submission.
 * Deliberately forgiving: a lead form that rejects a real patient over a
 * phone-number format costs more than it saves.
 */
export function validateLead(form: FormData): ValidationResult<NewLead> {
  const errors: FieldErrors = {};

  const name = str(form, "name");
  const phone = str(form, "phone");
  const email = str(form, "email");
  const service = str(form, "service");
  const message = str(form, "message");
  const preferredDate = str(form, "preferred_date");
  const preferredTime = str(form, "preferred_time");

  if (name.length < 2) {
    errors.name = "Please tell us your name.";
  } else if (name.length > 120) {
    errors.name = "That name is too long.";
  }

  const digits = digitCount(phone);
  if (!phone) {
    errors.phone = "We need a phone number to confirm your appointment.";
  } else if (digits < 7 || digits > 15) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (email && !EMAIL_RE.test(email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (message.length > 2000) {
    errors.message = "Please keep your message under 2000 characters.";
  }

  if (preferredDate && Number.isNaN(Date.parse(preferredDate))) {
    errors.preferred_date = "Please choose a valid date.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      phone,
      email: email || null,
      service: service || null,
      preferred_date: preferredDate || null,
      preferred_time: preferredTime || null,
      message: message || null,
      source: str(form, "source") || "website",
      page_path: str(form, "page_path") || null,
    },
  };
}

/** Bots fill in every field they find, including the one nobody can see. */
export function isHoneypotTripped(form: FormData) {
  return str(form, "company").length > 0;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
