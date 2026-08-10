"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import type { OpeningHour, SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
};

const INPUT =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";
const LABEL = "mb-1.5 block text-sm font-medium text-ink-800";

function Text({
  name,
  label,
  defaultValue,
  placeholder,
  help,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  help?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className={LABEL} htmlFor={name}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={INPUT}
      />
      {help ? <p className="mt-1.5 text-xs text-ink-500">{help}</p> : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
      <h2 className="text-lg">{title}</h2>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{description}</p>
      ) : null}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SettingsForm({ settings, action }: Props) {
  const [state, formAction] = useActionState(action, initialActionState);
  const [hours, setHours] = useState<OpeningHour[]>(
    settings.opening_hours.length > 0
      ? settings.opening_hours
      : [{ days: "Monday – Friday", hours: "8:00 AM – 6:00 PM" }],
  );

  return (
    <form action={formAction} className="grid gap-6">
      {state.status !== "idle" && state.message ? (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${
            state.status === "success"
              ? "bg-mint-50 text-mint-800 ring-mint-100"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <Section
        title="The practice"
        description="Shown in the header, the footer and on every page title."
      >
        <Text
          name="clinic_name"
          label="Clinic name"
          defaultValue={settings.clinic_name}
          required
        />
        <Text
          name="tagline"
          label="Tagline"
          defaultValue={settings.tagline}
          placeholder="Gentle, modern dentistry for the whole family"
        />
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="emergency_note">
            Emergency note
          </label>
          <textarea
            id="emergency_note"
            name="emergency_note"
            rows={2}
            defaultValue={settings.emergency_note ?? ""}
            className={`${INPUT} resize-y`}
            placeholder="Dental emergency? Call us and we will see you the same day whenever possible."
          />
          <p className="mt-1.5 text-xs text-ink-500">
            Appears in the footer and on the appointment page.
          </p>
        </div>
      </Section>

      <Section
        title="Contact details"
        description="Used for click-to-call links, the contact page and Google's local listing data."
      >
        <Text
          name="phone"
          label="Phone"
          defaultValue={settings.phone}
          placeholder="(512) 555-0142"
          help="Drives every call button on the site."
        />
        <Text
          name="whatsapp"
          label="WhatsApp number"
          defaultValue={settings.whatsapp}
          help="Leave blank to hide WhatsApp links."
        />
        <Text
          name="email"
          label="Email"
          type="email"
          defaultValue={settings.email}
        />
        <Text
          name="address_line"
          label="Street address"
          defaultValue={settings.address_line}
        />
        <Text name="city" label="City" defaultValue={settings.city} />
        <Text name="state" label="State" defaultValue={settings.state} />
        <Text
          name="postal_code"
          label="ZIP code"
          defaultValue={settings.postal_code}
        />
        <Text
          name="map_embed_url"
          label="Map embed URL"
          type="url"
          defaultValue={settings.map_embed_url}
          help="Google Maps → Share → Embed a map → copy the src value."
        />
      </Section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
        <h2 className="text-lg">Opening hours</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
          Shown in the footer and converted into structured data for Google. Use
          formats like “Monday – Thursday” and “8:00 AM – 6:00 PM” so they parse
          correctly.
        </p>

        <div className="mt-5 grid gap-3">
          {hours.map((entry, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3">
              <input
                name="hours_days"
                defaultValue={entry.days}
                placeholder="Monday – Thursday"
                className={`${INPUT} sm:max-w-[16rem]`}
                aria-label={`Days for row ${index + 1}`}
              />
              <input
                name="hours_value"
                defaultValue={entry.hours}
                placeholder="8:00 AM – 6:00 PM"
                className={`${INPUT} sm:max-w-[16rem]`}
                aria-label={`Hours for row ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => setHours(hours.filter((_, i) => i !== index))}
                className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setHours([...hours, { days: "", hours: "" }])}
          className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
        >
          Add a row
        </button>
      </section>

      <Section
        title="Default SEO"
        description="Fallback title and description for pages that do not set their own. Keep the city in the title — it is the strongest local ranking signal you control."
      >
        <div className="sm:col-span-2">
          <Text
            name="default_meta_title"
            label="Default page title"
            defaultValue={settings.default_meta_title}
            placeholder="Dentist in Austin, TX | Brightsmile Dental Studio"
            help="50–60 characters."
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="default_meta_description">
            Default meta description
          </label>
          <textarea
            id="default_meta_description"
            name="default_meta_description"
            rows={3}
            defaultValue={settings.default_meta_description ?? ""}
            className={`${INPUT} resize-y`}
          />
          <p className="mt-1.5 text-xs text-ink-500">
            140–155 characters, ending with a call to action.
          </p>
        </div>
        <Text
          name="og_image_url"
          label="Social share image URL"
          type="url"
          defaultValue={settings.og_image_url}
          help="1200×630 works best. Used when your pages are shared."
        />
        <Text
          name="hero_image_url"
          label="Clinic hero photograph URL"
          type="url"
          defaultValue={settings.hero_image_url}
          help="Shown at the top of the services and appointment pages. Leave blank to use the illustrated artwork."
        />
        <Text
          name="team_image_url"
          label="Team photograph URL"
          type="url"
          defaultValue={settings.team_image_url}
          help="Shown at the top of the Our Dentists page. Leave blank to use the illustrated artwork."
        />
        <Text
          name="google_reviews_url"
          label="Google reviews URL"
          type="url"
          defaultValue={settings.google_reviews_url}
        />
        <Text
          name="facebook_url"
          label="Facebook URL"
          type="url"
          defaultValue={settings.facebook_url}
        />
        <Text
          name="instagram_url"
          label="Instagram URL"
          type="url"
          defaultValue={settings.instagram_url}
        />
        <Text
          name="yelp_url"
          label="Yelp URL"
          type="url"
          defaultValue={settings.yelp_url}
        />
      </Section>

      <div>
        <SaveButton />
      </div>
    </form>
  );
}
